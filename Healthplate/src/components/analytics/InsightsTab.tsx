import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Dimensions, Alert, ActivityIndicator 
} from 'react-native';
import { Activity, Scale, Plus, X } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { api } from '@/src/services/api';
import { useAuth } from '@/src/context/AuthContext';

const screenWidth = Dimensions.get('window').width;

export default function InsightsTab({ predictions, weightHistory, refreshData }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, value: 0, index: 0, x: 0, y: 0 });

  const { userData } = useAuth();

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleSaveWeight = async () => {
    console.log("Attempting to save...");
    console.log(userData) // DEBUG
    
    // 1. Validation Alerts
    if (!newWeight) {
      Alert.alert("Missing Input", "Please enter a weight value.");
      return;
    }
    
    if (!userData?.email) {
      Alert.alert("Auth Error", "User email is missing. Check your login state.");
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const payload = { 
        email: userData.email,
        weight: parseFloat(newWeight), 
        date: today
      };

      const response = await api.post('/users/add_weight', payload);
      
      setNewWeight('');
      setModalVisible(false);
      
      if (refreshData) {
        console.log("Refreshing Data..."); // DEBUG
        await refreshData();
      }
      
      Alert.alert("Success", "Weight logged successfully!");
    } catch (error) {
      console.error("API Error Full:", error);
      const msg = error.response?.data?.detail || "Check your internet connection.";
      Alert.alert("Save Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  // Safe Chart Data
  const chartLabels = weightHistory?.map(item => {
    const d = new Date(item.date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }) || [];
  const chartData = weightHistory?.map(item => item.weight) || [];
  const hasData = chartData.length > 0;

  return (
    <View style={styles.sectionContainer}>
      
      {/* --- MODAL --- */}
      <Modal 
        transparent={true} 
        visible={modalVisible} 
        animationType="fade"
        onRequestClose={() => setModalVisible(false)} // Android Back Button handling
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.rowBetween}>
              <Text style={styles.modalTitle}>Log Today's Weight</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={20}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <TextInput 
              style={styles.input}
              placeholder="e.g. 75.5"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={newWeight}
              onChangeText={setNewWeight}
              autoFocus={true} // Helps focus immediately
            />

            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSaveWeight}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Weight</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- STATS CARD --- */}
      {predictions && (
        <View style={styles.card}>
            <View style={styles.row}>
                <Activity size={20} color="#8b5cf6" />
                <Text style={styles.sectionTitle}>Stats</Text>
            </View>
             <View style={styles.predictionBox}>
                <View style={styles.rowBetween}>
                  <Text style={styles.textGray}>7-Day Average</Text>
                  <Text style={styles.textBold}>{Math.round(predictions.avgLast7 || 0)} kg</Text>
                </View>
             </View>
        </View>
      )}

      {/* --- GRAPH CARD --- */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <Scale size={20} color="#ec4899" />
            <Text style={styles.sectionTitle}>Weight Trajectory</Text>
          </View>
          
          {/* FIX: Increased hitSlop makes the button easier to tap */}
          <TouchableOpacity 
            onPress={handleOpenModal} 
            style={styles.addButton}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} 
          >
            <Plus size={16} color="white" />
          </TouchableOpacity>
        </View>

        {hasData ? (
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <LineChart
              data={{
                labels: chartLabels.slice(-50),
                datasets: [{ data: chartData.slice(-50) }]
              }}
              width={screenWidth - 80} 
              height={220}
              yAxisSuffix="kg"
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                propsForDots: { r: "5", strokeWidth: "2", stroke: "#8b5cf6" }
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        ) : (
           <Text style={styles.emptyText}>No data yet. Add a weight!</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: { paddingHorizontal: 24, gap: 16, paddingBottom: 50 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  predictionBox: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, marginTop: 12 },
  textGray: { fontSize: 12, color: '#64748b' },
  textBold: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  emptyText: { padding: 30, textAlign: 'center', color: '#94a3b8' },
  
  // FIX: Make the button physically larger too, just in case
  addButton: { 
    backgroundColor: '#8b5cf6', 
    borderRadius: 20, 
    width: 32, // Increased from 28
    height: 32, // Increased from 28
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 3 // Add shadow to make it pop
  },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', width: '85%', padding: 24, borderRadius: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  input: { backgroundColor: '#f1f5f9', padding: 15, borderRadius: 12, marginTop: 20, fontSize: 18, textAlign: 'center', color: '#1e293b' },
  saveButton: { backgroundColor: '#8b5cf6', padding: 15, borderRadius: 12, marginTop: 20, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});