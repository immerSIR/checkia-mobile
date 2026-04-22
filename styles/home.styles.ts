// styles/home.styles.ts
import { StyleSheet, Platform } from 'react-native';
import { P } from '../constants/colors';

export const s = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: P.bg 
  },
  screen: { 
    flex: 1 
  },
  container: { 
    paddingHorizontal: 22, 
    paddingTop: Platform.OS === 'android' ? 45 : 10, 
    paddingBottom: 40 
  },
  topBar: { 
    marginBottom: 15 
  },
  dateLabel: { 
    fontSize: 10, 
    fontWeight: '700', 
    letterSpacing: 1.6, 
    color: P.text 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25 
  },
  hello: { 
    fontSize: 28, 
    color: P.text, 
    fontFamily: 'InstrumentSerif-Regular' 
  },
  sub: { 
    fontSize: 14, 
    color: P.muted, 
    marginTop: 5 
  },
  avatar: { 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    backgroundColor: P.navyDark, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  avatarText: { 
    color: P.white, 
    fontSize: 14, 
    fontWeight: '700' 
  },
  heroCard: { 
    backgroundColor: P.navyDark, 
    borderRadius: 22, 
    padding: 22, 
    marginBottom: 25 
  },
  heroEyebrow: { 
    fontSize: 10, 
    fontWeight: '800', 
    color: 'rgba(255,255,255,0.5)', 
    marginBottom: 12 
  },
  heroTitle: { 
    fontSize: 22, 
    color: P.white, 
    fontFamily: 'InstrumentSerif-Regular', 
    marginBottom: 15 
  },
  heroItalic: { 
    fontStyle: 'italic', 
    fontFamily: 'InstrumentSerif-Italic' 
  },
  heroSub: { 
    fontSize: 12, 
    color: 'rgba(255,255,255,0.6)', 
    marginBottom: 20 
  },
  heroBtn: { 
    backgroundColor: P.bg, 
    borderRadius: 14, 
    padding: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  heroBtnText: { 
    color: P.text, 
    fontWeight: '700' 
  },
  statsRow: { 
    flexDirection: 'row', 
    gap: 8, 
    marginBottom: 30 
  },
  statCard: { 
    flex: 1, 
    borderRadius: 14, 
    padding: 13, 
    minHeight: 70 
  },
  statValue: { 
    fontSize: 22, 
    fontFamily: 'InstrumentSerif-Regular' 
  },
  statLabel: { 
    fontSize: 11, 
    color: P.muted 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline', 
    marginBottom: 15 
  },
  sectionTitle: { 
    fontSize: 22, 
    fontFamily: 'InstrumentSerif-Regular', 
    color: P.text 
  },
  sectionLink: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: P.navy 
  },
  listItem: { 
    flexDirection: 'row', 
    paddingVertical: 15 
  },
  listBorder: { 
    borderBottomWidth: 1, 
    borderBottomColor: P.line 
  },
  listIconWrap: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    backgroundColor: '#E9E1CF', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  listBody: { 
    flex: 1 
  },
  pill: { 
    alignSelf: 'flex-start', 
    borderRadius: 999, 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    marginBottom: 8 
  },
  pillText: { 
    fontSize: 10, 
    fontWeight: '800' 
  },
  listTitle: { 
    fontSize: 15, 
    color: P.text, 
    fontFamily: 'InstrumentSerif-Regular', 
    marginBottom: 5 
  },
  metaText: { 
    fontSize: 12, 
    color: P.muted 
  },
  score: { 
    fontSize: 14, 
    fontWeight: '700', 
    marginLeft: 10 
  },
});