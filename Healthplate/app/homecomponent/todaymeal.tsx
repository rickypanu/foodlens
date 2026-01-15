import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Platform 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TodayMeal({ meals, onDelete }) {
  const safeMeals = meals || [];
  
  // --- STATE FOR CUSTOM MODAL ---
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState(null);

  // 1. Triggered when clicking the trash icon
  const openDeleteModal = (mealId) => {
    setSelectedMealId(mealId);
    setModalVisible(true);
  };

  // 2. Triggered when clicking "Delete" inside the modal
  const confirmDelete = () => {
    if (selectedMealId) {
      onDelete(selectedMealId);
      setModalVisible(false);
      setSelectedMealId(null);
    }
  };

  // 3. Triggered when clicking "Cancel"
  const cancelDelete = () => {
    setModalVisible(false);
    setSelectedMealId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Log</Text>

      {safeMeals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No meals logged for this date.</Text>
        </View>
      ) : (
        safeMeals.map((meal, index) => {
          const iconName = getIconName(meal.type);
          
          return (
            <View key={index} style={styles.card}>
              {/* Left Side: Icon & Text */}
              <View style={styles.leftSection}>
                <View style={styles.iconBox}>
                  <Ionicons name={iconName} size={24} color="#166534" />
                </View>

                <View style={styles.content}>
                  <Text style={styles.mealType}>{meal.type}</Text>
                  <Text style={styles.foodItems} numberOfLines={1}>
                    {meal.items}
                  </Text>
                </View>
              </View>

              {/* Right Side: Delete Button */}
              <TouchableOpacity 
                onPress={() => openDeleteModal(meal.id)}
                style={styles.deleteBtn}
                activeOpacity={0.6}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          );
        })
      )}

      {/* --- CUSTOM DELETE MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelDelete} // Android back button handle
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {/* Warning Icon */}
            <View style={styles.warningIconCircle}>
              <Ionicons name="warning-outline" size={32} color="#DC2626" />
            </View>

            <Text style={styles.modalTitle}>Delete this meal?</Text>
            <Text style={styles.modalMessage}>
              Are you sure? This action cannot be undone and will affect your daily stats.
            </Text>

            <View style={styles.modalButtons}>
              {/* Cancel Button */}
              <TouchableOpacity 
                style={styles.btnCancel} 
                onPress={cancelDelete}
              >
                <Text style={styles.textCancel}>Cancel</Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity 
                style={styles.btnDelete} 
                onPress={confirmDelete}
              >
                <Text style={styles.textDelete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getIconName = (type) => {
  const t = type?.toLowerCase() || "";
  if (t.includes("breakfast")) return "partly-sunny";
  if (t.includes("lunch")) return "sunny";
  if (t.includes("dinner")) return "moon";
  if (t.includes("snack")) return "cafe";
  return "fast-food";
};

const styles = StyleSheet.create({
  container: { marginTop: 10, marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 15 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  leftSection: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconBox: {
    width: 50, height: 50, borderRadius: 16,
    backgroundColor: "#F0FDF4", justifyContent: "center", alignItems: "center",
    marginRight: 16,
  },
  content: { flex: 1, justifyContent: "center", marginRight: 10 },
  mealType: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 4 },
  foodItems: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  emptyContainer: { padding: 20, alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 16 },
  emptyText: { color: '#9CA3AF' },
  deleteBtn: { padding: 8, backgroundColor: '#FEF2F2', borderRadius: 8 },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  warningIconCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#FEF2F2', // Light red circle
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  btnDelete: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#DC2626', // Strong red
    borderRadius: 12,
    alignItems: 'center',
  },
  textCancel: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  textDelete: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});