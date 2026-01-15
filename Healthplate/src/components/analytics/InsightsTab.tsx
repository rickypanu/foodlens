import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Dimensions, Alert 
} from 'react-native';
import { Activity, Scale, Plus, X } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { api } from '@/src/services/api';
import { useAuth } from '@/src/context/AuthContext';

const screenWidth = Dimensions.get('window').width;

export default function InsightsTab({ predictions, weightTrend, weightHistory, refreshData }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, value: 0, index: 0, x: 0, y: 0 });
  
  // FIX: Destructure userdata correctly
  const { userdata } = useAuth(); 

  const handleSaveWeight = async () => {
    if (!newWeight) return;
    
    // SAFETY CHECK: Ensure user ID exists
    if (!userdata?._id) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        return;
    }

    setLoading(true);
    try {
      // POST to the correct endpoint
      const response = await api.post('/users/add_weight', { 
        user_id: userdata._id,
        weight: parseFloat(newWeight), 
        date: new Date().toISOString().split('T')[0] 
      });
      
      console.log("Weight Saved:", response.data);
      
      setNewWeight('');
      setModalVisible(false);
      
      if (refreshData) refreshData(); 
      Alert.alert("Success", "Weight logged for today!");
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      Alert.alert("Error", "Could not save weight.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare Chart Data
  const chartLabels = weightHistory?.map(item => {
    const d = new Date(item.date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }) || [];
  
  const chartData = weightHistory?.map(item => item.weight) || [];

  return (
    <View style={styles.sectionContainer}>
      
      {/* --- ADD WEIGHT MODAL (Internal) --- */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.rowBetween}>
              <Text style={styles.modalTitle}>Log Today's Weight</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <TextInput 
              style={styles.input}
              placeholder="e.g. 75.5"
              keyboardType="numeric"
              value={newWeight}
              onChangeText={setNewWeight}
            />
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSaveWeight}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Saving..." : "Save Weight"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- PREDICTIONS CARD --- */}
      {predictions && (
        <View style={styles.card}>
            <View style={styles.row}>
                <Activity size={20} color="#8b5cf6" />
                <Text style={styles.sectionTitle}>7-Day Forecast</Text>
            </View>
             <View style={styles.predictionBox}>
                <View style={styles.rowBetween}>
                  <Text style={styles.textGray}>Current 7-day avg</Text>
                  <Text style={styles.textBold}>{Math.round(predictions.avgLast7)} kcal</Text>
                </View>
             </View>
        </View>
      )}

      {/* --- WEIGHT GRAPH --- */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <Scale size={20} color="#ec4899" />
            <Text style={styles.sectionTitle}>Weight Trajectory</Text>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
            <Plus size={16} color="white" />
          </TouchableOpacity>
        </View>

        {weightHistory && weightHistory.length > 0 ? (
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <LineChart
              data={{
                labels: chartLabels.slice(-6),
                datasets: [{ data: chartData }]
              }}
              width={screenWidth - 80} 
              height={220}
              yAxisSuffix="kg"
              onDataPointClick={({ value, index, x, y }) => {
                setTooltip({ visible: true, value, index, x, y });
              }}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "5", strokeWidth: "2", stroke: "#8b5cf6" }
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
            {tooltip.visible && (
              <View style={[styles.tooltip, { top: tooltip.y - 40, left: tooltip.x - 25 }]}>
                <Text style={styles.tooltipText}>
                  {chartData[tooltip.index]}kg on {chartLabels[tooltip.index]}
                </Text>
              </View>
            )}
          </View>
        ) : (
           <Text style={{padding: 20, textAlign: 'center', color: '#94a3b8'}}>
             No graph data yet. Add your first weight!
           </Text>
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
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginLeft: 8 },
  predictionBox: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 12, marginTop: 12 },
  textGray: { fontSize: 12, color: '#64748b' },
  textBold: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  addButton: { backgroundColor: '#8b5cf6', borderRadius: 20, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', width: '80%', padding: 20, borderRadius: 20, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  input: { backgroundColor: '#f1f5f9', padding: 15, borderRadius: 12, marginTop: 15, fontSize: 16, color: '#1e293b' },
  saveButton: { backgroundColor: '#8b5cf6', padding: 15, borderRadius: 12, marginTop: 15, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  tooltip: { position: 'absolute', backgroundColor: '#1e293b', padding: 8, borderRadius: 8, zIndex: 100 },
  tooltipText: { color: 'white', fontSize: 10, fontWeight: 'bold' }
});