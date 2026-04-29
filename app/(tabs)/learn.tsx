// app/(tabs)/learn.tsx
import { ScrollView, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { s } from '../../styles/learn.styles';
import { P } from '../../constants/colors';
import { CATS, ARTICLES } from '../../data/learnData';

// Import des sous-composants
import { LearnHeader } from '../../components/learn/LearnHeader';
import { LearnChips } from '../../components/learn/LearnChips';
import { LearnFeatured } from '../../components/learn/LearnFeatured';
import { CategoryCard } from '../../components/learn/CategoryCard';
import { ArticleRow } from '../../components/learn/ArticleRow';

export default function Learn() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <LearnHeader />

        <Text style={s.pageTitle}>
          Apprendre à {'\n'}
          <Text style={s.pageTitleItalic}>décoder.</Text>
        </Text>

        <LearnChips activeIndex={0} />

        <LearnFeatured onPress={() => router.push('/learn/deepfake')} />

        <Text style={s.sectionLabel}>— CATÉGORIES</Text>
        <View style={s.catsRow}>
          {CATS.map((c) => (
            <CategoryCard key={c.lb} {...c} />
          ))}
        </View>

        <View style={s.fichesTitleRow}>
          <Text style={s.fichesTitleText}>Toutes les fiches</Text>
          <TouchableOpacity style={s.sortBtn} activeOpacity={0.7}>
            <Ionicons name="swap-vertical-outline" size={13} color={P.muted} />
            <Text style={s.sortText}> Récent</Text>
          </TouchableOpacity>
        </View>

        <View style={s.articlesList}>
          {ARTICLES.map((a, i) => (
            <ArticleRow
              key={a.slug}
              a={a}
              isLast={i === ARTICLES.length - 1}
              onPress={() => router.push(`/learn/${a.slug}`)}
            />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}