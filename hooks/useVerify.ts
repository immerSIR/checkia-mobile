import { useRef, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { BackendStatus, factCheckAPI, imageVerificationAPI, Submission, taskAPI, TaskStatusResponse, urlPreviewAPI } from '../services/api';
import { ANALYSIS_STEPS, AudioMode, ImageMode, Tab } from '../constants/verify';

export function useVerify(router: any) {
  const timerRef = useRef<any>(null);
  const analysisTimerRef = useRef<any>(null);
  const [tab, setTab] = useState<Tab>('Texte');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [texte, setTexte] = useState('');
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<ImageMode>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
  const [audioMode, setAudioMode] = useState<AudioMode>('transcription');
  const [isRecording, setIsRecording] = useState(false);

  const canAnalyze = () => {
    if (tab === 'Texte') return texte.trim().length > 0;
    if (tab === 'URL') return url.trim().length > 0;
    if (tab === 'Image') return imageUri !== null && imageMode !== null;
    if (tab === 'Audio') return false;
    return false;
  };

  const fetchPreview = async (value: string) => {
    if (!value.startsWith('http')) return;
    setPreviewLoading(true);
    try {
      const { data } = await urlPreviewAPI.fetch(value);
      setPreview(data);
    } catch {
      setPreview(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setPreview(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchPreview(value), 800);
  };

  const clearUrl = () => {
    setUrl('');
    setPreview(null);
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
  };

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/*'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets.length > 0) {
        setAudioUri(result.assets[0].uri);
        setAudioName(result.assets[0].name);
      }
    } catch (err) {
      console.log('Erreur sélection audio:', err);
    }
  };

  const clearAudio = () => {
    setAudioUri(null);
    setAudioName(null);
  };

  const toggleRecording = () => setIsRecording((v) => !v);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const startStepTicker = () => {
    if (analysisTimerRef.current) clearInterval(analysisTimerRef.current);
    let cur = 0;
    setStep(0);
    analysisTimerRef.current = setInterval(() => {
      cur = Math.min(cur + 1, ANALYSIS_STEPS.length - 1);
      setStep(cur);
    }, 1800);
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

  const handleAnalyze = async () => {
    if (!canAnalyze()) return;
    setLoading(true);
    setError('');
    startStepTicker();

    try {
      if (tab === 'Texte') {
        const claim = texte.trim();
        const { data } = await factCheckAPI.submit({ texte: claim, source: '' });
        const submissionId = await pollTextSubmission(data.task_id, claim);
        router.push(`/result/${submissionId}?kind=text`);
        return;
      }

      if (tab === 'URL') {
        const normalizedUrl = url.trim();
        const { data } = await factCheckAPI.submit({ texte: normalizedUrl, source: normalizedUrl });
        const submissionId = await pollTextSubmission(data.task_id, normalizedUrl);
        router.push(`/result/${submissionId}?kind=text`);
        return;
      }

      if (tab === 'Image' && imageUri) {
        const response = imageMode === 'ia'
          ? await imageVerificationAPI.detectAI(imageUri)
          : await imageVerificationAPI.verifyContent(imageUri, texte.trim());
        const result = await pollImageTask(response.data.task_id);
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
    if (tab === 'URL') return 'Analyser ce lien';
    if (tab === 'Audio') return 'Audio bientôt disponible';
    return "Lancer l'analyse";
  };

  return {
    tab, setTab, loading, setLoading, step, setStep, error, setError, texte, setTexte,
    url, preview, previewLoading, imageUri, imageMode, audioUri, audioName,
    audioMode, isRecording, setImageMode, setAudioMode, handleUrlChange,
    clearUrl, pickImage, clearImage, pickAudio, clearAudio, toggleRecording,
    canAnalyze, handleAnalyze, ctaLabel,
  };
}
