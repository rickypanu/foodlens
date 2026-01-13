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

const MEAL_TYPES = [
  { id: "breakfast", label: "Breakfast", icon: Coffee, time: "6am - 11am" },
  { id: "lunch", label: "Lunch", icon: Sun, time: "11am - 3pm" },
  { id: "dinner", label: "Dinner", icon: Moon, time: "6pm - 10pm" },
  { id: "snack", label: "Snack", icon: Utensils, time: "Anytime" },
];

const SOURCE_TYPES = [
  { id: "home", label: "Home-cooked", icon: Home, desc: "Made at home" },
  {
    id: "restaurant",
    label: "Restaurant",
    icon: Store,
    desc: "Dine-out/delivery",
  },
  { id: "street", label: "Street Food", icon: Truck, desc: "Vendor or stall" },
  { id: "packaged", label: "Packaged", icon: Package, desc: "Ready-to-eat" },
];

const OIL_LEVELS = ["low", "medium", "high"];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "breads_indian", label: "Breads" },
  { id: "rice_grains", label: "Rice" },
  { id: "dal_legumes", label: "Dal" },
  { id: "veg_dishes", label: "Veg" },
  { id: "paneer_dairy", label: "Paneer/Dairy" },
  { id: "nonveg_dishes", label: "Non-Veg" },
  { id: "breakfast_items", label: "Breakfast" },
  { id: "fruits", label: "Fruits" }, // NEW
  { id: "snacks_street", label: "Snacks" },
  { id: "sweets_desserts", label: "Desserts" },
  { id: "beverages", label: "Beverages" },
  { id: "packaged", label: "Packaged" }, // NEW
  { id: "sides_addons", label: "Addons" },
];

