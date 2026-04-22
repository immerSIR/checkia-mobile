import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const palette = {
  bg: '#F7F3E9',
  paperLight: '#FCFAF2',
  paperDark: '#EEE8D6',
  ink: '#0F1E3D',
  ink2: '#2A3657',
  ink3: '#6B7493',
  ink4: '#A8ADBE',
  rule: '#E2DDCB',
  accent: '#1E3A8A',

  green: '#5F7F67',
  greenBg: '#D6E6D8',

  red: '#B75252',
  redBg: '#E9CFCF',

  gold: '#A67C1B',
  goldBg: '#E8D6A7',

  navyChip: '#172B63',
};

const FILTERS = [
  { key: 'Tout', label: 'Tout : 24', bg: palette.navyChip, color: '#FFFFFF', active: true },
  { key: 'VRAI', label: 'Vraies : 18', bg: '#CFE0D2', color: palette.green },
  { key: 'FAUX', label: 'Fausses : 6', bg: '#E7CACA', color: palette.red },
  { key: 'DOUTEUX', label: 'À nuancer : 3', bg: '#E9D59D', color: '#8A6713' },
];

const GROUPS = [
  {
    title: "AUJOURD'HUI  ·  12 MAR",
    items: [
      {
        id: '1',
        source: 'BENBERE.COM',
        icon: 'link-outline',
        title: 'Référendum constitutionnel Mali juin 2026',
        verdict: 'VRAI',
        score: 87,
        time: '10:27',
        dot: '#1D7A46',
      },
      {
        id: '2',
        source: 'WHATSAPP',
        icon: 'image-outline',
        title: 'Photo supposée de manifestations à Bamako',
        verdict: 'FAUX',
        score: 94,
        time: '09:14',
        dot: '#C43B3B',
      },
    ],
  },
  {
    title: 'HIER  ·  11 MAR',
    items: [
      {
        id: '3',
        source: 'TEXTE',
        icon: 'document-text-outline',
        title: 'Citation attribuée au Premier ministre',
        verdict: 'DOUTEUX',
        score: 62,
        time: '16:02',
        dot: '#B8860B',
      },
      {
        id: '4',
        source: 'RTM',
        icon: 'mic-outline',
        title: 'Audio discours ministre santé',
        verdict: 'VRAI',
        score: 81,
        time: '11:48',
        dot: '#1D7A46',
      },
    ],
  },
];

function verdictStyle(verdict: string) {
  if (verdict === 'VRAI') {
    return {
      label: 'VÉRIFIÉ · VRAI',
      bg: palette.greenBg,
      color: palette.green,
      icon: 'checkmark',
    };
  }

  if (verdict === 'FAUX') {
    return {
      label: 'FAUX',
      bg: palette.redBg,
      color: palette.red,
      icon: 'close',
    };
  }

  return {
    label: 'À NUANCER',
    bg: palette.goldBg,
    color: palette.gold,
    icon: 'warning-outline',
  };
}

export default function History() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <Ionicons name="arrow-back" size={18} color={palette.ink} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>HISTORIQUE</Text>

        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
          <Ionicons name="funnel-outline" size={17} color={palette.ink2} />
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          24 <Text style={styles.heroItalic}>vérifications.</Text>
        </Text>
        <Text style={styles.heroSub}>Du 4 février au 12 mars 2026.</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[styles.filterChip, { backgroundColor: filter.bg }]}
            activeOpacity={0.85}
          >
            <Text style={[styles.filterChipText, { color: filter.color }]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.filtersArrowWrap}>
          <Ionicons name="caret-forward" size={13} color={palette.ink4} />
        </View>
      </ScrollView>

      {GROUPS.map((group) => (
        <View key={group.title} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>

          {group.items.map((item, index) => {
            const verdict = verdictStyle(item.verdict);

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.row,
                  index !== group.items.length - 1 && styles.rowBorder,
                ]}
                activeOpacity={0.85}
                onPress={() => router.push(`/result/${item.id}`)}
              >
                <View style={styles.rowTop}>
                  <View style={styles.metaLeft}>
                    <View style={[styles.metaDot, { backgroundColor: item.dot }]} />
                    <Ionicons
                      name={item.icon as any}
                      size={12}
                      color={palette.ink4}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.source}>{item.source}</Text>
                  </View>

                  <Text style={styles.time}>{item.time}</Text>
                </View>

                <Text style={styles.itemTitle}>{item.title}</Text>

                <View style={styles.bottomLine}>
                  <View style={[styles.verdictBadge, { backgroundColor: verdict.bg }]}>
                    <Ionicons name={verdict.icon as any} size={12} color={verdict.color} />
                    <Text style={[styles.verdictText, { color: verdict.color }]}>
                      {verdict.label}
                    </Text>
                  </View>

                  <Text style={styles.score}>{item.score}%</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
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
  topTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: palette.ink3,
  },

  hero: {
    marginBottom: 18,
  },
  heroTitle: {
    color: palette.ink,
    fontSize: 28,
    lineHeight: 33,
    letterSpacing: -0.5,
    // idéalement Instrument Serif
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
  },

  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
    marginBottom: 18,
  },
  filterChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filtersArrowWrap: {
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  group: {
    marginBottom: 14,
  },
  groupTitle: {
    fontSize: 10,
    fontWeight: '700',
    // letterSpacing: 1.2,
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
    // idéalement Instrument Serif
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