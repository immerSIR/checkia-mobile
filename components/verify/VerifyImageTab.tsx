import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ImageMode } from '../../constants/verify';
import { P, s } from '../../styles/verify.styles';

type Props = {
  imageUri: string | null;
  imageMode: ImageMode;
  onPickImage: () => void;
  onClearImage: () => void;
  onSelectMode: (mode: ImageMode) => void;
};

export default function VerifyImageTab({
  imageUri, imageMode, onPickImage, onClearImage, onSelectMode,
}: Props) {
  return (
    <View>
      <Text style={s.sectionLabel}>— IMPORTER UNE IMAGE</Text>

      <TouchableOpacity style={s.uploadZone} onPress={onPickImage} activeOpacity={0.85}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={s.imagePreview} resizeMode="cover" />
        ) : (
          <>
            <View style={s.uploadIconWrap}>
              <Ionicons name="cloud-upload-outline" size={28} color={P.white} />
            </View>
            <Text style={s.uploadText}>Appuyer pour choisir</Text>
            <Text style={s.uploadSub}>JPG · PNG · WEBP · max 10Mo</Text>
          </>
        )}
      </TouchableOpacity>

      {imageUri && (
        <TouchableOpacity style={s.changeBtn} onPress={onClearImage} activeOpacity={0.8}>
          <Ionicons name="refresh-outline" size={14} color={P.muted} />
          <Text style={s.changeBtnText}>Changer l'image</Text>
        </TouchableOpacity>
      )}

      <Text style={s.sectionLabel}>— TYPE D'ANALYSE</Text>

      <View style={s.modesRow}>
        <TouchableOpacity
          style={[
            s.modeCard,
            imageMode === 'ia' ? s.modeCardPrimaryActive : s.modeCardDefault,
          ]}
          onPress={() => onSelectMode('ia')}
          activeOpacity={0.85}
        >
          <View style={[s.modeIconWrap, imageMode === 'ia' ? s.modeIconWrapDark : s.modeIconWrapLight]}>
            <Ionicons
              name="sparkles-outline"
              size={20}
              color={imageMode === 'ia' ? P.white : P.navyDark}
            />
          </View>
          <Text style={[s.modeTitle, imageMode === 'ia' ? s.modeTitleWhite : s.modeTitleDark]}>
            Générée par IA ?
          </Text>
          <Text style={[s.modeSub, imageMode === 'ia' ? s.modeSubWhite : s.modeSubMuted]}>
            Détecte deepfakes et{'\n'}générations IA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.modeCard,
            imageMode === 'identite' ? s.modeCardOutlineActive : s.modeCardDefault,
          ]}
          onPress={() => onSelectMode('identite')}
          activeOpacity={0.85}
        >
          <View style={[s.modeIconWrap, imageMode === 'identite' ? s.modeIdentityActive : s.modeIconWrapLight]}>
            <Ionicons name="person-outline" size={20} color={P.navyDark} />
          </View>
          <Text style={s.modeTitle}>Identité</Text>
          <Text style={s.modeSubMuted}>Vérifie la personne{'\n'}représentée</Text>
        </TouchableOpacity>
      </View>

      <View style={s.confidentialRow}>
        <Ionicons name="shield-checkmark-outline" size={15} color={P.navy} />
        <Text style={s.confidentialText}>
          Images analysées localement — <Text style={s.confidentialStrong}>confidentielles</Text>
        </Text>
      </View>
    </View>
  );
}