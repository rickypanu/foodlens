import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Coffee,
  Sun,
  Moon,
  Utensils,
  ArrowLeft,
  ArrowRight,
  Home,
  Store,
  Truck,
  Package,
  Search,
  Plus,
  Minus,
  Check,
  X,
  Info,
  ChevronRight,
} from "lucide-react-native";
import { format } from "date-fns";
import { api } from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";
import { Label } from "@react-navigation/elements";
import CustomHeader from "@/src/components/header";
import MOCK_DISHES from "@/src/data/meals/dishes";
import { CATEGORIES } from "@/src/data/meals/categories";
import { MEAL_TYPES } from "@/src/data/meals/mealTypes";
import { SOURCE_TYPES } from "@/src/data/meals/sourceTypes";
import { OIL_LEVELS } from "@/src/data/meals/oilLevels";

export default function AddMeal({ navigation }) {
  // Assuming React Navigation is used
  // --- State ---
  const { userData } = useAuth();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(new Date());
  const [mealType, setMealType] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [oilLevel, setOilLevel] = useState("medium");
  const [selectedComponents, setSelectedComponents] = useState([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dishes, setDishes] = useState(MOCK_DISHES);

  const [saving, setSaving] = useState(false);

  // --- Logic Helpers ---

  // Filter Dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesSearch = dish.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || dish.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [dishes, searchQuery, selectedCategory]);

  // Component Management
 // Component Management
  const updateQuantity = (dish, delta) => {
    setSelectedComponents((prev) => {
      const existing = prev.find((c) => c.dish_id === dish.id);

      // DEBUG: Check if data exists
      if (delta > 0 && !existing) {
         console.log(`Adding ${dish.name}: Carbs=${dish.carbs}, Fat=${dish.fat}, Sodium=${dish.sodium}`);
         if (dish.carbs === undefined) console.warn("⚠️ MACRO DATA MISSING IN DISHES.JS FILE");
      }

      if (existing) {
        // Update existing quantity
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((c) => c.dish_id !== dish.id);
        }
        return prev.map((c) =>
          c.dish_id === dish.id ? { ...c, quantity: newQty } : c
        );
      } else if (delta > 0) {
        // Add new item with complete nutrition snapshot
        return [
          ...prev,
          {
            dish_id: dish.id,
            dish_name: dish.name,
            quantity: 1,
            unit: dish.unit || "serving",
            base_nutrition: {
              calories: dish.calories_mean || 0,
              protein: dish.protein_mean || 0,
              // Use fallback to 0 if data is missing to prevent NaN
              carbs: dish.carbs || 0,
              fat: dish.fat || 0,
              fiber: dish.fiber || 0,
              sodium: dish.sodium || 0,
            },
          },
        ];
      }
      return prev;
    });
  };

  // Nutrition Calculation Logic
  const nutritionTotals = useMemo(() => {
    let totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0,
    };

    // 1. Sum up base values
    selectedComponents.forEach((comp) => {
      const qty = comp.quantity;
      const base = comp.base_nutrition || {};

      totals.calories += (base.calories || 0) * qty;
      totals.protein += (base.protein || 0) * qty;
      totals.carbs += (base.carbs || 0) * qty;
      totals.fat += (base.fat || 0) * qty;
      totals.fiber += (base.fiber || 0) * qty;
      totals.sodium += (base.sodium || 0) * qty;
    });

    // 2. Oil Adjustment (Affects Calories & Fat primarily)
    // Low: -10%, Medium: 0%, High: +20%
    const oilMultipliers = { low: 0.9, medium: 1.0, high: 1.2 };
    const multiplier = oilMultipliers[oilLevel] || 1.0;

    totals.calories *= multiplier;
    totals.fat *= multiplier;

    // 3. Source Adjustment (Restaurant/Street food is oilier and saltier)
    if (sourceType === "restaurant" || sourceType === "street") {
      totals.calories *= 1.1; // +10% Calories
      totals.fat *= 1.1; // +10% Fat
      totals.sodium += 250; // +250mg Sodium (approx 1/4 tsp salt extra)
    }

    // 4. Rounding
    return {
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
      fiber: Math.round(totals.fiber),
      sodium: Math.round(totals.sodium),
    };
  }, [selectedComponents, oilLevel, sourceType]);

  // --- Reset Helper ---
  const resetForm = () => {
    setStep(1); // Back to Step 1
    setMealType("");
    setSourceType("");
    setOilLevel("medium");
    setSelectedComponents([]); // Clear selected dishes
    setSearchQuery("");
    setSelectedCategory("all");
    setDate(new Date()); // Optional: Reset date to today
  };

  // Submit Handler
