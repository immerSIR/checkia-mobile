import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { s } from '../../styles/verify.styles';
import { P } from '../../constants/colors';

type Props = {
  texte: string;
  setTexte: (value: string) => void;
  source: string;
  setSource: (value: string) => void;
};

export default function VerifyTextTab({ texte, setTexte, source, setSource }: Props) {
  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) setTexte(text.slice(0, 1000));
  };

  return (
    <View>
      <Text style={s.sectionLabel}>— COLLEZ OU TAPEZ</Text>

      <View style={s.textareaWrap}>
        <TextInput
          style={s.textarea}
          placeholder={`« Le gouvernement du Mali a annoncé la distribution\ngratuite de semences à 2 millions d'agriculteurs\navant la saison des pluies 2026. »`}
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
          <TouchableOpacity style={s.chip} onPress={handlePaste} activeOpacity={0.7}>
            <Ionicons name="clipboard-outline" size={13} color={P.muted} />
            <Text style={s.chipText}>Coller</Text>
          </TouchableOpacity>

          <Text style={s.counter}>{texte.length} / 1000</Text>
        </View>
      </View>

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
