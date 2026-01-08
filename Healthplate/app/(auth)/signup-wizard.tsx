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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/services/api";

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
  food_preferences: string[]; // keeping simple for UI
  allergies: string;
  disliked_food: string;
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
    allergies: "",
    disliked_food: "",
    cuisines: [],
    health_concerns: [],
  });

  // Helper to update state
  const update = (key: keyof SignupFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Helper for Multi-Select Toggle
  const toggleSelection = (
    key: "health_concerns" | "cuisines",
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

  // --- Actions ---
  const handleNext = () => {
    if (step === 1 && form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (step < 7) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare payload (convert strings to numbers)
      const payload = {
        ...form,
        age: parseInt(form.age) || 0,
        height: parseFloat(form.height) || 0,
        weight: parseFloat(form.weight) || 0,
        // Convert comma-separated strings to arrays if needed, or keep as arrays
        allergies: form.allergies ? form.allergies.split(",") : [],
        disliked_food: form.disliked_food ? form.disliked_food.split(",") : [],
      };

      // API Call
      const res = await api.post("/users/signup", payload);

      // Success: Move to Goal Summary
      // We pass the calculated metrics as a string param
      router.push({
        pathname: "/(auth)/goal-summary",
        params: {
          goals: JSON.stringify(res.data.user.metrics),
          // ADD THESE TWO LINES:
          token: res.data.token,
          user: JSON.stringify(res.data.user),
        },
      });
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        "Signup Failed",
        error.response?.data?.detail || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Render Functions ---

  const renderOptionBtn = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
    >
      <Text
        style={[styles.optionText, isSelected && styles.optionTextSelected]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Step {step} of 7</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* STEP 1: Credentials */}
        {step === 1 && (
          <View>
            <Text style={styles.title}>Create Account</Text>
            <TextInput
              placeholder="Email Address"
              style={styles.input}
              autoCapitalize="none"
              value={form.email}
              onChangeText={(t) => update("email", t)}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={form.password}
              onChangeText={(t) => update("password", t)}
            />
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(t) => update("confirmPassword", t)}
            />
          </View>
        )}

        {/* STEP 2: Name */}
        {step === 2 && (
          <View>
            <Text style={styles.title}>What should we call you?</Text>
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              value={form.name}
              onChangeText={(t) => update("name", t)}
            />
          </View>
        )}

        {/* STEP 3: Body Stats */}
        {step === 3 && (
          <View>
            <Text style={styles.title}>Body Stats</Text>
            <Text style={styles.subtitle}>
              Used to calculate your metabolic rate.
            </Text>

            <Text style={styles.label}>Age</Text>
            <TextInput
              placeholder="e.g. 25"
              keyboardType="numeric"
              style={styles.input}
              value={form.age}
              onChangeText={(t) => update("age", t)}
            />

            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              placeholder="e.g. 175"
              keyboardType="numeric"
              style={styles.input}
              value={form.height}
              onChangeText={(t) => update("height", t)}
            />

            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              placeholder="e.g. 70"
              keyboardType="numeric"
              style={styles.input}
              value={form.weight}
              onChangeText={(t) => update("weight", t)}
            />
          </View>
        )}

        {/* STEP 4: Activity & Goals */}
        {step === 4 && (
          <View>
            <Text style={styles.title}>Activity & Goal</Text>

            <Text style={styles.sectionHeader}>Activity Level</Text>
            {["Sedentary", "Light", "Moderate", "High"].map((opt) =>
              renderOptionBtn(opt, form.activity_level === opt, () =>
                update("activity_level", opt)
              )
            )}

            <Text style={styles.sectionHeader}>Fitness Goal</Text>
            {[
              { label: "Maintain Weight", val: "maintain" },
              { label: "Fat Loss", val: "fat_loss" },
              { label: "Muscle Gain", val: "muscle_gain" },
              { label: "Improve Energy", val: "energy" },
            ].map((opt) =>
              renderOptionBtn(opt.label, form.goal === opt.val, () =>
                update("goal", opt.val)
              )
            )}
          </View>
        )}

        {/* STEP 5: Dietary Type */}
        {step === 5 && (
          <View>
            <Text style={styles.title}>Dietary Preference</Text>
            {["Vegetarian", "Egg", "Vegan", "Non-Veg"].map((opt) =>
              renderOptionBtn(opt, form.dietary_type === opt, () =>
                update("dietary_type", opt)
              )
            )}
          </View>
        )}

        {/* STEP 6: Food Preferences */}
        {step === 6 && (
          <View>
            <Text style={styles.title}>Food Details</Text>

            <Text style={styles.label}>Allergies (Optional)</Text>
            <TextInput
              placeholder="e.g. Peanuts, Gluten"
              style={styles.input}
              value={form.allergies}
              onChangeText={(t) => update("allergies", t)}
            />

            <Text style={styles.label}>Foods you dislike (Optional)</Text>
            <TextInput
              placeholder="e.g. Broccoli, Fish"
              style={styles.input}
              value={form.disliked_food}
              onChangeText={(t) => update("disliked_food", t)}
            />

            <Text style={styles.sectionHeader}>Preferred Cuisines</Text>
            <View style={styles.wrapContainer}>
              {["Indian", "Italian", "Mexican", "Chinese", "Continental"].map(
                (c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.chip,
                      form.cuisines.includes(c) && styles.chipSelected,
                    ]}
                    onPress={() => toggleSelection("cuisines", c)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        form.cuisines.includes(c) && styles.chipTextSelected,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        )}

        {/* STEP 7: Health & Terms */}
        {step === 7 && (
          <View>
            <Text style={styles.title}>Health Concerns</Text>
            <Text style={styles.subtitle}>
              Select any that apply (Optional)
            </Text>

            {[
              "Diabetes",
              "Hypertension (BP)",
              "PCOS/PCOD",
              "High Cholesterol",
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
                  color="#4CAF50"
                />
                <Text style={styles.checkboxText}>{h}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.divider} />

            <Text style={styles.disclaimerHeader}>Terms & Disclaimer</Text>
            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>
                Healthplate provides nutrition tracking and insights for
                informational purposes only. This is not medical advice. Please
                consult with a healthcare professional or registered dietitian
                for personalized medical or dietary guidance. We are not
                responsible for any health decisions made based on this app.
              </Text>
            </View>
            <Text style={styles.agreeText}>
              By clicking Finish, you agree to these terms.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {step === 7 ? (
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Finish & Save</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Next Step</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
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
  content: { padding: 20, paddingBottom: 100 },

  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, color: "#333" },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 20 },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 10,
    color: "#333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },

  // Option Buttons (Step 4 & 5)
  optionBtn: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  optionBtnSelected: { borderColor: "#4CAF50", backgroundColor: "#e8f5e9" },
  optionText: { fontSize: 16, color: "#333" },
  optionTextSelected: { color: "#2E7D32", fontWeight: "bold" },

  // Chips (Step 6)
  wrapContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: "#4CAF50" },
  chipText: { color: "#333" },
  chipTextSelected: { color: "#fff" },

  // Checkboxes (Step 7)
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  checkboxSelected: { backgroundColor: "#f9f9f9", borderRadius: 8 },
  checkboxText: { fontSize: 16 },

  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  disclaimerHeader: { fontWeight: "bold", marginBottom: 8 },
  disclaimerBox: {
    backgroundColor: "#fff3cd",
    padding: 10,
    borderRadius: 8,
    borderColor: "#ffeeba",
    borderWidth: 1,
  },
  disclaimerText: { fontSize: 12, color: "#856404", lineHeight: 18 },
  agreeText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },

  // Footer Buttons
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  nextBtn: {
    backgroundColor: "#333",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 50,
    gap: 10,
  },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  submitBtn: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  submitBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
