import { useRef, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { urlPreviewAPI } from '../services/api';
import { ANALYSIS_STEPS, AudioMode, ImageMode, Tab } from '../constants/verify';

export function useVerify(router: any) {
  const timerRef = useRef<any>(null);
  const [tab, setTab] = useState<Tab>('Texte');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
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
    if (tab === 'Audio') return audioUri !== null || isRecording;
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

  const handleAnalyze = () => {
    if (!canAnalyze()) return;
    setLoading(true);
    setStep(0);
    let cur = 0;
    const iv = setInterval(() => {
      cur++;
      setStep(cur);
      if (cur >= ANALYSIS_STEPS.length) {
        clearInterval(iv);
        setLoading(false);
        router.push('/result/1');
      }
    }, 1200);
  };

  const ctaLabel = () => {
    if (tab === 'Texte') return 'Analyser ce texte';
    if (tab === 'URL') return 'Analyser ce lien';
    if (tab === 'Audio') return "Analyser l'audio";
    return "Lancer l'analyse";
  };

  return {
    tab, setTab, loading, setLoading, step, setStep, texte, setTexte,
    url, preview, previewLoading, imageUri, imageMode, audioUri, audioName,
    audioMode, isRecording, setImageMode, setAudioMode, handleUrlChange,
    clearUrl, pickImage, clearImage, pickAudio, clearAudio, toggleRecording,
    canAnalyze, handleAnalyze, ctaLabel,
  };
}