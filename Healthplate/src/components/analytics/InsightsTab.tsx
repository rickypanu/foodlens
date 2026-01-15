import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Activity, Scale, Plus, ArrowUp, ArrowDown } from 'lucide-react-native';

export default function InsightsTab({ predictions, weightTrend, onAddWeight }) {
  return (
    <View style={styles.sectionContainer}>
      
      {/* Calorie Prediction */}
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
            <View style={[styles.rowBetween, {marginTop: 8}]}>
              <Text style={styles.textGray}>Trend</Text>
              <View style={styles.row}>
                {predictions.trend > 0 ? <ArrowUp size={16} color="#f97316"/> : <ArrowDown size={16} color="#10b981"/>}
                <Text style={{fontWeight: 'bold', marginLeft: 4}}>
                  {predictions.trend > 0 ? '+' : ''}{Math.round(predictions.trend)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.insightNote}>
            <Text style={styles.insightText}>
              Based on your current pace, your next week's average will be approx 
              <Text style={{fontWeight: 'bold'}}> {Math.round(predictions.next7)} kcal/day</Text>.
            </Text>
          </View>
        </View>
      )}

      {/* Weight Trajectory */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <Scale size={20} color="#ec4899" />
            <Text style={styles.sectionTitle}>Weight Trajectory</Text>
          </View>
          <TouchableOpacity onPress={onAddWeight} style={styles.addButton}>
            <Plus size={16} color="white" />
          </TouchableOpacity>
        </View>

        {weightTrend ? (
          <View style={{marginTop: 16}}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.textGray}>Current</Text>
                  <Text style={styles.bigNumber}>{weightTrend.current}kg</Text>
                </View>
                <View>
                    <Text style={styles.textGray}>Forecast (7d)</Text>
                    <Text style={[styles.bigNumber, {color: '#8b5cf6'}]}>
                      {weightTrend.predicted7.toFixed(1)}kg
                    </Text>
                </View>
              </View>
              <Text style={[styles.textSmall, {marginTop: 12}]}>
                Trending {weightTrend.dailyChange > 0 ? 'up' : 'down'} by {Math.abs(weightTrend.dailyChange).toFixed(2)} kg/day
              </Text>
          </View>
        ) : (
          <Text style={{padding: 20, textAlign: 'center', color: '#94a3b8'}}>Not enough weight data.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: { paddingHorizontal: 24, gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginLeft: 8 },
  predictionBox: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 12, marginTop: 12 },
  insightNote: { backgroundColor: '#faf5ff', padding: 12, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: '#e9d5ff' },
  insightText: { fontSize: 12, color: '#6b21a8' },
  textGray: { fontSize: 12, color: '#64748b' },
  textBold: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  bigNumber: { fontSize: 24, fontWeight: '900', color: '#1e293b' },
  textSmall: { fontSize: 12, color: '#64748b' },
  addButton: { backgroundColor: '#8b5cf6', borderRadius: 20, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
});