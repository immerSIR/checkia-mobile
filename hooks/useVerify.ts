import { useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { BackendStatus, factCheckAPI, imageVerificationAPI, Submission, taskAPI, TaskStatusResponse } from '../services/api';
import { ANALYSIS_STEPS, ImageMode, Tab } from '../constants/verify';

export type ClaimLanguage = 'fr' | 'bm';

export function useVerify(router: any) {
  const analysisTimerRef = useRef<any>(null);
  const [tab, setTab] = useState<Tab>('Texte');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [texte, setTexte] = useState('');
  const [source, setSource] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<ImageMode>(null);
  const [imageClaim, setImageClaim] = useState('');
  const [language, setLanguageState] = useState<ClaimLanguage>('fr');
  const [translatedFromBambara, setTranslatedFromBambara] = useState(false);

  const setLanguage = (next: ClaimLanguage) => {
    if (next === language) return;
    setLanguageState(next);
    setTexte('');
    setTranslatedFromBambara(false);
    setError('');
  };

  const handleTexteEdit = (value: string) => {
    setTexte(value);
    if (translatedFromBambara) setTranslatedFromBambara(false);
  };

  const acceptBambaraTranslation = (frenchText: string) => {
    setTexte(frenchText);
    setTranslatedFromBambara(true);
    setError('');
  };

  const canAnalyze = () => {
    if (tab === 'Texte') return texte.trim().length > 0;
    if (tab === 'Image') return imageUri !== null && imageMode !== null;
    return false;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const clearImage = () => {
    setImageUri(null);
    setImageMode(null);
    setImageClaim('');
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const STEP_INTERVAL_MS = 1200;
  // Minimum perceived analysis time so the user sees the full 5-step
  // animation play out even when the backend caches and returns quickly.
  const MIN_ANALYSIS_MS = ANALYSIS_STEPS.length * STEP_INTERVAL_MS;

  const startStepTicker = () => {
    if (analysisTimerRef.current) clearInterval(analysisTimerRef.current);
    let cur = 0;
    setStep(0);
    analysisTimerRef.current = setInterval(() => {
      cur = Math.min(cur + 1, ANALYSIS_STEPS.length - 1);
      setStep(cur);
    }, STEP_INTERVAL_MS);
  };

  const stopStepTicker = () => {
    if (analysisTimerRef.current) {
      clearInterval(analysisTimerRef.current);
      analysisTimerRef.current = null;
    }
  };

  const getTaskStatus = (data: TaskStatusResponse): BackendStatus | undefined =>
    data.statut ?? data.result?.statut ?? data.status as BackendStatus | undefined;

  const getSubmissionIdFromTask = (data: TaskStatusResponse) =>
    data.submission_id ?? data.id ?? data.result?.submission_id ?? data.result?.id;

  const latestMatchingSubmission = async (claim: string): Promise<Submission | null> => {
    const { data } = await factCheckAPI.getHistory();
    return data
      .filter((item) => item.texte === claim)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null;
  };

  const pollTextSubmission = async (taskId: string, claim: string) => {
    let lastStatus: BackendStatus | undefined;

    for (let attempt = 0; attempt < 30; attempt++) {
      const { data } = await taskAPI.getStatus(taskId);
      lastStatus = getTaskStatus(data);

      if (lastStatus && lastStatus !== 'en cours') {
        const submissionId = getSubmissionIdFromTask(data);
        if (submissionId) return String(submissionId);

        const submission = await latestMatchingSubmission(claim);
        if (submission) return String(submission.id);

        throw new Error('Vérification terminée, mais le rapport est introuvable.');
      }

      await sleep(2000);
    }
    throw new Error("L'analyse prend plus de temps que prévu. Réessayez depuis l'historique.");
  };

  // After task-status reports done, the submission row may still read
  // 'en cours' briefly (separate DB read path). Wait until the row
  // itself is finalized so the result screen never shows an in-progress
  // state under the normal flow.
  const waitForSubmissionFinalized = async (submissionId: string) => {
    for (let attempt = 0; attempt < 20; attempt++) {
      try {
        const { data } = await factCheckAPI.getResult(submissionId);
        if (data.statut && data.statut !== 'en cours') return;
      } catch {
        // ignore transient errors, retry
      }
      await sleep(1500);
    }
    // Don't throw — if we time out here, the result screen will still
    // render and (eventually) the user can come back to it from history.
  };

  const pollImageTask = async (taskId: string): Promise<any> => {
    let currentTaskId = taskId;

    for (let attempt = 0; attempt < 90; attempt++) {
      const { data } = await taskAPI.getStatus(currentTaskId);

      if (data.state === 'FAILURE') {
        throw new Error(data.error || "La vérification de l'image a échoué.");
      }

      if (data.state === 'SUCCESS' && data.result) {
        if (data.result.success && data.result.task_id && !data.result.status) {
          currentTaskId = data.result.task_id;
        } else if (data.result.success && data.result.status) {
          return data.result;
        } else if (data.result.error) {
          throw new Error(data.result.error);
        }
      }

      await sleep(2000);
    }

    throw new Error("L'analyse image prend plus de temps que prévu.");
  };

  // After backend polling completes, wait until the perceived animation
  // has had time to play out, then briefly show the final step before
  // navigating to the result. Avoids the screen jumping after step 2.
  const settleAnimation = async (startedAt: number) => {
    const elapsed = Date.now() - startedAt;
    const remaining = MIN_ANALYSIS_MS - elapsed;
    if (remaining > 0) await sleep(remaining);
    setStep(ANALYSIS_STEPS.length - 1);
    await sleep(450);
  };

  const handleAnalyze = async () => {
    if (!canAnalyze()) return;
    setLoading(true);
    setError('');
    startStepTicker();
    const startedAt = Date.now();

    try {
      if (tab === 'Texte') {
        const claim = texte.trim();
        const sourceUrl = source.trim();
        const submittedInBambara = language === 'bm';
        const { data } = await factCheckAPI.submit({ texte: claim, source: sourceUrl });
        const submissionId = await pollTextSubmission(data.task_id, claim);
        await waitForSubmissionFinalized(submissionId);
        await settleAnimation(startedAt);
        const suffix = submittedInBambara ? '&bm=1' : '';
        router.push(`/result/${submissionId}?kind=text${suffix}`);
        return;
      }

      if (tab === 'Image' && imageUri) {
        const response = imageMode === 'ia'
          ? await imageVerificationAPI.detectAI(imageUri)
          : await imageVerificationAPI.verifyContent(imageUri, imageClaim.trim());
        const result = await pollImageTask(response.data.task_id);
        await settleAnimation(startedAt);
        const id = result.verification_id;
        router.push(`/result/${id}?kind=image`);
      }
    } catch (err: any) {
      setError(err.message || "Impossible de lancer l'analyse.");
    } finally {
      stopStepTicker();
      setLoading(false);
    }
  };

  const ctaLabel = () => {
    if (tab === 'Texte') return 'Analyser ce texte';
    return "Lancer l'analyse";
  };

  return {
    tab, setTab, loading, setLoading, step, setStep, error, setError, texte,
    setTexte: handleTexteEdit,
    source, setSource, imageUri, imageMode, setImageMode,
    imageClaim, setImageClaim,
    pickImage, clearImage,
    canAnalyze, handleAnalyze, ctaLabel,
    language, setLanguage,
    translatedFromBambara,
    acceptBambaraTranslation,
  };
}
