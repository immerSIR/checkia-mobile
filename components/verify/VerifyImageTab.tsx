import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ImageMode } from '../../constants/verify';
import { s } from '../../styles/verify.styles';
import { P } from '../../constants/colors';

type Props = {
  imageUri: string | null;
  imageMode: ImageMode;
  imageClaim: string;
  onPickImage: () => void;
  onClearImage: () => void;
  onSelectMode: (mode: ImageMode) => void;
  onChangeClaim: (value: string) => void;
};

export default function VerifyImageTab({
  imageUri, imageMode, imageClaim,
  onPickImage, onClearImage, onSelectMode, onChangeClaim,
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
            imageMode === 'content' ? s.modeCardOutlineActive : s.modeCardDefault,
          ]}
          onPress={() => onSelectMode('content')}
          activeOpacity={0.85}
        >
          <View style={[s.modeIconWrap, imageMode === 'content' ? s.modeIdentityActive : s.modeIconWrapLight]}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={P.navyDark} />
          </View>
          <Text style={s.modeTitle}>Vérifier le contenu</Text>
          <Text style={s.modeSubMuted}>Vérifie une affirmation{'\n'}à propos de l'image</Text>
        </TouchableOpacity>
      </View>

      {imageMode === 'content' && (
        <View>
          <Text style={s.sectionLabel}>— AFFIRMATION À VÉRIFIER</Text>
          <View style={s.textareaWrap}>
            <TextInput
              style={s.textarea}
              placeholder={`Ex: Cette image montre le président français\nlors de sa visite officielle…`}
              placeholderTextColor={P.muted}
              multiline
              value={imageClaim}
              onChangeText={onChangeClaim}
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={1000}
            />
            <View style={s.textareaFooter}>
              <Text style={s.counter}>{imageClaim.length} / 1000</Text>
            </View>
          </View>
          <Text style={{ fontSize: 11, color: P.muted, marginTop: -4, marginBottom: 14 }}>
            Laissez vide pour une analyse générale de l'image.
          </Text>
        </View>
      )}

      <View style={s.confidentialRow}>
        <Ionicons name="shield-checkmark-outline" size={15} color={P.navy} />
        <Text style={s.confidentialText}>
          Images analysées localement — <Text style={s.confidentialStrong}>confidentielles</Text>
        </Text>
      </View>
    </View>
  );
}
