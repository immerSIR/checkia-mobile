import {
  TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, View,
} from 'react-native';
import { Colors } from '../../constants/colors';

type Props = {
  label:     string;
  onPress:   () => void;
  variant?:  'primary' | 'secondary' | 'ghost' | 'danger';
  loading?:  boolean;
  fullWidth?: boolean;
  icon?:     React.ReactNode;
};

export function Button({
  label, onPress, variant = 'primary',
  loading, fullWidth, icon,
}: Props) {

  const bg =
    variant === 'primary'   ? Colors.accent :
    variant === 'danger'    ? Colors.false  :
    variant === 'secondary' ? Colors.inputBg :
    'transparent';

  const tc =
    variant === 'primary' ? Colors.white :
    variant === 'danger'  ? Colors.white :
    Colors.accent;

  const border =
    variant === 'secondary' ? Colors.rule :
    variant === 'ghost'     ? Colors.accent :
    undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[
        styles.btn,
        {
          backgroundColor: bg,
          width: fullWidth ? '100%' : 'auto',
          borderWidth:  border ? 1.5 : 0,
          borderColor:  border,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tc} />
      ) : (
        <View style={styles.inner}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.label, { color: tc }]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height:          54,
    borderRadius:    14,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 24,
  },
  inner: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize:      16,
    fontWeight:    '600',
    letterSpacing: 0.2,
    fontFamily:    'Geist-SemiBold',
  },
});