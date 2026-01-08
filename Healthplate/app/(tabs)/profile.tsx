import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function ProfileScreen() {
  const { userData, logout } = useAuth();

  // Recursive function to render data, including nested objects
  const renderData = (data) => {
    return Object.entries(data).map(([key, value]) => {
      // If value is an object, render it recursively
      if (typeof value === 'object' && value !== null) {
        return (
          <View key={key} style={styles.card}>
            <Text style={styles.cardTitle}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <View style={styles.cardContent}>{renderData(value)}</View>
          </View>
        );
      }

      // If value is primitive, render normally
      return (
        <View key={key} style={styles.dataRow}>
          <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Your Profile</Text>

      {/* Render all user data dynamically */}
      {userData && renderData(userData)}

      <View style={{ marginTop: 40 }}>
        <Button title="Logout" onPress={logout} color="red" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: '600',
    width: 130,
    color: '#333',
  },
  value: {
    flex: 1,
    color: '#555',
  },
  card: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
    color: '#111827',
  },
  cardContent: {
    paddingLeft: 10,
  },
});
