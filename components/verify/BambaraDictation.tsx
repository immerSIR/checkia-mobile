import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { bambaraAPI } from '../../services/api';
import { P } from '../../constants/colors';

const MIN_RECORD_MS = 400;

type DictationState = 'idle' | 'recording' | 'transcribing' | 'translating';

type Props = {
  onTranscribed: (frenchText: string, originalBambara: string) => void;
  onError: (message: string) => void;
};

const STATUS_COPY: Record<DictationState, string> = {
  idle: 'Prêt — maintenez pour parler',
  recording: 'Écoute… relâchez pour transcrire',
  transcribing: 'Transcription en cours… (peut prendre un moment)',
  translating: 'Traduction en français…',
};

export default function BambaraDictation({ onTranscribed, onError }: Props) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [state, setState] = useState<DictationState>('idle');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const startedAtRef = useRef<number>(0);
  const isStoppingRef = useRef(false);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'recording') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.18, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 600, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        ]),
      ).start();
    } else {
      pulse.stopAnimation();
      pulse.setValue(1);
    }
  }, [state, pulse]);

  const ensurePermission = useCallback(async () => {
    const current = await AudioModule.getRecordingPermissionsAsync();
    if (current.granted) return true;
    const next = await AudioModule.requestRecordingPermissionsAsync();
    if (!next.granted) {
      setPermissionDenied(true);
      onError("Permission microphone refusée. Activez-la dans les réglages pour utiliser la dictée.");
      return false;
    }
    setPermissionDenied(false);
    return true;
  }, [onError]);

  const handlePressIn = useCallback(async () => {
    if (state !== 'idle') return;
    const allowed = await ensurePermission();
    if (!allowed) return;

    try {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
      startedAtRef.current = Date.now();
      setState('recording');
    } catch (err: any) {
      onError("Impossible de démarrer l'enregistrement. Réessayez.");
      setState('idle');
    }
  }, [state, ensurePermission, recorder, onError]);

  const runTranscribeAndTranslate = useCallback(async (uri: string) => {
    setState('transcribing');
    let transcript = '';
    try {
      const { data } = await bambaraAPI.transcribe(uri);
      transcript = (data?.text ?? '').trim();
    } catch (err: any) {
      const isTimeout = err?.code === 'ECONNABORTED' || err?.message?.includes('timeout');
      onError(
        isTimeout
          ? 'Trop long, réessayez avec un clip plus court.'
          : "Échec de la transcription. Vérifiez votre connexion et réessayez."
      );
      setState('idle');
      return;
    }

    if (!transcript) {
      onError("Aucune parole détectée. Parlez plus près du micro et réessayez.");
      setState('idle');
      return;
    }

    setState('translating');
    try {
      const { data } = await bambaraAPI.translate(transcript, 'bm', 'fr');
      const french = (data?.translated_text ?? '').trim();
      if (!french) {
        onError("La traduction est vide. Réessayez.");
        setState('idle');
        return;
      }
      onTranscribed(french, transcript);
      setState('idle');
    } catch {
      onError("Échec de la traduction. Réessayez.");
      setState('idle');
    }
  }, [onError, onTranscribed]);

  const handlePressOut = useCallback(async () => {
    if (state !== 'recording' || isStoppingRef.current) return;
    isStoppingRef.current = true;
    const elapsed = Date.now() - startedAtRef.current;

    try {
      await recorder.stop();
    } catch {
      // ignore stop errors
    }

    if (elapsed < MIN_RECORD_MS) {
      setState('idle');
      isStoppingRef.current = false;
      return;
    }

    const uri = recorder.uri;
    isStoppingRef.current = false;

    if (!uri) {
      onError("Enregistrement introuvable. Réessayez.");
      setState('idle');
      return;
    }
    await runTranscribeAndTranslate(uri);
  }, [state, recorder, runTranscribeAndTranslate, onError]);

  const isBusy = state === 'transcribing' || state === 'translating';

  return (
    <View style={d.card} testID="bambara-dictation">
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isBusy || permissionDenied}
        testID="dictation-mic"
        style={({ pressed }) => [
          d.micWrap,
          (pressed || state === 'recording') && d.micWrapActive,
          isBusy && d.micWrapBusy,
        ]}
      >
        <Animated.View style={[d.micCircle, state === 'recording' && d.micCircleActive, { transform: [{ scale: pulse }] }]}>
          {isBusy ? (
            <ActivityIndicator color={P.white} size="small" />
          ) : (
            <Ionicons
              name={state === 'recording' ? 'mic' : 'mic-outline'}
              size={32}
              color={P.white}
            />
          )}
        </Animated.View>
      </Pressable>

      <Text style={d.status}>{STATUS_COPY[state]}</Text>

      {state === 'recording' && (
        <View style={d.levelRow}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const meter = recorderState.metering ?? -160;
            const level = Math.max(0, Math.min(1, (meter + 60) / 60));
            const height = 6 + level * 24 * (0.6 + 0.4 * Math.sin((Date.now() / 120) + i));
            return <View key={i} style={[d.levelBar, { height }]} />;
          })}
        </View>
      )}

      <Text style={d.hint}>
        La transcription peut prendre quelques instants. Parlez clairement en bambara.
      </Text>
    </View>
  );
}

const d = StyleSheet.create({
  card: {
    backgroundColor: P.surface,
    borderWidth: 1,
    borderColor: P.line,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
  },
  micWrap: {
    borderRadius: 60,
    padding: 6,
    marginBottom: 16,
  },
  micWrapActive: {
    backgroundColor: 'rgba(30, 58, 138, 0.08)',
  },
  micWrapBusy: {
    opacity: 0.85,
  },
  micCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: P.navy,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: P.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  micCircleActive: {
    backgroundColor: '#C94040',
    shadowColor: '#C94040',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
    color: P.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 32,
    marginBottom: 10,
  },
  levelBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: P.navy,
  },
  hint: {
    fontSize: 11,
    color: P.muted,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 4,
  },
});
