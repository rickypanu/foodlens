import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function ProfileScreen() {
  const { userData, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{userData?.name}</Text>
      <Text style={styles.info}>Email: {userData?.email}</Text>
      <View style={{ marginTop: 50, width: '100%' }}>
        <Button title="Logout" onPress={logout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 28, fontWeight: 'bold' },
  info: { fontSize: 16, color: 'gray', marginTop: 10 }
});