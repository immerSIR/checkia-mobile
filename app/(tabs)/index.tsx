// app/(tabs)/index.tsx
import { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { P } from '../../constants/colors';
import { s } from '../../styles/home.styles';
import { MOCK_HISTORY, MOCK_STATS, FactCheck } from '../../data/homeData';
import { factCheckAPI, imageVerificationAPI } from '../../services/api';
import { mapImageToFactCheck, mapSubmissionToFactCheck } from '../../utils/apiMappers';

// Import de nos nouveaux composants
import { HomeHeader } from '../../components/home/HomeHeader';
import { HomeHero } from '../../components/home/HomeHero';
import { HomeStats } from '../../components/home/HomeStats';
import { HistoryRow } from '../../components/home/HistoryRow';

export default function HomeScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<FactCheck[]>(MOCK_HISTORY);
  const [stats, setStats] = useState(MOCK_STATS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [submissions, imageVerifications] = await Promise.all([
        factCheckAPI.getHistory(),
        imageVerificationAPI.getHistory().catch(() => ({ data: [] })),
      ]);
      const items = [
        ...submissions.data.map(mapSubmissionToFactCheck),
        ...imageVerifications.data.map(mapImageToFactCheck),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      if (items.length > 0) {
        setHistory(items.slice(0, 5));
        setStats({
          suivi: items.length,
          vrai: items.filter((item) => item.verdict === 'VRAI').length,
          faux: items.filter((item) => item.verdict === 'FAUX').length,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={s.screen}
        contentContainerStyle={[s.container, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader name="Ibrahima" />
        <HomeHero />
        <HomeStats stats={stats} />

        <View style={s.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={s.sectionTitle}>Récentes</Text>
            <Text style={s.sectionCount}>{history.length}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <Text style={s.sectionLink}>Tout voir</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={P.navy} style={{ marginTop: 20 }} />
        ) : (
          history.map((item, i) => (
            <HistoryRow
              key={item.id}
              item={item}
              isLast={i === history.length - 1}
              onPress={() => {
                if (String(item.id).startsWith('image-')) {
                  router.push(`/result/${String(item.id).replace('image-', '')}?kind=image`);
                } else {
                  router.push(`/result/${item.id}?kind=text`);
                }
              }}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
