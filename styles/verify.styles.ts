import { StyleSheet } from 'react-native';
import { P } from "../constants/colors";

export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: P.bg },
  screen: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 40 },
  flex1: { flex: 1 },
  ctaInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  navbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
    borderBottomColor: P.line, backgroundColor: P.bg,
  },
  navCircleBtn: {
    width: 34, height: 34, borderRadius: 17, borderWidth: 1,
    borderColor: P.line, backgroundColor: P.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.6, color: P.text },

  pageTitle: {
    fontSize: 28, fontWeight: '400', color: P.text,
    fontFamily: 'InstrumentSerif-Regular', marginTop: 22,
    marginBottom: 20, letterSpacing: -0.3, lineHeight: 34,
  },
  pageTitleItalic: {
    fontStyle: 'italic',
    fontFamily: 'InstrumentSerif-Italic',
    color: P.navy,
  },

  tabs: {
    flexDirection: 'row', gap: 4, marginBottom: 22,
    backgroundColor: P.surfaceAlt, borderRadius: 10, padding: 4,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 4, paddingVertical: 8, borderRadius: 8,
  },
  tabActive: {
    backgroundColor: P.white, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06,
    shadowRadius: 3, elevation: 2,
  },
  tabText: { fontSize: 12, fontWeight: '500', color: P.muted },
  tabTextActive: { color: P.navy, fontWeight: '700' },

  sectionLabel: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.4,
    color: P.muted, marginBottom: 12, marginTop: 4,
  },

  textareaWrap: {
    backgroundColor: P.surface, borderWidth: 1, borderColor: P.line,
    borderRadius: 16, marginBottom: 20, overflow: 'hidden',
  },
  textarea: {
    fontSize: 15, lineHeight: 23, color: P.text, padding: 16,
    minHeight: 150, fontFamily: 'InstrumentSerif-Regular',
  },
  textareaFooter: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: P.line,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: P.surfaceAlt, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  chipText: { fontSize: 12, color: P.muted, fontWeight: '500' },
  counter: { flex: 1, textAlign: 'right', fontSize: 12, color: P.muted },

  optionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: P.surface, borderWidth: 1, borderColor: P.line,
    borderRadius: 14, padding: 16, marginBottom: 10,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  optionTextWrap: { marginLeft: 12 },
  optionTitle: { fontSize: 13, fontWeight: '600', color: P.text, marginBottom: 2 },
  optionSub: { fontSize: 12, color: P.muted },
  toggle: {
    width: 40, height: 24, borderRadius: 13, backgroundColor: P.navy,
    justifyContent: 'center', paddingHorizontal: 3, alignItems: 'flex-end',
  },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: P.white },

  urlInputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: P.surface,
    borderWidth: 1, borderColor: P.line, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 14, marginBottom: 12,
  },
  urlIcon: { marginRight: 10 },
  urlInput: { flex: 1, fontSize: 14, color: P.text },

  previewCard: {
    backgroundColor: P.surface, borderWidth: 1, borderColor: P.line,
    borderRadius: 14, overflow: 'hidden', marginBottom: 20,
  },
  previewCardInner: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12,
  },
  previewLoadingText: {
    marginLeft: 10, marginBottom: 0, fontSize: 10,
    fontWeight: '700', letterSpacing: 1.2, color: P.muted,
  },
  previewFavicon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: P.surfaceAlt,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  previewFaviconText: { fontSize: 16, fontWeight: '700', color: P.navy },
  previewSource: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.2,
    color: P.muted, marginBottom: 4,
  },
  previewTitle: {
    fontSize: 13, fontWeight: '500', color: P.text,
    lineHeight: 18, marginBottom: 2,
  },
  previewDesc: { fontSize: 12, color: P.muted, lineHeight: 16 },

  sourcesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  sourceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: P.surface, borderWidth: 1, borderColor: P.line,
    borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6,
  },
  sourceChipText: { fontSize: 12, color: P.text, fontWeight: '500' },

  warningBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: P.warningBg, borderWidth: 1, borderColor: '#E8C97A',
    borderRadius: 12, padding: 14, marginBottom: 16,
  },
  warningText: { flex: 1, fontSize: 12, lineHeight: 18, color: P.warning },
  warningDomain: { fontWeight: '700', textDecorationLine: 'underline' },

  uploadZone: {
    backgroundColor: P.surface, borderWidth: 1.5, borderColor: P.line,
    borderStyle: 'dashed', borderRadius: 18, minHeight: 140,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10, overflow: 'hidden',
  },
  uploadIconWrap: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: P.navy,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  uploadText: { fontSize: 14, fontWeight: '600', color: P.text, marginBottom: 4 },
  uploadSub: { fontSize: 11, color: P.muted },
  imagePreview: { width: '100%', height: 200 },
  changeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginBottom: 20,
  },
  changeBtnText: { fontSize: 13, color: P.muted },

  modesRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  modeCard: { flex: 1, borderRadius: 16, padding: 14, minHeight: 130 },
  modeCardDefault: { backgroundColor: P.surface, borderColor: P.line, borderWidth: 1.5 },
  modeCardPrimaryActive: { backgroundColor: P.navyDark, borderColor: P.navyDark, borderWidth: 0 },
  modeCardOutlineActive: { backgroundColor: P.surface, borderColor: P.navy, borderWidth: 2 },
  modeIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  modeIconWrapDark: { backgroundColor: 'rgba(255,255,255,0.12)' },
  modeIconWrapLight: { backgroundColor: P.surfaceAlt },
  modeIdentityActive: { backgroundColor: '#EEF1F8' },
  modeTitle: { fontSize: 12, fontWeight: '700', marginBottom: 6, lineHeight: 18, color: P.text },
  modeTitleWhite: { color: P.white },
  modeTitleDark: { color: P.text },
  modeSub: { fontSize: 11, lineHeight: 16 },
  modeSubWhite: { color: 'rgba(255,255,255,0.65)' },
  modeSubMuted: { color: P.muted },

  confidentialRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#EEF1F8', borderRadius: 12, padding: 12, marginBottom: 20,
  },
  confidentialText: { flex: 1, fontSize: 12, color: P.navy, lineHeight: 17 },
  confidentialStrong: { fontWeight: '700', color: P.navy, textDecorationLine: 'underline' },

  audioZone: {
    backgroundColor: P.surface, borderWidth: 1, borderColor: P.line,
    borderRadius: 18, padding: 24, alignItems: 'center', marginBottom: 16,
  },
  recordBtn: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#C94040',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: '#C94040', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  recordBtnActive: { backgroundColor: '#7A1A1A' },
  waveform: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 40, marginBottom: 12 },
  waveBar: { width: 3, borderRadius: 2, backgroundColor: P.navy },
  audioTimer: { fontSize: 13, color: P.muted, fontWeight: '500' },

  orRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 14 },
  orLine: { flex: 1, height: 1, backgroundColor: P.line },
  orText: { fontSize: 12, color: P.muted },

  importRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: P.surface, borderWidth: 1, borderColor: P.line,
    borderRadius: 14, padding: 16, marginBottom: 20,
  },
  importRowActive: { borderColor: P.navy, backgroundColor: '#EEF1F8' },
  importText: { fontSize: 13, fontWeight: '600', color: P.text },
  importFormats: { fontSize: 11, color: P.muted, marginTop: 2 },

  audioOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: P.surface, borderWidth: 1.5, borderColor: P.line,
    borderRadius: 14, padding: 16, marginBottom: 10,
  },
  audioOptionActive: { borderColor: P.navy, backgroundColor: '#EEF1F8' },
  audioOptionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  audioOptionTitle: { fontSize: 13, fontWeight: '600', color: P.text, marginBottom: 2 },
  audioOptionSub: { fontSize: 12, color: P.muted },

  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
    borderColor: P.line, alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: P.navy },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: P.navy },

  cta: {
    backgroundColor: P.navy, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center', marginTop: 10,
  },
  ctaDisabled: { opacity: 0.35 },
  ctaText: { color: P.white, fontSize: 14, fontWeight: '700', letterSpacing: 0.2 },
});

