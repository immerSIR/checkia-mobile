import { StyleSheet, Platform } from 'react-native';
import { P } from '../constants/colors';

export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: P.bg },
  screen: { flex: 1 },
  container: { 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? 45 : 10, 
    paddingBottom: 36 
  },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  topLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.6, color: P.navy },
  settingsButton: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: P.line, backgroundColor: P.surface, alignItems: 'center', justifyContent: 'center' },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  avatar: { width: 62, height: 62, borderRadius: 31, backgroundColor: P.navyDark, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarText: { color: P.white, fontSize: 24, fontFamily: 'InstrumentSerif-Regular' },
  name: { color: P.text, fontSize: 20, fontFamily: 'InstrumentSerif-Regular', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 4 },
  location: { color: P.muted, fontSize: 13 },
  verifiedBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: P.successBg, borderWidth: 1, borderColor: P.successBorder, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  verifiedText: { color: P.successText, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  streakCard: { backgroundColor: P.streakBg, borderWidth: 1, borderColor: P.line, borderRadius: 16, padding: 14, marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: P.streakIcon, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  streakEyebrow: { fontSize: 10, fontWeight: '700', color: P.muted, marginBottom: 3 },
  streakTitle: { color: P.text, fontSize: 16, fontFamily: 'InstrumentSerif-Regular' },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: P.navy, marginBottom: 12 },
  menuRow: { paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: P.line },
  menuText: { color: P.text, fontSize: 16, fontWeight: '500' },
  menuValue: { color: P.muted, fontSize: 14, marginRight: 8 },
  logoutRow: { paddingVertical: 16, borderTopWidth: 1, borderTopColor: P.line, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoutText: { color: P.danger, fontSize: 16, fontWeight: '600' },
});