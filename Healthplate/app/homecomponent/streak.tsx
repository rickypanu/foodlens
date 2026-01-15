import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const StreakCalendar = ({ weekData = [] }) => {
  if (!weekData || weekData.length === 0) return null;

  // Get current date string for comparison (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <View style={styles.calendarStrip}>
      {weekData.map((day, index) => {
        const isToday = day.is_today;
        const hasData = day.has_data;
        
        // Determine if the day is in the future
        // We compare strings directly (e.g. "2023-10-15" > "2023-10-14")
        const isFuture = day.date > todayStr;
        const isPast = day.date < todayStr;

        return (
          <View key={index} style={styles.dayContainer}>
            {/* Day Label (Mon, Tue) */}
            <Text style={[styles.dayLabel, isToday && styles.todayLabelText]}>
              {day.day.substring(0, 3)}
            </Text>

            {/* The Bubble */}
            <View
              style={[
                styles.dayBubble,
                // Style Logic:
                hasData ? styles.fireBubble :             // 1. Has Data (Fire)
                isToday ? styles.todayBubble :            // 2. Today (Neutral/Active)
                isPast ? styles.missedBubble :            // 3. Past & No Data (X)
                styles.futureBubble                       // 4. Future (White)
              ]}
            >
              {/* Content Logic */}
              {hasData ? (
                // 🔥 LOGGED
                <Ionicons name="flame" size={18} color="#FF5722" />
              ) : isPast && !isToday ? (
                // ❌ MISSED (Past, no data, not today)
                <Ionicons name="close" size={18} color="#EF4444" />
              ) : (
                // 📅 TODAY or FUTURE (Show Date Number)
                <Text
                  style={[
                    styles.dayDateText,
                    isToday ? styles.todayDateText : styles.futureDateText,
                  ]}
                >
                  {day.date ? day.date.split("-")[2] : "-"}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#F9FAFB",
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  dayContainer: {
    alignItems: "center",
    gap: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  todayLabelText: {
    color: "#10B981", // Highlight "Mon/Tue" text green if today
    fontWeight: "700",
  },
  
  // --- BUBBLE BASE ---
  dayBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  // --- STATE STYLES ---

  // 1. Fire (Logged)
  fireBubble: {
    backgroundColor: "#FFEBEE", // Light Orange/Red bg
    borderColor: "#FFCCBC",
  },

  // 2. Missed (X)
  missedBubble: {
    backgroundColor: "#FEF2F2", // Light Red bg
    borderColor: "#FECACA",
  },

  // 3. Today (Current)
  todayBubble: {
    backgroundColor: "#FFFFFF",
    borderColor: "#10B981", // Green Border
    borderWidth: 2,         // Thicker border for Today
    elevation: 2,
  },

  // 4. Future (Upcoming)
  futureBubble: {
    backgroundColor: "#FFFFFF", // White
    borderColor: "#E5E7EB",     // Light Gray border
  },

  // --- TEXT STYLES ---
  dayDateText: {
    fontSize: 12,
    fontWeight: "600",
  },
  todayDateText: {
    color: "#10B981", // Green text for Today's number
    fontWeight: "bold",
  },
  futureDateText: {
    color: "#9CA3AF", // Gray text for Future numbers
  },
});

export default StreakCalendar;