export const as = StyleSheet.create({
  safe: { flex: 1, backgroundColor: P.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
    borderBottomColor: P.line, backgroundColor: P.bg,
  },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17, borderWidth: 1,
    borderColor: P.line, backgroundColor: P.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 13, color: P.text, fontWeight: '500' },
  headerTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.6, color: P.text },
  content: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 24 },
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: P.navy, marginBottom: 10 },
  titleBlock: {
    fontSize: 34, fontWeight: '400', color: P.text,
    fontFamily: 'InstrumentSerif-Regular', lineHeight: 42,
    marginBottom: 14, letterSpacing: -0.5,
  },
  titleItalic: { fontStyle: 'italic', fontFamily: 'InstrumentSerif-Italic', color: P.navy },
  desc: { fontSize: 13, color: P.muted, lineHeight: 20, marginBottom: 32 },
  stepsList: {
    backgroundColor: P.white, borderWidth: 1, borderColor: P.line,
    borderRadius: 18, overflow: 'hidden',
  },
  stepItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, gap: 14 },
  stepSeparator: { height: 1, backgroundColor: P.line, marginLeft: 64 },
  stepIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepIconDone: { backgroundColor: P.navy },
  stepIconActive: { backgroundColor: P.navy },
  stepIconPending: { backgroundColor: P.surfaceAlt, borderWidth: 1.5, borderColor: P.line },
  stepNum: { fontSize: 13, fontWeight: '600', color: P.muted },
  stepLabel: { fontSize: 14, fontWeight: '600', color: P.text, lineHeight: 20 },
  stepLabelPending: { color: P.muted, fontWeight: '400' },
  stepSub: { fontSize: 12, color: P.muted, marginTop: 2 },
  badgeEnCours: { fontSize: 11, fontWeight: '700', color: P.navy, letterSpacing: 0.4 },
  timeBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: P.navyDark, paddingHorizontal: 22, paddingVertical: 16,
  },
  timeLeftWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timeLabel: { fontSize: 13, color: P.surface, fontWeight: '500' },
  timeValue: { fontSize: 14, fontWeight: '700', color: P.white, letterSpacing: 0.5 },
});