// Submit Handler
  const handleSave = async () => {
    setSaving(true);
    try {
      // ... (aapka purana payload code same rahega) ...
      const payload = {
        email: userData?.email || "notfound@gmail.com",
        date: format(date, "yyyy-MM-dd"),
        meal_type: mealType,
        source_type: sourceType,
        oil_level: oilLevel,
        components: selectedComponents.map((c) => ({
          dish_id: c.dish_id,
          dish_name: c.dish_name,
          quantity: c.quantity,
          unit: c.unit,
          nutrition: null,
        })),
        nutrition: {
          calories_mean: nutritionTotals.calories,
          protein_mean: nutritionTotals.protein,
          carbs_mean: nutritionTotals.carbs,
          fat_mean: nutritionTotals.fat,
          fiber_mean: nutritionTotals.fiber,
          sodium_mean: nutritionTotals.sodium,
          sat_fat_mean: 0,
          sugar_mean: 0,
        },
        confidence_score: 0.85,
      };

      const response = await api.post("/users/meals", payload);

      if (response.data.success) {
        Alert.alert("Success", "Meal logged successfully!", [
          { 
            text: "Add More", 
            onPress: () => resetForm() // Yahan sab kuch clear ho jayega aur Step 1 par aa jayega
          },
          { 
            text: "Go Back", 
            onPress: () => {
              resetForm(); // Safety ke liye clear kar do
              navigation?.goBack();
            } 
          }, 
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save meal. Check connection.");
    } finally {
      setSaving(false);
    }
  };

  // --- Render Steps ---

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3, 4].map((s) => (
        <View
          key={s}
          style={[
            styles.progressBar,
            s <= step ? styles.progressBarActive : styles.progressBarInactive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <CustomHeader />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              step > 1 ? setStep(step - 1) : navigation?.goBack()
            }
            style={styles.backBtn}
          >
            <ArrowLeft color="#374151" size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Add Meal</Text>
            <Text style={styles.headerSubtitle}>Step {step} of 4</Text>
          </View>
        </View>

        {renderProgressBar()}

        <ScrollView contentContainerStyle={styles.content}>
          {/* STEP 1: DATE & TYPE */}
          {step === 1 && (
            <View>
              <Text style={styles.sectionTitle}>When did you eat?</Text>

              <View style={styles.dateDisplay}>
                <Text style={styles.dateText}>
                  {format(date, "EEEE, MMM d, yyyy")}
                </Text>
              </View>

              <Text style={styles.label}>Meal Type</Text>
              <View style={styles.grid}>
                {MEAL_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.card,
                        mealType === type.id && styles.cardActive,
                      ]}
                      onPress={() => {
                        setMealType(type.id);
                        setTimeout(() => setStep(2), 150);
                      }}
                    >
                      <View
                        style={[
                          styles.iconBox,
                          mealType === type.id ? styles.iconBoxActive : null,
                        ]}
                      >
                        <Icon
                          color={mealType === type.id ? "#10b981" : "#6b7280"}
                          size={28}
                        />
                      </View>
                      <Text style={styles.cardTitle}>{type.label}</Text>
                      <Text style={styles.cardSub}>{type.time}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 2: SOURCE */}
          {step === 2 && (
            <View>
              <Text style={styles.sectionTitle}>Where is it from?</Text>
              <View style={styles.listContainer}>
                {SOURCE_TYPES.map((source) => {
                  const Icon = source.icon;
                  return (
                    <TouchableOpacity
                      key={source.id}
                      style={[
                        styles.rowCard,
                        sourceType === source.id && styles.rowCardActive,
                      ]}
                      onPress={() => {
                        setSourceType(source.id);
                        setTimeout(() => setStep(3), 150);
                      }}
                    >
                      <View
                        style={[
                          styles.iconBox,
                          sourceType === source.id
                            ? styles.iconBoxActive
                            : null,
                        ]}
                      >
                        <Icon
                          color={
                            sourceType === source.id ? "#10b981" : "#6b7280"
                          }
                          size={24}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.cardTitle}>{source.label}</Text>
                        <Text style={styles.cardSub}>{source.desc}</Text>
                      </View>
                      <ChevronRight color="#d1d5db" size={20} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 3: SELECT DISHES */}
          {step === 3 && (
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Build Your Plate</Text>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Search color="#9ca3af" size={20} style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="Search dishes..."
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Categories */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.catScroll}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.catBadge,
                      selectedCategory === cat.id && styles.catBadgeActive,
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text
                      style={[
                        styles.catText,
                        selectedCategory === cat.id && styles.catTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Cart Preview (Floating) */}
              {selectedComponents.length > 0 && (
                <View style={styles.cartPreview}>
                  <Text style={styles.cartText}>
                    {selectedComponents.length} items selected
                  </Text>
                  <TouchableOpacity
                    style={styles.reviewBtn}
                    onPress={() => setStep(4)}
                  >
                    <Text style={styles.reviewBtnText}>Review</Text>
                    <ArrowRight color="white" size={16} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Dishes List */}
              <View style={styles.dishList}>
                {filteredDishes.map((dish) => {
                  const selected = selectedComponents.find(
                    (c) => c.dish_id === dish.id
                  );
                  const count = selected ? selected.quantity : 0;

                  return (
                    <View
                      key={dish.id}
                      style={[
                        styles.dishRow,
                        count > 0 && styles.dishRowActive,
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <View
                            style={[
                              styles.vegIcon,
                              dish.veg_flag === "nonveg"
                                ? { borderColor: "red" }
                                : { borderColor: "green" },
                            ]}
                          >
                            <View
                              style={[
                                styles.dot,
                                dish.veg_flag === "nonveg"
                                  ? { backgroundColor: "red" }
                                  : { backgroundColor: "green" },
                              ]}
                            />
                          </View>
                          <Text style={styles.dishName}>{dish.name}</Text>
                        </View>
                        <Text style={styles.dishInfo}>
                          {dish.calories_mean} kcal • {dish.unit}
                        </Text>
                      </View>

                      {count === 0 ? (
                        <TouchableOpacity
                          style={styles.addBtn}
                          onPress={() => updateQuantity(dish, 1)}
                        >
                          <Text style={styles.addBtnText}>ADD</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.qtyControl}>
                          <TouchableOpacity
                            onPress={() => updateQuantity(dish, -1)}
                          >
                            <Minus size={18} color="#10b981" />
                          </TouchableOpacity>
                          <Text style={styles.qtyText}>{count}</Text>
                          <TouchableOpacity
                            onPress={() => updateQuantity(dish, 1)}
                          >
                            <Plus size={18} color="#10b981" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 4: REVIEW & SAVE */}
          {step === 4 && (
            <View>
              <Text style={styles.sectionTitle}>Review & Save</Text>

              {/* Summary Card */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <View style={styles.iconBoxActive}>
                    <Utensils color="#10b981" size={20} />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.summaryTitle}>
                      {mealType
                        ? mealType.charAt(0).toUpperCase() + mealType.slice(1)
                        : ""}
                    </Text>
                    <Text style={styles.summarySub}>{sourceType}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {selectedComponents.map((item) => (
                  <View key={item.dish_id} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.dish_name}</Text>
                    <Text style={styles.itemQty}>x {item.quantity}</Text>
                  </View>
                ))}
              </View>

              {/* Oil Level */}
              <Text style={styles.label}>Oil / Ghee Level</Text>
              <View style={styles.oilContainer}>
                {OIL_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.oilBtn,
                      oilLevel === level && styles.oilBtnActive,
                    ]}
                    onPress={() => setOilLevel(level)}
                  >
                    <Text
                      style={[
                        styles.oilText,
                        oilLevel === level && styles.oilTextActive,
                      ]}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Nutrition Stats */}
              {/* Nutrition Stats Grid */}
              <View style={styles.statsContainer}>
                {/* Calories (Full Width) */}
                <View
                  style={[
                    styles.statBox,
                    {
                      backgroundColor: "#fff7ed",
                      width: "100%",
                      marginBottom: 8,
                    },
                  ]}
                >
                  <Text style={[styles.statLabel, { color: "#ea580c" }]}>
                    Calories
                  </Text>
                  <Text style={styles.statValue}>
                    {nutritionTotals.calories} kcal
                  </Text>
                </View>

                <View style={{ flexDirection: "row", gap: 8 }}>
                  {/* Protein */}
                  <View
                    style={[
                      styles.statBox,
                      { flex: 1, backgroundColor: "#fef2f2" },
                    ]}
                  >
                    <Text style={[styles.statLabel, { color: "#dc2626" }]}>
                      Protein
                    </Text>
                    <Text style={styles.statValue}>
                      {nutritionTotals.protein}g
                    </Text>
                  </View>

                  {/* Carbs */}
                  <View
                    style={[
                      styles.statBox,
                      { flex: 1, backgroundColor: "#eff6ff" },
                    ]}
                  >
                    <Text style={[styles.statLabel, { color: "#2563eb" }]}>
                      Carbs
                    </Text>
                    <Text style={styles.statValue}>
                      {nutritionTotals.carbs}g
                    </Text>
                  </View>

                  {/* Fat */}
                  <View
                    style={[
                      styles.statBox,
                      { flex: 1, backgroundColor: "#fefce8" },
                    ]}
                  >
                    <Text style={[styles.statLabel, { color: "#ca8a04" }]}>
                      Fat
                    </Text>
                    <Text style={styles.statValue}>{nutritionTotals.fat}g</Text>
                  </View>
                </View>

                {/* Micros Row */}
                <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                  <Text style={{ fontSize: 12, color: "#6b7280" }}>
                    Fiber:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {nutritionTotals.fiber}g
                    </Text>
                  </Text>
                  <Text style={{ fontSize: 12, color: "#6b7280" }}>•</Text>
                  <Text style={{ fontSize: 12, color: "#6b7280" }}>
                    Sodium:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {nutritionTotals.sodium}mg
                    </Text>
                  </Text>
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.saveButtonText}>Save Meal Log</Text>
                    <Check color="white" size={20} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    padding: 16,
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  headerSubtitle: { fontSize: 12, color: "#6b7280" },
  progressContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    height: 4,
    marginTop: -2,
  },
  progressBar: { flex: 1, height: 4, marginHorizontal: 2, borderRadius: 2 },
  progressBarActive: { backgroundColor: "#10b981" },
  progressBarInactive: { backgroundColor: "#e5e7eb" },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  },
  dateDisplay: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  dateText: { fontSize: 16, color: "#374151" },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 10,
    marginTop: 10,
  },

  // Grid
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "48%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    marginBottom: 12,
  },
  cardActive: { borderColor: "#10b981", backgroundColor: "#ecfdf5" },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  iconBoxActive: { backgroundColor: "#d1fae5" },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  cardSub: { fontSize: 12, color: "#9ca3af", marginTop: 2 },

  // List
  listContainer: { gap: 12 },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  rowCardActive: { borderColor: "#10b981", backgroundColor: "#ecfdf5" },

  // Search & Filter
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  searchInput: { flex: 1, height: "100%", fontSize: 16 },
  catScroll: { marginBottom: 16, maxHeight: 40 },
  catBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
  },
  catBadgeActive: { backgroundColor: "#10b981" },
  catText: { fontSize: 14, fontWeight: "500", color: "#4b5563" },
  catTextActive: { color: "white" },

  // Dish List
  dishList: { gap: 10 },
  dishRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  dishRowActive: { borderColor: "#10b981", backgroundColor: "#ecfdf5" },
  vegIcon: {
    width: 16,
    height: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    borderRadius: 4,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dishName: { fontSize: 15, fontWeight: "600", color: "#374151" },
  dishInfo: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  addBtn: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 1,
  },
  addBtnText: { color: "#10b981", fontWeight: "bold", fontSize: 12 },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#10b981",
    gap: 10,
  },
  qtyText: { fontWeight: "bold", fontSize: 14, color: "#111827" },

  // Cart Floating
  cartPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ecfdf5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#10b981",
  },
  cartText: { color: "#047857", fontWeight: "600" },
  reviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#059669",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  reviewBtnText: { color: "white", fontWeight: "bold", fontSize: 12 },

  // Summary
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  summarySub: { fontSize: 13, color: "#6b7280", textTransform: "capitalize" },
  divider: { height: 1, backgroundColor: "#f3f4f6", marginVertical: 12 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  itemName: { fontSize: 14, color: "#374151" },
  itemQty: { fontSize: 14, color: "#6b7280" },

  // Oil
  oilContainer: { flexDirection: "row", gap: 10, marginBottom: 20 },
  oilBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
  },
  oilBtnActive: { backgroundColor: "#10b981" },
  oilText: { fontWeight: "500", color: "#6b7280" },
  oilTextActive: { color: "white" },

  // Stats
  statsContainer: { flexDirection: "column", gap: 12, marginBottom: 30 },
  statBox: { flex: 1, padding: 16, borderRadius: 12 },
  statLabel: { fontSize: 12, fontWeight: "600", marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#111827" },

  // Save Btn
  saveButton: {
    backgroundColor: "#10b981",
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 6,
  },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
