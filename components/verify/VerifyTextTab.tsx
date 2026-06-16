import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { s } from '../../styles/verify.styles';
import { P } from '../../constants/colors';
import type { ClaimLanguage } from '../../hooks/useVerify';
import BambaraDictation from './BambaraDictation';

type Props = {
  texte: string;
  setTexte: (value: string) => void;
  source: string;
  setSource: (value: string) => void;
  language?: ClaimLanguage;
  onChangeLanguage?: (next: ClaimLanguage) => void;
  translatedFromBambara?: boolean;
  onBambaraTranslated?: (frenchText: string) => void;
  onBambaraError?: (message: string) => void;
};

const LANG_OPTIONS: Array<{ key: ClaimLanguage; label: string; hint: string }> = [
  { key: 'fr', label: 'Français', hint: 'Tapez votre affirmation' },
  { key: 'bm', label: 'Bambara', hint: 'Dictez en bambara, vérifiez en français' },
];

export default function VerifyTextTab({
  texte,
  setTexte,
  source,
  setSource,
  language = 'fr',
  onChangeLanguage,
  translatedFromBambara = false,
  onBambaraTranslated,
  onBambaraError,
}: Props) {
  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) setTexte(text.slice(0, 1000));
  };

  const isBambara = language === 'bm';

  return (
    <View>
      {onChangeLanguage && (
        <View testID="language-segmented">
          <Text style={s.sectionLabel}>— LANGUE</Text>
          <View style={lang.segmented}>
            {LANG_OPTIONS.map((opt) => {
              const active = language === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[lang.option, active && lang.optionActive]}
                  onPress={() => onChangeLanguage(opt.key)}
                  activeOpacity={0.85}
                  testID={`lang-${opt.key}`}
                >
                  <Text style={[lang.optionText, active && lang.optionTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={lang.hint}>
            {LANG_OPTIONS.find((o) => o.key === language)?.hint}
          </Text>
        </View>
      )}

      {isBambara && (
        <>
          <Text style={s.sectionLabel}>— DICTÉE EN BAMBARA</Text>
          <BambaraDictation
            onTranscribed={(french) => onBambaraTranslated?.(french)}
            onError={(message) => onBambaraError?.(message)}
          />
        </>
      )}

      {(!isBambara || texte.length > 0) && (
        <>
          <View style={lang.claimHeaderRow}>
            <Text style={s.sectionLabel}>
              {isBambara ? '— AFFIRMATION EN FRANÇAIS' : '— COLLEZ OU TAPEZ'}
            </Text>
            {isBambara && translatedFromBambara && (
              <View style={lang.translatedBadge} testID="translated-badge">
                <Ionicons name="language" size={11} color={P.navy} />
                <Text style={lang.translatedBadgeText}>Traduit du bambara</Text>
              </View>
            )}
          </View>

          <View style={s.textareaWrap}>
            <TextInput
              style={s.textarea}
              placeholder={
                isBambara
                  ? "Le texte transcrit en français apparaîtra ici. Corrigez si besoin avant de vérifier."
                  : `« Le gouvernement du Mali a annoncé la distribution\ngratuite de semences à 2 millions d'agriculteurs\navant la saison des pluies 2026. »`
              }
              placeholderTextColor={P.muted}
              multiline
              value={texte}
              onChangeText={setTexte}
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={1000}
            />

            <View style={s.textareaFooter}>
              {!isBambara && (
                <TouchableOpacity style={s.chip} onPress={handlePaste} activeOpacity={0.7}>
                  <Ionicons name="clipboard-outline" size={13} color={P.muted} />
                  <Text style={s.chipText}>Coller</Text>
                </TouchableOpacity>
              )}

              <Text style={s.counter}>{texte.length} / 1000</Text>
            </View>
          </View>
        </>
      )}

      <Text style={s.sectionLabel}>— SOURCE (OPTIONNEL)</Text>

      <View style={s.urlInputWrap}>
        <Ionicons name="link-outline" size={16} color={P.muted} style={s.urlIcon} />
        <TextInput
          style={s.urlInput}
          placeholder="https://… URL où vous avez vu l'information"
          placeholderTextColor={P.muted}
          value={source}
          onChangeText={setSource}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        {source.length > 0 && (
          <TouchableOpacity onPress={() => setSource('')}>
            <Ionicons name="close-circle" size={18} color={P.muted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const lang = StyleSheet.create({
  segmented: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: P.surfaceAlt,
    borderRadius: 10,
    padding: 4,
    marginBottom: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: P.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
    color: P.muted,
  },
  optionTextActive: {
    color: P.navy,
    fontWeight: '700',
  },
  hint: {
    fontSize: 11,
    color: P.muted,
    marginBottom: 18,
    paddingHorizontal: 2,
  },
  claimHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  translatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF1F8',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  translatedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: P.navy,
    letterSpacing: 0.5,
  },
});
