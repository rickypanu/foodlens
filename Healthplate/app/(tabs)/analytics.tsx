import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform
} from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

/* ---------------- Mock Data ---------------- */
const lineData = [
  { value: 2100, label: 'Mon', dataPointText: '2.1k' },
  { value: 2300, label: 'Tue', dataPointText: '2.3k' },
  { value: 1800, label: 'Wed', dataPointText: '1.8k' },
  { value: 2400, label: 'Thu', dataPointText: '2.4k' },
  { value: 2550, label: 'Fri', dataPointText: '2.5k' },
  { value: 1900, label: 'Sat', dataPointText: '1.9k' },
  { value: 2150, label: 'Sun', dataPointText: '2.1k' },
];

const historyLogs = [
  { id: 1, day: 'Sunday', date: 'Jan 11', calories: 2150, goal: 2200, status: 'success' },
  { id: 2, day: 'Saturday', date: 'Jan 10', calories: 1900, goal: 2200, status: 'warning' },
  { id: 3, day: 'Friday', date: 'Jan 09', calories: 2550, goal: 2200, status: 'danger' },
  { id: 4, day: 'Thursday', date: 'Jan 08', calories: 2400, goal: 2200, status: 'warning' },
  { id: 5, day: 'Wednesday', date: 'Jan 07', calories: 1800, goal: 2200, status: 'success' },
];

/* ---------------- Main Screen ---------------- */

export default function AnalyticsHistory() {
  const [range, setRange] = useState('Last 7 Days');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          
          <TouchableOpacity style={styles.datePickerButton}>
            <CalendarIcon size={14} color="#64748b" style={{ marginRight: 6 }} />
            <Text style={styles.datePickerText}>{range}</Text>
            <ChevronDown size={14} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* 1. Trend Chart Card */}
        <View style={styles.sectionContainer}>
          <View style={styles.card}>
            <View style={styles.chartHeader}>
              <Text style={styles.label}>Calorie Trend</Text>
              <View style={styles.chartValueContainer}>
                 <Text style={styles.bigNumber}>2,154</Text>
                 <Text style={styles.unitText}>avg kcal</Text>
              </View>
            </View>

            <LineChart
              data={lineData}
              color="#6366f1"
              thickness={3}
              dataPointsColor="#6366f1"
              dataPointsRadius={4}
              width={screenWidth - 80}
              height={180}
              curved
              isAnimated
              hideRules
              yAxisThickness={0}
              xAxisThickness={0}
              xAxisLabelTextStyle={{ color: '#94a3b8', fontSize: 10, fontWeight: '600' }}
              hideYAxisText
              startFillColor="rgba(99, 102, 241, 0.2)"
              endFillColor="rgba(99, 102, 241, 0.01)"
              startOpacity={0.9}
              endOpacity={0.1}
              areaChart
            />
          </View>
        </View>

        {/* 2. Key Statistics Grid */}
        <View style={styles.statsGrid}>
          <StatCard 
            label="Weekly Total" 
            value="15,080" 
            unit="kcal" 
            trend="+2.4%" 
            isPositive={false} 
          />
          <StatCard 
            label="Adherence" 
            value="85" 
            unit="%" 
            trend="+12%" 
            isPositive={true} 
          />
        </View>

        {/* 3. Detailed History List */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>History Logs</Text>
          <View style={styles.listContainer}>
            {historyLogs.map((log) => (
              <HistoryItem key={log.id} item={log} />
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- Sub-Components ---------------- */

function StatCard({ label, value, unit, trend, isPositive }) {
  return (
    <View style={[styles.card, styles.statCard]}>
      <Text style={styles.labelSmall}>{label}</Text>
      
      <View style={styles.statValueContainer}>
        <Text style={styles.statNumber}>{value}</Text>
        <Text style={styles.statUnit}>{unit}</Text>
      </View>

      <View style={[styles.trendBadge, isPositive ? styles.trendUp : styles.trendDown]}>
        {isPositive ? (
          <ArrowUpRight size={12} color="#10b981" />
        ) : (
          <ArrowDownRight size={12} color="#f43f5e" />
        )}
        <Text style={[styles.trendText, isPositive ? styles.textSuccess : styles.textDanger]}>
          {trend}
        </Text>
      </View>
    </View>
  );
}

function HistoryItem({ item }) {
  const getStatusStyles = (status) => {
    switch(status) {
      case 'success': return { bg: '#ecfdf5', text: '#059669', icon: '#10b981' }; // emerald-50
      case 'warning': return { bg: '#fffbeb', text: '#d97706', icon: '#f59e0b' }; // amber-50
      case 'danger': return { bg: '#fff1f2', text: '#e11d48', icon: '#f43f5e' }; // rose-50
      default: return { bg: '#f8fafc', text: '#475569', icon: '#64748b' };
    }
  };

  const statusStyle = getStatusStyles(item.status);

  return (
    <TouchableOpacity style={styles.historyItem}>
      <View style={styles.historyLeft}>
        <View style={styles.dateBox}>
          <Text style={styles.dateMonth}>{item.date.split(' ')[0]}</Text>
          <Text style={styles.dateDay}>{item.date.split(' ')[1]}</Text>
        </View>

        <View>
          <Text style={styles.historyDayTitle}>{item.day}</Text>
          <View style={styles.historyMeta}>
            <Flame size={12} color="#94a3b8" strokeWidth={3} />
            <Text style={styles.historyMetaText}>
              {item.calories} / {item.goal} kcal
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
        {item.status === 'success' ? (
           <CheckCircle2 size={12} color={statusStyle.icon} />
        ) : (
           <AlertCircle size={12} color={statusStyle.icon} />
        )}
        <Text style={[styles.statusText, { color: statusStyle.text }]}>
          {item.status === 'success' ? 'Good' : item.status === 'danger' ? 'Over' : 'Under'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/* ---------------- STYLESHEET ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Slate-50 background
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b', // Slate-800
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  datePickerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginRight: 4,
  },

  // Common Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9', // Slate-100
    // Soft Shadow
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionContainer: {
    paddingHorizontal: 24,
  },

  // Chart Styles
  chartHeader: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8', // Slate-400
    marginBottom: 4,
  },
  chartValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bigNumber: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1e293b',
  },
  unitText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 6,
    marginLeft: 8,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    padding: 16,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
  },
  statUnit: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginLeft: 4,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendUp: {
    backgroundColor: '#ecfdf5', // emerald-50
  },
  trendDown: {
    backgroundColor: '#fff1f2', // rose-50
  },
  trendText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  textSuccess: {
    color: '#059669',
  },
  textDanger: {
    color: '#e11d48',
  },

  // History List
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  listContainer: {
    gap: 12, // React Native 0.71+ supports gap
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBox: {
    backgroundColor: '#f8fafc',
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  dateDay: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
  },
  historyDayTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  historyMetaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
});