import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get('window').width;

export default function TrendsTab({ dailyData }) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.card}>
        <Text style={styles.chartTitle}>Calorie History</Text>
        <LineChart
          data={dailyData.map(d => ({ value: d.calories, label: d.date.slice(5) }))}
          color="#f97316"
          thickness={3}
          startFillColor="rgba(249, 115, 22, 0.2)"
          endFillColor="rgba(249, 115, 22, 0.01)"
          startOpacity={0.9}
          endOpacity={0.1}
          areaChart
          curved
          hideRules
          hideYAxisText
          height={180}
          width={screenWidth - 80}
          spacing={40}
          initialSpacing={10}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.chartTitle}>Macro Distribution (Avg)</Text>
        <BarChart
          data={dailyData.map(d => ({ 
            value: d.protein, 
            label: d.date.slice(8),
            frontColor: '#ef4444' 
          }))}
          barWidth={12}
          spacing={20}
          roundedTop
          hideRules
          xAxisThickness={0}
          yAxisThickness={0}
          hideYAxisText
          height={150}
          width={screenWidth - 80}
          labelTextStyle={{fontSize: 10, color: '#94a3b8'}}
        />
        <Text style={styles.chartLegend}>Daily Protein Intake (g)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: { paddingHorizontal: 24, gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 12 },
  chartTitle: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 20 },
  chartLegend: { textAlign: 'center', fontSize: 10, color: '#94a3b8', marginTop: 10 }
});