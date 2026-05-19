// app/(tabs)/verify.tsx
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AnalyzingScreen from '../../components/verify/AnalyzingScreen';
import VerifyAudioTab from '../../components/verify/VerifyAudioTab';
import VerifyImageTab from '../../components/verify/VerifyImageTab';
import VerifyNavbar from '../../components/verify/VerifyNavbar';
import VerifyTabs from '../../components/verify/VerifyTabs';
import VerifyTextTab from '../../components/verify/VerifyTextTab';
import VerifyUrlTab from '../../components/verify/VerifyUrlTab';
import { useVerify } from '../../hooks/useVerify';
import { s } from '../../styles/verify.styles';
import { P } from '../../constants/colors';

export default function Verify() {
  const router = useRouter();
  const vm = useVerify(router);

  return (
    <View style={{ flex: 1, backgroundColor: P.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={P.bg} />

      {vm.loading ? (
        <AnalyzingScreen
          step={vm.step}
          onClose={() => {
            vm.setLoading(false);
            vm.setStep(0);
          }}
        />
      ) : (
        <SafeAreaView style={s.safe} edges={['top']}>
          <ScrollView
            style={s.screen}
            contentContainerStyle={[s.content, { paddingBottom: 120 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <VerifyNavbar onBack={() => router.back()} />
            <Text style={s.pageTitle}>
              Que <Text style={s.pageTitleItalic}>vérifions</Text>-nous ?
            </Text>

            <VerifyTabs tab={vm.tab} onChange={vm.setTab} />

            {vm.tab === 'Texte' && (
              <VerifyTextTab texte={vm.texte} setTexte={vm.setTexte} />
            )}

            {vm.tab === 'URL' && (
              <VerifyUrlTab
                url={vm.url}
                preview={vm.preview}
                previewLoading={vm.previewLoading}
                onChangeUrl={vm.handleUrlChange}
                onClearUrl={vm.clearUrl}
              />
            )}

            {vm.tab === 'Image' && (
              <VerifyImageTab
                imageUri={vm.imageUri}
                imageMode={vm.imageMode}
                onPickImage={vm.pickImage}
                onClearImage={vm.clearImage}
                onSelectMode={vm.setImageMode}
              />
            )}

            {vm.tab === 'Audio' && (
              <VerifyAudioTab
                audioUri={vm.audioUri}
                audioName={vm.audioName}
                audioMode={vm.audioMode}
                isRecording={vm.isRecording}
                onPickAudio={vm.pickAudio}
                onClearAudio={vm.clearAudio}
                onToggleRecording={vm.toggleRecording}
                onSelectMode={vm.setAudioMode}
              />
            )}

            {!!vm.error && (
              <View style={s.errorBanner}>
                <Ionicons name="alert-circle-outline" size={16} color={P.danger} />
                <Text style={s.errorText}>{vm.error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[s.cta, !vm.canAnalyze() && s.ctaDisabled]}
              onPress={vm.handleAnalyze}
              disabled={!vm.canAnalyze()}
              activeOpacity={0.88}
            >
              <View style={s.ctaInner}>
                <Text style={s.ctaText}>{vm.ctaLabel()}</Text>
                <Ionicons name="arrow-forward" size={18} color={P.white} />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
}
