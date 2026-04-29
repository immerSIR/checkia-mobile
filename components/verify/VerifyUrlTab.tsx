import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SOURCES } from '../../constants/verify';
import { s } from '../../styles/verify.styles';
import { P } from '../../constants/colors'

type Props = {
  url: string;
  preview: any;
  previewLoading: boolean;
  onChangeUrl: (value: string) => void;
  onClearUrl: () => void;
};

export default function VerifyUrlTab({
  url, preview, previewLoading, onChangeUrl, onClearUrl,
}: Props) {
  const domain = url.split('/')[2] ?? url;
  const isTrusted = SOURCES.some((src) =>
    url.toLowerCase().includes(src.toLowerCase().replace(' ', ''))
  );

  return (
    <View>
      <Text style={s.sectionLabel}>— LIEN À VÉRIFIER</Text>

      <View style={s.urlInputWrap}>
        <Ionicons name="link-outline" size={16} color={P.muted} style={s.urlIcon} />
        <TextInput
          style={s.urlInput}
          placeholder="https://sahel-actu.com/2026/03/…"
          placeholderTextColor={P.muted}
          value={url}
          onChangeText={onChangeUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        {url.length > 0 && (
          <TouchableOpacity onPress={onClearUrl}>
            <Ionicons name="close-circle" size={18} color={P.muted} />
          </TouchableOpacity>
        )}
      </View>

      {(previewLoading || url.startsWith('http')) && (
        <View style={s.previewCard}>
          {previewLoading ? (
            <View style={s.previewCardInner}>
              <ActivityIndicator color={P.navy} size="small" />
              <Text style={s.previewLoadingText}>Chargement…</Text>
            </View>
          ) : preview ? (
            <View style={s.previewCardInner}>
              <View style={s.previewFavicon}>
                <Text style={s.previewFaviconText}>
                  {(preview.source?.[0] ?? 'S').toUpperCase()}
                </Text>
              </View>

              <View style={s.flex1}>
                <Text style={s.previewSource}>{(preview.source ?? '').toUpperCase()}</Text>
                <Text style={s.previewTitle} numberOfLines={2}>
                  {preview.title || 'Titre non disponible'}
                </Text>
                {!!preview.desc && (
                  <Text style={s.previewDesc} numberOfLines={2}>
                    {preview.desc}
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <View style={s.previewCardInner}>
              <View style={s.previewFavicon}>
                <Text style={s.previewFaviconText}>
                  {(domain?.[0] ?? 'S').toUpperCase()}
                </Text>
              </View>

              <View style={s.flex1}>
                <Text style={s.previewSource}>{domain.toUpperCase()}</Text>
                <Text style={s.previewTitle}>Aperçu en cours de chargement…</Text>
              </View>
            </View>
          )}
        </View>
      )}

      <Text style={s.sectionLabel}>— SOURCES CROISÉES</Text>

      <View style={s.sourcesWrap}>
        {SOURCES.map((src) => (
          <View key={src} style={s.sourceChip}>
            <Ionicons name="checkmark" size={11} color={P.navy} />
            <Text style={s.sourceChipText}>{src}</Text>
          </View>
        ))}
      </View>

      {url.length > 0 && !isTrusted && (
        <View style={s.warningBanner}>
          <Ionicons name="warning-outline" size={16} color={P.warning} />
          <Text style={s.warningText}>
            Le domaine <Text style={s.warningDomain}>{domain}</Text> n'est pas dans notre liste de
            sources fiables. Analyse renforcée activée.
          </Text>
        </View>
      )}
    </View>
  );
}