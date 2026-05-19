// app/(tabs)/learn.tsx
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { s } from '../../styles/learn.styles';
import { P } from '../../constants/colors';
import { CATS } from '../../data/learnData';

import { LearnHeader } from '../../components/learn/LearnHeader';
import { LearnChips } from '../../components/learn/LearnChips';
import { LearnFeatured } from '../../components/learn/LearnFeatured';
import { CategoryCard } from '../../components/learn/CategoryCard';
import { authAPI, contentAPI } from '../../services/api';

type Fact = {
  id: number;
  texte: string;
  source?: string | null;
  date?: string;
};

const FACTS_PER_PAGE = 3;

const dedupeByTexte = (items: Fact[]) => {
  const seen = new Set<string>();
  return items.filter((fact) => {
    if (seen.has(fact.texte)) return false;
    seen.add(fact.texte);
    return true;
  });
};

const sourceDomain = (source?: string | null) => {
  if (!source) return null;
  try {
    return new URL(source).hostname.replace(/^www\./, '');
  } catch {
    return source;
  }
};

export default function Learn() {
  const router = useRouter();
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const session = await authAPI.getSession();
    if (!session) {
      setAuthed(false);
      setFacts([]);
      setLoading(false);
      return;
    }
    setAuthed(true);

    try {
      const { data } = await contentAPI.getFacts();
      setFacts(dedupeByTexte(Array.isArray(data) ? (data as Fact[]) : []));
    } catch (err: any) {
      setError(err?.message || 'Impossible de charger les faits vérifiés.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(facts.length / FACTS_PER_PAGE));
  const start = (page - 1) * FACTS_PER_PAGE;
  const pageItems = facts.slice(start, start + FACTS_PER_PAGE);

  const openSource = (url?: string | null) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  };

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
          <Text style={s.fichesTitleText}>Faits vérifiés</Text>
          {authed && facts.length > 0 && (
            <Text style={s.sortText}>
              Page {page} / {totalPages}
            </Text>
          )}
        </View>

        <View style={s.articlesList}>
          {loading && (
            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
              <ActivityIndicator color={P.navy} />
            </View>
          )}

          {!loading && authed === false && (
            <Text style={{ color: P.muted, fontSize: 14, paddingVertical: 18 }}>
              Connectez-vous pour voir la liste des faits vérifiés.
            </Text>
          )}

          {!loading && error && authed && (
            <Text style={{ color: P.danger ?? P.muted, fontSize: 14, paddingVertical: 18 }}>
              {error}
            </Text>
          )}

          {!loading && authed && !error && facts.length === 0 && (
            <Text style={{ color: P.muted, fontSize: 14, paddingVertical: 18 }}>
              Aucun fait vérifié pour le moment.
            </Text>
          )}

          {!loading && authed && pageItems.map((fact, i) => {
            const domain = sourceDomain(fact.source);
            const num = String(start + i + 1).padStart(2, '0');
            return (
              <TouchableOpacity
                key={fact.id}
                style={[s.articleRow, i !== pageItems.length - 1 && s.articleRowSep]}
                onPress={() => openSource(fact.source)}
                activeOpacity={fact.source ? 0.75 : 1}
              >
                <Text style={s.articleNum}>{num}</Text>
                <View style={s.articleBody}>
                  {domain && <Text style={s.articleMeta}>{domain}</Text>}
                  <Text style={s.articleTitle} numberOfLines={3}>
                    {fact.texte}
                  </Text>
                </View>
                {fact.source ? (
                  <Ionicons name="open-outline" size={16} color={P.muted} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {authed && totalPages > 1 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 12,
              marginTop: 16,
              paddingHorizontal: 22,
            }}
          >
            <TouchableOpacity
              disabled={page === 1}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              style={[s.chip, page === 1 && { opacity: 0.4 }]}
            >
              <Text style={s.chipText}>Précédent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={page === totalPages}
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={[s.chip, page === totalPages && { opacity: 0.4 }]}
            >
              <Text style={s.chipText}>Suivant</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
