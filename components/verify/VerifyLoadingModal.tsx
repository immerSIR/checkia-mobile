import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { P } from '../../constants/colors';

type Props = {
  visible: boolean;
  message?: string;
};

export default function VerifyLoadingModal({ visible, message = 'Chargement...' }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={P.accent} />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  content: { backgroundColor: 'white', padding: 30, borderRadius: 20, alignItems: 'center', gap: 15 },
  text: { fontSize: 16, fontWeight: '600', color: P.text }
});