// Mock dishes to use if API fails or for demo
const MOCK_DISHES = [
  // --- Breads ---
  {
    id: "1",
    name: "Roti (Chapati)",
    category: "breads_indian",
    calories_mean: 104,
    protein_mean: 3,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "2",
    name: "Butter Naan",
    category: "breads_indian",
    calories_mean: 260,
    protein_mean: 5,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "3",
    name: "Tandoori Roti",
    category: "breads_indian",
    calories_mean: 110,
    protein_mean: 3.5,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "4",
    name: "Aloo Paratha",
    category: "breads_indian",
    calories_mean: 290,
    protein_mean: 6,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "5",
    name: "Puri",
    category: "breads_indian",
    calories_mean: 140,
    protein_mean: 2,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "6",
    name: "Bhatura",
    category: "breads_indian",
    calories_mean: 280,
    protein_mean: 6,
    unit: "piece",
    veg_flag: "veg",
  },

  // --- Rice & Grains ---
  {
    id: "7",
    name: "Steamed Rice (Plain)",
    category: "rice_grains",
    calories_mean: 130,
    protein_mean: 2.7,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "8",
    name: "Jeera Rice",
    category: "rice_grains",
    calories_mean: 180,
    protein_mean: 3,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "9",
    name: "Veg Biryani",
    category: "rice_grains",
    calories_mean: 240,
    protein_mean: 5,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "10",
    name: "Chicken Biryani",
    category: "rice_grains",
    calories_mean: 360,
    protein_mean: 18,
    unit: "bowl",
    veg_flag: "nonveg",
  },
  {
    id: "11",
    name: "Curd Rice",
    category: "rice_grains",
    calories_mean: 210,
    protein_mean: 6,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "12",
    name: "Khichdi",
    category: "rice_grains",
    calories_mean: 170,
    protein_mean: 6,
    unit: "bowl",
    veg_flag: "veg",
  },

  // --- Dal & Legumes ---
  {
    id: "13",
    name: "Dal Fry",
    category: "dal_legumes",
    calories_mean: 150,
    protein_mean: 6,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "14",
    name: "Dal Makhani",
    category: "dal_legumes",
    calories_mean: 280,
    protein_mean: 9,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "15",
    name: "Chana Masala (Chole)",
    category: "dal_legumes",
    calories_mean: 220,
    protein_mean: 10,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "16",
    name: "Rajma Masala",
    category: "dal_legumes",
    calories_mean: 240,
    protein_mean: 11,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "17",
    name: "Sambar",
    category: "dal_legumes",
    calories_mean: 130,
    protein_mean: 5,
    unit: "bowl",
    veg_flag: "veg",
  },

  // --- Veg Dishes ---
  {
    id: "18",
    name: "Aloo Gobi",
    category: "veg_dishes",
    calories_mean: 180,
    protein_mean: 4,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "19",
    name: "Mix Veg",
    category: "veg_dishes",
    calories_mean: 190,
    protein_mean: 5,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "20",
    name: "Bhindi Masala",
    category: "veg_dishes",
    calories_mean: 160,
    protein_mean: 3,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "21",
    name: "Baingan Bharta",
    category: "veg_dishes",
    calories_mean: 140,
    protein_mean: 2,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "22",
    name: "Malai Kofta",
    category: "veg_dishes",
    calories_mean: 350,
    protein_mean: 8,
    unit: "bowl",
    veg_flag: "veg",
  },

  // --- Paneer & Dairy ---
  {
    id: "23",
    name: "Paneer Butter Masala",
    category: "paneer_dairy",
    calories_mean: 320,
    protein_mean: 12,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "24",
    name: "Palak Paneer",
    category: "paneer_dairy",
    calories_mean: 240,
    protein_mean: 14,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "25",
    name: "Kadai Paneer",
    category: "paneer_dairy",
    calories_mean: 280,
    protein_mean: 13,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "26",
    name: "Matar Paneer",
    category: "paneer_dairy",
    calories_mean: 260,
    protein_mean: 11,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "27",
    name: "Plain Curd (Dahi)",
    category: "paneer_dairy",
    calories_mean: 100,
    protein_mean: 4,
    unit: "bowl",
    veg_flag: "veg",
  },

  // --- Non-Veg ---
  {
    id: "28",
    name: "Butter Chicken",
    category: "nonveg_dishes",
    calories_mean: 450,
    protein_mean: 25,
    unit: "bowl",
    veg_flag: "nonveg",
  },
  {
    id: "29",
    name: "Chicken Curry (Home Style)",
    category: "nonveg_dishes",
    calories_mean: 300,
    protein_mean: 28,
    unit: "bowl",
    veg_flag: "nonveg",
  },
  {
    id: "30",
    name: "Mutton Rogan Josh",
    category: "nonveg_dishes",
    calories_mean: 480,
    protein_mean: 22,
    unit: "bowl",
    veg_flag: "nonveg",
  },
  {
    id: "31",
    name: "Fish Curry",
    category: "nonveg_dishes",
    calories_mean: 260,
    protein_mean: 20,
    unit: "bowl",
    veg_flag: "nonveg",
  },
  {
    id: "32",
    name: "Egg Curry (2 eggs)",
    category: "nonveg_dishes",
    calories_mean: 240,
    protein_mean: 14,
    unit: "bowl",
    veg_flag: "nonveg",
  },
  {
    id: "33",
    name: "Tandoori Chicken",
    category: "nonveg_dishes",
    calories_mean: 260,
    protein_mean: 30,
    unit: "piece",
    veg_flag: "nonveg",
  },

  // --- Breakfast Items ---
  {
    id: "34",
    name: "Masala Dosa",
    category: "breakfast_items",
    calories_mean: 350,
    protein_mean: 6,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "35",
    name: "Idli",
    category: "breakfast_items",
    calories_mean: 50,
    protein_mean: 2,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "36",
    name: "Poha",
    category: "breakfast_items",
    calories_mean: 250,
    protein_mean: 4,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "37",
    name: "Upma",
    category: "breakfast_items",
    calories_mean: 220,
    protein_mean: 5,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "38",
    name: "Vada (Medu)",
    category: "breakfast_items",
    calories_mean: 140,
    protein_mean: 4,
    unit: "piece",
    veg_flag: "veg",
  },

  // --- Snacks ---
  {
    id: "39",
    name: "Samosa",
    category: "snacks_street",
    calories_mean: 260,
    protein_mean: 4,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "40",
    name: "Pani Puri",
    category: "snacks_street",
    calories_mean: 50,
    protein_mean: 1,
    unit: "plate",
    veg_flag: "veg",
  },
  {
    id: "41",
    name: "Pav Bhaji",
    category: "snacks_street",
    calories_mean: 400,
    protein_mean: 8,
    unit: "plate",
    veg_flag: "veg",
  },
  {
    id: "42",
    name: "Vada Pav",
    category: "snacks_street",
    calories_mean: 300,
    protein_mean: 6,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "43",
    name: "Dhokla",
    category: "snacks_street",
    calories_mean: 150,
    protein_mean: 5,
    unit: "piece",
    veg_flag: "veg",
  },

  // --- Sweets ---
  {
    id: "44",
    name: "Gulab Jamun",
    category: "sweets_desserts",
    calories_mean: 150,
    protein_mean: 2,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "45",
    name: "Rasgulla",
    category: "sweets_desserts",
    calories_mean: 120,
    protein_mean: 3,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "46",
    name: "Gajar Ka Halwa",
    category: "sweets_desserts",
    calories_mean: 350,
    protein_mean: 6,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "47",
    name: "Kheer",
    category: "sweets_desserts",
    calories_mean: 280,
    protein_mean: 7,
    unit: "bowl",
    veg_flag: "veg",
  },

  // --- Beverages ---
  {
    id: "48",
    name: "Masala Chai",
    category: "beverages",
    calories_mean: 100,
    protein_mean: 3,
    unit: "cup",
    veg_flag: "veg",
  },
  {
    id: "49",
    name: "Sweet Lassi",
    category: "beverages",
    calories_mean: 250,
    protein_mean: 8,
    unit: "glass",
    veg_flag: "veg",
  },
  {
    id: "50",
    name: "Filter Coffee",
    category: "beverages",
    calories_mean: 110,
    protein_mean: 4,
    unit: "cup",
    veg_flag: "veg",
  },

  // --- Sides ---
  {
    id: "51",
    name: "Papad",
    category: "sides_addons",
    calories_mean: 45,
    protein_mean: 2,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "52",
    name: "Pickle (Achar)",
    category: "sides_addons",
    calories_mean: 30,
    protein_mean: 0,
    unit: "tbsp",
    veg_flag: "veg",
  },
  {
    id: "53",
    name: "Whole Milk (1 Cup)",
    category: "beverages",
    calories_mean: 150,
    protein_mean: 8,
    unit: "cup",
    veg_flag: "veg",
  },
  {
    id: "54",
    name: "Turmeric Milk (Haldi Doodh)",
    category: "beverages",
    calories_mean: 180,
    protein_mean: 8,
    unit: "cup",
    veg_flag: "veg",
  },
  {
    id: "55",
    name: "Chaas (Buttermilk)",
    category: "beverages",
    calories_mean: 45,
    protein_mean: 2,
    unit: "glass",
    veg_flag: "veg",
  },
  {
    id: "56",
    name: "Bournvita/Horlicks Milk",
    category: "beverages",
    calories_mean: 190,
    protein_mean: 9,
    unit: "cup",
    veg_flag: "veg",
  },

  // --- Basic Staples & Packaged ---
  {
    id: "57",
    name: "Maggi Noodles",
    category: "snacks_street",
    calories_mean: 310,
    protein_mean: 6,
    unit: "pack",
    veg_flag: "veg",
  },
  {
    id: "58",
    name: "White Bread Slice",
    category: "breads_indian",
    calories_mean: 70,
    protein_mean: 2,
    unit: "slice",
    veg_flag: "veg",
  },
  {
    id: "59",
    name: "Brown Bread Slice",
    category: "breads_indian",
    calories_mean: 75,
    protein_mean: 3,
    unit: "slice",
    veg_flag: "veg",
  },
  {
    id: "60",
    name: "Marie Biscuit",
    category: "packaged",
    calories_mean: 22,
    protein_mean: 0.5,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "61",
    name: "Cream Biscuit (Oreo/Bourbon)",
    category: "packaged",
    calories_mean: 50,
    protein_mean: 0.5,
    unit: "piece",
    veg_flag: "veg",
  },

  // --- Healthy Basics & Eggs ---
  {
    id: "62",
    name: "Boiled Egg",
    category: "nonveg_dishes",
    calories_mean: 70,
    protein_mean: 6,
    unit: "piece",
    veg_flag: "nonveg",
  },
  {
    id: "63",
    name: "Omelette (2 eggs)",
    category: "nonveg_dishes",
    calories_mean: 220,
    protein_mean: 14,
    unit: "plate",
    veg_flag: "nonveg",
  },
  {
    id: "64",
    name: "Egg Bhurji (2 eggs)",
    category: "nonveg_dishes",
    calories_mean: 250,
    protein_mean: 14,
    unit: "plate",
    veg_flag: "nonveg",
  },
  {
    id: "65",
    name: "Green Salad (Cucumber/Tomato)",
    category: "sides_addons",
    calories_mean: 30,
    protein_mean: 1,
    unit: "bowl",
    veg_flag: "veg",
  },
  {
    id: "66",
    name: "Sprouts Salad",
    category: "sides_addons",
    calories_mean: 120,
    protein_mean: 8,
    unit: "bowl",
    veg_flag: "veg",
  },

  // --- Fruits ---
  {
    id: "67",
    name: "Banana",
    category: "fruits",
    calories_mean: 105,
    protein_mean: 1.3,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "68",
    name: "Apple",
    category: "fruits",
    calories_mean: 95,
    protein_mean: 0.5,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "69",
    name: "Mango",
    category: "fruits",
    calories_mean: 200,
    protein_mean: 2,
    unit: "piece",
    veg_flag: "veg",
  },
  {
    id: "70",
    name: "Papaya",
    category: "fruits",
    calories_mean: 60,
    protein_mean: 1,
    unit: "bowl",
    veg_flag: "veg",
  },
];

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
  const updateQuantity = (dish, delta) => {
    setSelectedComponents((prev) => {
      const existing = prev.find((c) => c.dish_id === dish.id);

      if (existing) {
        // Update existing
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((c) => c.dish_id !== dish.id);
        }
        return prev.map((c) =>
          c.dish_id === dish.id ? { ...c, quantity: newQty } : c
        );
      } else if (delta > 0) {
        // Add new
        return [
          ...prev,
          {
            dish_id: dish.id,
            dish_name: dish.name,
            quantity: 1,
            unit: dish.unit || "serving",
            // Store base nutrition for calculation
            base_nutrition: {
              calories: dish.calories_mean,
              protein: dish.protein_mean,
              // Add others...
            },
          },
        ];
      }
      return prev;
    });
  };

  // Nutrition Calculation Logic (Simplified Version of Web)
  const nutritionTotals = useMemo(() => {
    let totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0,
    };

    selectedComponents.forEach((comp) => {
      totals.calories += (comp.base_nutrition?.calories || 0) * comp.quantity;
      totals.protein += (comp.base_nutrition?.protein || 0) * comp.quantity;
      // Add other macros logic here
    });

    // Oil Adjustment logic (Heuristic)
    const oilMultipliers = { low: 0.9, medium: 1.0, high: 1.2 };
    const multiplier = oilMultipliers[oilLevel] || 1.0;

    if (sourceType === "restaurant" || sourceType === "street") {
      totals.calories *= 1.1; // Add 10% for outside food
      totals.sodium += 200;
    }

    totals.calories = Math.round(totals.calories * multiplier);
    totals.protein = Math.round(totals.protein);

    return totals;
  }, [selectedComponents, oilLevel, sourceType]);

  // Submit Handler
  const handleSave = async () => {
    setSaving(true);
    try {
      // Construct payload exactly matching Python `Meal` model
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
          nutrition: null, // Or calculate specific component nutrition
        })),
        nutrition: {
          calories_mean: nutritionTotals.calories,
          protein_mean: nutritionTotals.protein,
          // fill rest with 0 or calc
          carbs_mean: 0,
          fat_mean: 0,
          fiber_mean: 0,
          sodium_mean: 0,
          sat_fat_mean: 0,
          sugar_mean: 0,
        },
        confidence_score: 0.85,
      };

      const response = await api.post("/users/meals", payload);

      if (response.data.success) {
        Alert.alert("Success", "Meal logged successfully!", [
          { text: "OK", onPress: () => navigation?.goBack() }, // Or reset state
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
              <View style={styles.statsContainer}>
                <View style={[styles.statBox, { backgroundColor: "#fff7ed" }]}>
                  <Text style={[styles.statLabel, { color: "#ea580c" }]}>
                    Calories
                  </Text>
                  <Text style={styles.statValue}>
                    {nutritionTotals.calories}
                  </Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: "#fef2f2" }]}>
                  <Text style={[styles.statLabel, { color: "#dc2626" }]}>
                    Protein
                  </Text>
                  <Text style={styles.statValue}>
                    {nutritionTotals.protein}g
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
    marginTop:30,
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
  statsContainer: { flexDirection: "row", gap: 12, marginBottom: 30 },
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
