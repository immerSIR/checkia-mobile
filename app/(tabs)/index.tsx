import { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, SafeAreaView, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { P } from '../../constants/colors';
import { s } from '../../styles/home.styles';
import { MOCK_HISTORY, MOCK_STATS, FactCheck } from '../../data/homeData';
import { factCheckAPI } from '../../services/api';

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

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await factCheckAPI.getHistory();
      if (data?.length > 0) setHistory(data.slice(0, 5));
    } catch (e) { console.log(e); } 
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={s.screen} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        
        <HomeHeader name="Ibrahima" />
        
        <HomeHero />

        <HomeStats stats={stats} />

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Récentes</Text>
          <TouchableOpacity onPress={() => router.push('/history')}><Text style={s.sectionLink}>Tout voir</Text></TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={P.navy} style={{ marginTop: 20 }} />
        ) : (
          history.map((item, i) => (
            <HistoryRow 
              key={item.id} 
              item={item} 
              isLast={i === history.length - 1} 
              onPress={() => router.push(`/verify?id=${item.id}`)} 
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}