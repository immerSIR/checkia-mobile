import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ANALYSIS_STEPS, STEP_TITLES } from '../../constants/verify';
import { P, as } from '../../styles/verify.styles';

type Props = {
  step: number;
  onClose: () => void;
};

export default function AnalyzingScreen({ step, onClose }: Props) {
  const currentStep = Math.min(step, STEP_TITLES.length - 1);
  const info = STEP_TITLES[currentStep];
  const timeLeft = Math.max(2, 8 - step * 1.5);

  return (
    <SafeAreaView style={as.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
      <View style={as.header}>
        <TouchableOpacity style={as.closeBtn} onPress={onClose}>
          <Text style={as.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <Text style={as.headerTitle}>ANALYSE EN COURS</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={as.content} showsVerticalScrollIndicator={false}>
        <Text style={as.kicker}>— {info.etape}</Text>
        <Text style={as.titleBlock}>
          {info.titre} <Text style={as.titleItalic}>{info.titreItalic}</Text>
        </Text>
        <Text style={as.desc}>{info.desc}</Text>

        <View style={as.stepsList}>
          {ANALYSIS_STEPS.map((st, i) => {
            const isDone = i < step;
            const isActive = i === step;
            const isPending = i > step;

            return (
              <View key={i}>
                <View style={as.stepItem}>
                  <View style={[as.stepIcon, isDone && as.stepIconDone, isActive && as.stepIconActive, isPending && as.stepIconPending]}>
                    {isDone ? (
                      <Ionicons name="checkmark" size={14} color={P.white} />
                    ) : isActive ? (
                      <ActivityIndicator size="small" color={P.white} />
                    ) : (
                      <Text style={as.stepNum}>{i + 1}</Text>
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[as.stepLabel, isPending && as.stepLabelPending]}>{st.label}</Text>
                    {st.sub && (isDone || isActive) && <Text style={as.stepSub}>{st.sub}</Text>}
                  </View>

                  {isActive && st.badge && <Text style={as.badgeEnCours}>{st.badge}</Text>}
                </View>

                {i < ANALYSIS_STEPS.length - 1 && <View style={as.stepSeparator} />}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={as.timeBar}>
        <View style={as.timeLeftWrap}>
          <Ionicons name="time-outline" size={16} color={P.surface} />
          <Text style={as.timeLabel}>Temps estimé restant</Text>
        </View>
        <Text style={as.timeValue}>~ {Math.round(timeLeft)}s</Text>
      </View>
    </SafeAreaView>
  );
}