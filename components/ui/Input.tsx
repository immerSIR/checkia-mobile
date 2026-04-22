import React, { useState } from 'react';
import {
  TextInput, View, Text,
  StyleSheet, TouchableOpacity, TextInputProps,
} from 'react-native';
import { Colors } from '../../constants/colors';

type Props = TextInputProps & {
  label?:            string;
  leftIcon?:         React.ReactNode;
  rightIcon?:        React.ReactNode;
  onRightIconPress?: () => void;
  error?:            string;
};

export function Input({
  label, leftIcon, rightIcon,
  onRightIconPress, style, error, ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}

      <View style={[
        styles.inputWrap,
        focused && styles.inputWrapFocused,
        !!error && styles.inputWrapError,
      ]}>
        {leftIcon ? (
          <View style={styles.leftIcon}>{leftIcon}</View>
        ) : null}

        <TextInput
          {...props}
          placeholderTextColor={Colors.inputPlaceholder}
          style={[styles.input, style]}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={(e) => { setFocused(true);  props.onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); props.onBlur?.(e);  }}
        />

        {rightIcon ? (
          onRightIconPress ? (
            <TouchableOpacity
              onPress={onRightIconPress}
              activeOpacity={0.7}
              style={styles.rightIcon}
            >
              {rightIcon}
            </TouchableOpacity>
          ) : (
            <View style={styles.rightIcon}>{rightIcon}</View>
          )
        ) : null}
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    color:          Colors.ink3,
    fontSize:       10,
    marginBottom:   8,
    letterSpacing:  1.4,
    textTransform:  'uppercase',
    fontFamily:     'Geist-SemiBold',
    fontWeight:     '600',
  },
  inputWrap: {
    minHeight:        54,
    backgroundColor:  Colors.inputBg,
    borderWidth:      1.5,
    borderColor:      Colors.inputBorder,
    borderRadius:     14,
    paddingHorizontal: 16,
    flexDirection:    'row',
    alignItems:       'center',
  },
  inputWrapFocused: {
    borderColor:     Colors.accent,
    backgroundColor: '#FDFCFA',
  },
  inputWrapError: {
    borderColor: Colors.false,
  },
  leftIcon: {
    marginRight:    10,
    alignItems:     'center',
    justifyContent: 'center',
  },
  rightIcon: {
    marginLeft:     10,
    alignItems:     'center',
    justifyContent: 'center',
  },
  input: {
    flex:        1,
    color:       Colors.text,
    fontSize:    15,
    paddingVertical: 14,
    fontFamily:  'Geist-Regular',
  },
  error: {
    color:       Colors.false,
    fontSize:    12,
    marginTop:   6,
    fontFamily:  'Geist-Regular',
  },
});