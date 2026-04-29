import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AUDIO_OPTIONS, AudioMode } from '../../constants/verify';
import { s } from '../../styles/verify.styles';
import { P } from '../../constants/colors';

type Props = {
  audioUri: string | null;
  audioName: string | null;
  audioMode: AudioMode;
  isRecording: boolean;
  onPickAudio: () => void;
  onClearAudio: () => void;
  onToggleRecording: () => void;
  onSelectMode: (mode: AudioMode) => void;
};

export default function VerifyAudioTab({
  audioUri, audioName, audioMode, isRecording,
  onPickAudio, onClearAudio, onToggleRecording, onSelectMode,
}: Props) {
  return (
    <View>
      <Text style={s.sectionLabel}>— ENREGISTRER OU IMPORTER</Text>

      <View style={s.audioZone}>
        <TouchableOpacity
          style={[s.recordBtn, isRecording && s.recordBtnActive]}
          onPress={onToggleRecording}
          activeOpacity={0.85}
          testID="record-button"
        >
          <Ionicons name={isRecording ? 'stop' : 'mic'} size={28} color={P.streakBg} />
        </TouchableOpacity>

        <View  style={s.waveform}>
          {Array.from({ length: 28 }).map((_, i) => (
            <View
              key={i}
              style={[
                s.waveBar,
                { height: 8 + Math.sin(i * 0.7) * 14, opacity: isRecording ? 1 : 0.35 },
              ]}
            />
          ))}
        </View>

        <Text style={s.audioTimer}>
          {isRecording ? '00:18 · enregistrement en cours' : 'Appuyez pour enregistrer'}
        </Text>
      </View>

      <View style={s.orRow}>
        <View style={s.orLine} />
        <Text style={s.orText}>— ou —</Text>
        <View style={s.orLine} />
      </View>

      <TouchableOpacity
        style={[s.importRow, audioUri && s.importRowActive]}
        onPress={onPickAudio}
        activeOpacity={0.8}
        testID="import-audio-button"
      >
        <Ionicons
          name={audioUri ? 'musical-note' : 'cloud-upload-outline'}
          size={18}
          color={P.navy}
        />

        <View style={s.flex1}>
          <Text style={s.importText}>
            {audioUri ? (audioName ?? 'Fichier audio chargé') : 'Importer un fichier audio'}
          </Text>
          {!audioUri && <Text style={s.importFormats}>MP3 · M4A · WAV · OGG</Text>}
        </View>

        {audioUri ? (
          <TouchableOpacity onPress={onClearAudio} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={P.muted} />
          </TouchableOpacity>
        ) : (
          <Ionicons name="chevron-forward" size={16} color={P.muted} />
        )}
      </TouchableOpacity>

      <Text style={s.sectionLabel}>— TYPE D'ANALYSE</Text>

      {AUDIO_OPTIONS.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[s.audioOption, audioMode === item.key && s.audioOptionActive]}
          onPress={() => onSelectMode(item.key)}
          activeOpacity={0.8}
        >
          <View style={s.audioOptionLeft}>
            <Ionicons name={item.icon} size={18} color={P.navy} />
            <View style={s.optionTextWrap}>
              <Text style={s.audioOptionTitle}>{item.label}</Text>
              <Text style={s.audioOptionSub}>{item.sub}</Text>
            </View>
          </View>

          <View style={[s.radio, audioMode === item.key && s.radioActive]}>
            {audioMode === item.key && <View style={s.radioDot} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}