import React, { useState } from "react";
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
  KeyboardTypeOptions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/services/api";

// --- Constants for Selections ---
const ALLERGY_OPTIONS = [
  "Gluten",
  "Peanuts",
  "Lactose/Dairy",
  "Tree Nuts",
  "Soy",
  "Shellfish",
  "Eggs",
  "None",
];
const DISLIKE_OPTIONS = [
  "Bitter Gourd (Karela)",
  "Bottle Gourd (Lauki)",
  "Eggplant (Brinjal)",
  "Mushrooms",
  "Broccoli",
  "Tofu",
  "Seafood",
  "None",
];
const CUISINE_OPTIONS = [
  "North Indian",
  "South Indian",
  "Punjabi",
  "Gujrati",
  "Bengali",
  "Chinese",
  "Continental",
];

// --- TypeScript Interfaces ---
interface SignupFormData {
  email: "";
  password: "";
  confirmPassword: "";
  name: "";
  age: string;
  height: string;
  weight: string;
  activity_level: string;
  goal: string;
  dietary_type: string;
  food_preferences: string[];
  allergies: string[];
  disliked_food: string[];
  cuisines: string[];
  health_concerns: string[];
}

export default function SignupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // --- Form State ---
  const [form, setForm] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    age: "",
    height: "",
    weight: "",
    activity_level: "",
    goal: "",
    dietary_type: "",
    food_preferences: [],
    allergies: [],
    disliked_food: [],
    cuisines: [],
    health_concerns: [],
  });

  // --- Validation Logic ---
  const isStepValid = () => {
    switch (step) {
      case 1: // Credentials
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
          emailRegex.test(form.email) &&
          form.password.length >= 6 &&
          form.password === form.confirmPassword
        );
      case 2: // Name
        return form.name.trim().length > 0;
      case 3: // Stats
        return (
          form.age.trim().length > 0 &&
          form.height.trim().length > 0 &&
          form.weight.trim().length > 0
        );
      case 4: // Activity & Goal
        return form.activity_level !== "" && form.goal !== "";
      case 5: // Diet
        return form.dietary_type !== "";
      case 6: // Preferences (Optional)
        return true;
      case 7: // Health (Optional)
        return true;
      default:
        return false;
    }
  };

  // Helper for Text Inputs
  const update = (key: keyof SignupFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Helper for Arrays (Multi-select)
  const toggleSelection = (
    key: "health_concerns" | "cuisines" | "allergies" | "disliked_food",
    value: string
  ) => {
    setForm((prev) => {
      const list = prev[key] as string[];
      if (list.includes(value)) {
        return { ...prev, [key]: list.filter((item) => item !== value) };
      } else {
        return { ...prev, [key]: [...list, value] };
      }
    });
  };

  const handleNext = () => {
    if (!isStepValid()) return; // Double check
    if (step < 7) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;

    setLoading(true);
    try {
      const payload = {
        email: form.email,
        password: form.password,
        name: form.name,
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
        activity_level: form.activity_level,
        goal: form.goal,
        dietary_type: form.dietary_type,
        cuisines: form.cuisines,
        health_concerns: form.health_concerns,
        allergies: form.allergies,
        disliked_food: form.disliked_food,
      };

      const res = await api.post("/users/signup", payload);
      const userData = res.data?.user || {};
      const metrics = userData?.metrics || {};
      const token = res.data?.token || "";

      if (!res.data) {
        Alert.alert("Error", "Server returned an empty response.");
        return;
      }

      router.replace({
        pathname: "/goal-summary",
        params: {
          goals: JSON.stringify(metrics),
          token: token,
          user: JSON.stringify(userData),
        },
      });
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error.response?.data?.detail?.[0]?.msg ||
          error.response?.data?.detail ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // --- UI Helper Components ---
  const renderInputWithIcon = (
    label: string,
    value: string,
    key: keyof SignupFormData,
    icon: keyof typeof Ionicons.glyphMap,
    placeholder: string,
    keyboardType: KeyboardTypeOptions = "default",
    secureTextEntry = false
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons
          name={icon}
          size={20}
          color="#9CA3AF"
          style={styles.inputIcon}
        />
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          value={value}
          onChangeText={(t) => update(key, t)}
          autoCapitalize="none"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );

  const renderSelectionCard = (
    label: string,
    value: string,
    currentValue: string,
    updateKey: keyof SignupFormData,
    iconName: keyof typeof Ionicons.glyphMap,
    description?: string
  ) => {
    const isSelected = currentValue === value;
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => update(updateKey, value)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
          <Ionicons
            name={iconName}
            size={24}
            color={isSelected ? "#fff" : "#666"}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}
          >
            {label}
          </Text>
          {description && (
            <Text
              style={[styles.cardDesc, isSelected && styles.cardDescSelected]}
            >
              {description}
            </Text>
          )}
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        )}
      </TouchableOpacity>
    );
  };

  const renderChipSection = (
    title: string,
    options: string[],
    selectedList: string[],
    stateKey: "allergies" | "disliked_food" | "cuisines"
  ) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.sectionHeader}>{title}</Text>
      <View style={styles.wrapContainer}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.chip,
              selectedList.includes(opt) && styles.chipSelected,
            ]}
            onPress={() => toggleSelection(stateKey, opt)}
          >
            <Text
              style={[
                styles.chipText,
                selectedList.includes(opt) && styles.chipTextSelected,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const canProceed = isStepValid();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Step {step} of 7</Text>
        
        {/* Login Link */}
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginLink}>Log In</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* STEP 1: Credentials */}
          {step === 1 && (
            <View>
              <Text style={styles.title}>Create Account</Text>
              {renderInputWithIcon(
                "Email",
                form.email,
                "email",
                "mail-outline",
                "Enter your email",
                "email-address"
              )}
              {renderInputWithIcon(
                "Password",
                form.password,
                "password",
                "lock-closed-outline",
                "Min 6 characters",
                "default",
                true
              )}
              {renderInputWithIcon(
                "Confirm Password",
                form.confirmPassword,
                "confirmPassword",
                "lock-closed-outline",
                "Re-enter password",
                "default",
                true
              )}
            </View>
          )}

          {/* STEP 2: Name */}
          {step === 2 && (
            <View>
              <Text style={styles.title}>What's your name?</Text>
              <Text style={styles.subtitle}>
                Let's personalize your experience
              </Text>
              {renderInputWithIcon(
                "Full Name",
                form.name,
                "name",
                "person-outline",
                "Enter your name"
              )}
            </View>
          )}

          {/* STEP 3: Body Stats */}
          {step === 3 && (
            <View>
              <Text style={styles.title}>Body Stats</Text>
              <Text style={styles.subtitle}>
                We'll use these to calculate your goals
              </Text>
              {renderInputWithIcon(
                "Age",
                form.age,
                "age",
                "calendar-outline",
                "e.g. 25",
                "numeric"
              )}
              {renderInputWithIcon(
                "Height (cm)",
                form.height,
                "height",
                "resize-outline",
                "e.g. 175",
                "numeric"
              )}
              {renderInputWithIcon(
                "Weight (kg)",
                form.weight,
                "weight",
                "scale-outline",
                "e.g. 70",
                "numeric"
              )}
            </View>
          )}

          {/* STEP 4: Activity & Goals */}
          {step === 4 && (
            <View>
              <Text style={styles.title}>Activity & Goal</Text>
              <Text style={styles.subtitle}>
                Help us understand your lifestyle
              </Text>
              <Text style={styles.sectionHeader}>Activity Level</Text>

              {renderSelectionCard(
                "Sedentary",
                "Sedentary",
                form.activity_level,
                "activity_level",
                "desktop-outline",
                "Desk job, little exercise"
              )}
              {renderSelectionCard(
                "Lightly Active",
                "Light",
                form.activity_level,
                "activity_level",
                "walk-outline",
                "1-2 days/week exercise"
              )}
              {renderSelectionCard(
                "Moderately Active",
                "Moderate",
                form.activity_level,
                "activity_level",
                "bicycle-outline",
                "3-4 days/week exercise"
              )}
              {renderSelectionCard(
                "Highly Active",
                "High",
                form.activity_level,
                "activity_level",
                "barbell-outline",
                "Daily intense activity"
              )}

              <Text style={styles.sectionHeader}>Fitness Goal</Text>
              {renderSelectionCard(
                "Maintain Weight",
                "maintain",
                form.goal,
                "goal",
                "medkit-outline"
              )}
              {renderSelectionCard(
                "Fat Loss",
                "fat_loss",
                form.goal,
                "goal",
                "trending-down-outline"
              )}
              {renderSelectionCard(
                "Muscle Gain",
                "muscle_gain",
                form.goal,
                "goal",
                "fitness-outline"
              )}
              {renderSelectionCard(
                "Improve Energy",
                "energy",
                form.goal,
                "goal",
                "flash-outline"
              )}
            </View>
          )}

          {/* STEP 5: Dietary Type */}
          {step === 5 && (
            <View>
              <Text style={styles.title}>Dietary Preference</Text>
              <Text style={styles.subtitle}>What do you eat?</Text>
              {renderSelectionCard(
                "Vegetarian",
                "Vegetarian",
                form.dietary_type,
                "dietary_type",
                "leaf-outline"
              )}
              {renderSelectionCard(
                "Eggetarian",
                "Egg",
                form.dietary_type,
                "dietary_type",
                "egg-outline"
              )}
              {renderSelectionCard(
                "Non-Vegetarian",
                "Non-Veg",
                form.dietary_type,
                "dietary_type",
                "restaurant-outline"
              )}
              {renderSelectionCard(
                "Vegan",
                "Vegan",
                form.dietary_type,
                "dietary_type",
                "nutrition-outline"
              )}
            </View>
          )}

          {/* STEP 6: Food Preferences */}
          {step === 6 && (
            <View>
              <Text style={styles.title}>Food Preference</Text>
              <Text style={styles.subtitle}>
                Help us personalize your experience
              </Text>

              {/* 1. Allergies */}
              {renderChipSection(
                "Food Allergies (Optional)",
                ALLERGY_OPTIONS,
                form.allergies,
                "allergies"
              )}

              {/* 2. Dislikes */}
              {renderChipSection(
                "Foods You Dislike (Optional)",
                DISLIKE_OPTIONS,
                form.disliked_food,
                "disliked_food"
              )}

              {/* 3. Cuisines */}
              {renderChipSection(
                "Preferred Cuisines (Optional)",
                CUISINE_OPTIONS,
                form.cuisines,
                "cuisines"
              )}
            </View>
          )}

          {/* STEP 7: Health & Terms */}
          {step === 7 && (
            <View>
              <Text style={styles.title}>Health Concerns</Text>
              <Text style={styles.subtitle}>Almost Done!</Text>
              <Text style={styles.subtitle}>
                Select any that apply (Optional)
              </Text>

              {[
                "Diabetes",
                "Hypertension (BP)",
                "PCOS/PCOD",
                "High Cholesterol",
                "Thyroid Issues",
                "Kidney Issue",
                "None",
              ].map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[
                    styles.checkboxRow,
                    form.health_concerns.includes(h) && styles.checkboxSelected,
                  ]}
                  onPress={() => toggleSelection("health_concerns", h)}
                >
                  <Ionicons
                    name={
                      form.health_concerns.includes(h)
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={24}
                    color={
                      form.health_concerns.includes(h) ? "#4CAF50" : "#ccc"
                    }
                  />
                  <Text
                    style={[
                      styles.checkboxText,
                      form.health_concerns.includes(h) && {
                        fontWeight: "600",
                        color: "#333",
                      },
                    ]}
                  >
                    {h}
                  </Text>
                </TouchableOpacity>
              ))}

              <View style={styles.divider} />
              <Text style={styles.disclaimerHeader}>Terms & Disclaimer</Text>
              <View style={styles.disclaimerBox}>
                <Text style={styles.disclaimerText}>
                  Healthplate provides nutrition tracking and insights for
                  informational purposes only. Not medical advice.
                </Text>
              </View>
              <Text style={styles.agreeText}>
                By clicking Finish, you agree to these terms.
              </Text>
            </View>
          )}

          {/* Footer Navigation */}
          <View style={styles.footerContainer}>
            {step === 7 ? (
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  !canProceed && styles.disabledBtn, // Apply disabled style
                ]}
                onPress={handleSubmit}
                disabled={loading || !canProceed} // Disable interaction
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Finish & Save</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.nextBtn,
                  !canProceed && styles.disabledBtn, // Apply disabled style
                ]}
                onPress={handleNext}
                disabled={!canProceed} // Disable interaction
              >
                <Text style={styles.nextBtnText}>Next Step</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#666" },
  loginLink: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981", // Brand Green
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1F2937",
  },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 20 },

  // Input Styles
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#374151" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#1F2937", height: "100%" },

  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 12,
    color: "#111827",
  },

  // Card Selection Styles
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  cardSelected: {
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconBoxSelected: {
    backgroundColor: "#10B981",
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  cardTitleSelected: { color: "#065F46" },
  cardDesc: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  cardDescSelected: { color: "#047857" },

  // Chips
  wrapContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: "#10B981" },
  chipText: { color: "#4B5563", fontWeight: "500" },
  chipTextSelected: { color: "#fff" },

  // Checkboxes
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  checkboxSelected: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  checkboxText: { fontSize: 16, color: "#4B5563" },

  // Legal/Terms
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 24 },
  disclaimerHeader: { fontWeight: "bold", marginBottom: 8, color: "#374151" },
  disclaimerBox: {
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  disclaimerText: { fontSize: 12, color: "#92400E", lineHeight: 18 },
  agreeText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
  },

  // Footer
  footerContainer: {
    marginTop: 30, // Spacing between last input and button
    marginBottom: 20, // Spacing at the very bottom
  },
  nextBtn: {
    backgroundColor: "#111827",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  submitBtn: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  disabledBtn: {
    backgroundColor: "#D1D5DB", // Gray color
    shadowOpacity: 0, // Remove shadow
    elevation: 0,
  },
});