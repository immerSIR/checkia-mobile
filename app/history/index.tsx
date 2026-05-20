import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FactCheck } from '../../data/homeData';
import { factCheckAPI } from '../../services/api';
import { mapSubmissionToFactCheck } from '../../utils/apiMappers';
import { formatRowTimestamp } from '../../utils/homeHelpers';

const palette = {
  bg: '#F7F3E9',
  paperLight: '#FCFAF2',
  ink: '#0F1E3D',
  ink2: '#2A3657',
  ink3: '#6B7493',
  ink4: '#A8ADBE',
  rule: '#E2DDCB',
  accent: '#1E3A8A',

  green: '#5F7F67',
  greenBg: '#D6E6D8',
};

export default function History() {
  const router = useRouter();
  const [items, setItems] = useState<FactCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const submissions = await factCheckAPI.getHistory();
        const merged = submissions.data
          .map(mapSubmissionToFactCheck)
          .filter((item) => item.verdict === 'VRAI')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setItems(merged);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const navigateToResult = (item: FactCheck) => {
    router.push(`/result/${item.id}?kind=text`);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.back()}
          activeOpacity={0.85}
          testID="back-button"
        >
          <Ionicons name="arrow-back" size={18} color={palette.ink} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>FAITS VÉRIFIÉS</Text>

        <View style={styles.iconBtnSpacer} />
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle} testID="history-count">
          {items.length} <Text style={styles.heroItalic}>faits vérifiés.</Text>
        </Text>
        <Text style={styles.heroSub}>
          Vos vérifications qui ont été confirmées comme fiables.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color={palette.accent} style={{ marginTop: 24 }} />
      ) : items.length === 0 ? (
        <Text style={styles.empty}>
          Aucun fait vérifié pour le moment. Lancez une vérification depuis l'onglet Vérifier.
        </Text>
      ) : (
        <View style={styles.group}>
          <Text style={styles.groupTitle}>MES FAITS VÉRIFIÉS</Text>
          {items.map((item, index) => {
            const icon = item.input_type === 'url' ? 'link-outline' : 'document-text-outline';
            const source = item.source || 'TEXTE';
            const time = formatRowTimestamp(item.created_at);

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.row, index !== items.length - 1 && styles.rowBorder]}
                activeOpacity={0.85}
                onPress={() => navigateToResult(item)}
              >
                <View style={styles.rowTop}>
                  <View style={styles.metaLeft}>
                    <View style={[styles.metaDot, { backgroundColor: palette.green }]} />
                    <Ionicons
                      name={icon as any}
                      size={12}
                      color={palette.ink4}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.source}>{source.toUpperCase()}</Text>
                  </View>

                  <Text style={styles.time}>{time}</Text>
                </View>

                <Text style={styles.itemTitle}>{item.raw_input}</Text>

                <View style={styles.bottomLine}>
                  <View style={[styles.verdictBadge, { backgroundColor: palette.greenBg }]}>
                    <Ionicons name="checkmark" size={12} color={palette.green} />
                    <Text style={[styles.verdictText, { color: palette.green }]}>
                      VÉRIFIÉ · VRAI
                    </Text>
                  </View>

                  {typeof item.score === 'number' && (
                    <Text style={styles.score}>{item.score}%</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 58,
    paddingBottom: 36,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: palette.rule,
    backgroundColor: '#FAF7F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnSpacer: {
    width: 34,
    height: 34,
  },
  topTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: palette.ink3,
  },

  hero: {
    marginBottom: 24,
  },
  heroTitle: {
    color: palette.ink,
    fontSize: 28,
    lineHeight: 33,
    letterSpacing: -0.5,
    fontWeight: '400',
    marginBottom: 6,
  },
  heroItalic: {
    fontStyle: 'italic',
    color: palette.accent,
  },
  heroSub: {
    fontSize: 14,
    color: palette.ink3,
    lineHeight: 20,
  },

  empty: {
    color: palette.ink3,
    fontSize: 14,
    marginTop: 12,
    lineHeight: 21,
  },

  group: {
    marginBottom: 14,
  },
  groupTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.ink4,
    marginBottom: 10,
  },

  row: {
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: palette.rule,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  source: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: palette.ink4,
  },
  time: {
    fontSize: 12,
    color: palette.ink3,
  },

  itemTitle: {
    color: palette.ink,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 12,
    fontWeight: '400',
  },

  bottomLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verdictBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  verdictText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  score: {
    fontSize: 13,
    color: palette.ink3,
  },
});
