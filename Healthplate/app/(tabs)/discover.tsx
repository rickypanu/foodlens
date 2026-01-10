import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";

export default function DiscoverScreen() {
  const [tab, setTab] = useState("nutrition"); 
  // Removed showProtein state from here. Each card now handles itself.

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.logo}>Healthplate</Text>
      <Text style={styles.tagline}>Made for Indian meals. Built for better health.</Text>

      <Text style={styles.title}>Discover</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Tab label="Plans & Recipes" active={tab === "plans"} onPress={() => setTab("plans")} />
        <Tab label="Nutrition Guide" active={tab === "nutrition"} onPress={() => setTab("nutrition")} />
        <Tab label="Community" active={tab === "community"} onPress={() => setTab("community")} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tab === "plans" && <PlansRecipes />}
        {/* No props needed here anymore */}
        {tab === "nutrition" && <NutritionGuide />}
        {tab === "community" && <Community />}
      </ScrollView>
    </View>
  );
}

/* ---------------- Tabs ---------------- */
function Tab({ label, active, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------------- Plans & Recipes ---------------- */
function PlansRecipes() {
  return (
    <View>
      <View style={styles.aiRow}>
        <Text style={styles.subtitle}>AI-powered weekly planning</Text>
        <TouchableOpacity style={styles.generateBtn}><Text style={styles.generateText}>Generate</Text></TouchableOpacity>
      </View>

      <View style={styles.cardActive}>
        <Text style={styles.cardTitle}>Jan week 1</Text>
        <Text style={styles.cardSub}>Active meal plan</Text>
      </View>

      <Text style={styles.section}>AI Recipes</Text>
      <View style={styles.card}><Text>Paneer Spinach Tomato Curry</Text></View>
      <View style={styles.card}><Text>Dal Tadka with Brown Rice</Text></View>
    </View>
  );
}

/* ---------------- Nutrition Guide (UPDATED) ---------------- */
function NutritionGuide() {
  return (
    <View>
      <Text style={styles.section}>Nutrient Encyclopedia</Text>
      <Text style={styles.muted}>Tap any nutrient to see what it does & sources</Text>

      <ExpandableNutrient
        title="Protein"
        value="0.8–1.6g per kg body weight"
        does="Builds and repairs tissues, muscles, organs. Essential for enzymes."
        matters="Critical for muscle growth, recovery, immunity, and satiety."
        veg="Dal, Paneer, Chickpeas, Tofu, Soy chunks, Milk, Yogurt, Nuts."
        nonVeg="Chicken, Fish, Eggs, Mutton, Prawns."
      />

      <ExpandableNutrient
        title="Carbohydrates"
        value="45–60% daily calories"
        does="The body's primary energy source. Breaks down into glucose."
        matters="Fuels the brain, muscles, and daily physical activities."
        veg="Roti (Wheat), Rice, Oats, Potatoes, Fruits, Quinoa, Millets."
        nonVeg="Minimal (found in small amounts in liver/shellfish)."
      />

      <ExpandableNutrient
        title="Fats"
        value="20–30% daily calories"
        does="Hormone production, nutrient absorption, and cell structure."
        matters="Essential for brain health, skin, and long-term energy storage."
        veg="Ghee, Olive Oil, Almonds, Walnuts, Chia Seeds, Avocado."
        nonVeg="Fatty Fish (Salmon), Egg Yolks."
      />

      <ExpandableNutrient
        title="Fiber"
        value="25–35g per day"
        does="Aids digestion and adds bulk to stool."
        matters="Prevents constipation, controls blood sugar, and improves gut health."
        veg="Vegetables, Whole Grains, Kidney Beans (Rajma), Fruits (Guava)."
        nonVeg="None (Animal products do not contain fiber)."
      />

      <ExpandableNutrient
        title="Iron"
        value="18mg (women), 8mg (men)"
        does="Helps produce hemoglobin to transport oxygen in the blood."
        matters="Prevents anemia, fatigue, and maintains energy levels."
        veg="Spinach, Lentils, Pumpkin Seeds, Jaggery, Dates, Beetroot."
        nonVeg="Red Meat, Liver, Chicken, Fish."
      />

      <ExpandableNutrient
        title="Calcium"
        value="1000mg per day"
        does="Structural component of bones and teeth."
        matters="Crucial for bone density, muscle contraction, and heart rhythm."
        veg="Milk, Curd, Paneer, Ragi, Sesame Seeds, Broccoli."
        nonVeg="Sardines/Small fish (eaten with bones)."
      />

      <ExpandableNutrient
        title="Vitamin D"
        value="15mcg (600 IU) per day"
        does="Helps the body absorb calcium and phosphorus."
        matters="Strengthens bones and boosts immune system function."
        veg="Sunlight (Primary), Mushrooms, Fortified Milk/Cereals."
        nonVeg="Egg Yolks, Fatty Fish (Salmon, Mackerel)."
      />

      <ExpandableNutrient
        title="Vitamin B12"
        value="2.4mcg per day"
        does="Keeps nerve and blood cells healthy; makes DNA."
        matters="Prevents tiredness and weakness (megaloblastic anemia)."
        veg="Fortified Cereals, Nutritional Yeast, Milk, Curd (limited)."
        nonVeg="Clams, Liver, Fish, Meat, Eggs, Poultry."
      />

      <ExpandableNutrient
        title="Vitamin C"
        value="75–90mg per day"
        does="Antioxidant that creates collagen."
        matters="Boosts immunity, speeds up wound healing, and creates healthy skin."
        veg="Amla (Gooseberry), Oranges, Lemons, Capsicum, Tomatoes, Guava."
        nonVeg="Minimal (Liver contains small amounts)."
      />
    </View>
  );
}

// New Reusable Component: Handles its own open/close state
function ExpandableNutrient({ title, value, does, matters, veg, nonVeg }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity 
        style={styles.nutrientCard} 
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={styles.nutrientTitle}>{title}</Text>
        <Text style={styles.muted}>{value}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.expandCard}>
          <Text style={styles.bold}>What it does:</Text>
          <Text style={{marginBottom: 8}}>{does}</Text>

          <Text style={styles.bold}>Why it matters:</Text>
          <Text style={{marginBottom: 8}}>{matters}</Text>

          <Text style={styles.bold}>Vegetarian Sources:</Text>
          <Text style={{marginBottom: nonVeg ? 8 : 0}}>{veg}</Text>

          {nonVeg && (
            <>
              <Text style={styles.bold}>Non‑Veg Sources:</Text>
              <Text>{nonVeg}</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

/* ---------------- Community ---------------- */
function Community() {
  return (
    <View>
      <TouchableOpacity style={styles.shareBtn}>
        <Text style={styles.shareText}>+ Share Your Journey</Text>
      </TouchableOpacity>

      <Post
        name="Ricky Panu"
        date="Dec 26, 2025"
        text="Your body is the only place you have to live. Treat it with respect, nourish it with care."
        likes={4}
      />

      <Post
        name="Abhishek Kumar"
        date="Dec 25, 2025"
        text="If you eat carbs, always pair them with protein or fiber."
        likes={3}
      />

      <View style={styles.createPost}>
        <TextInput placeholder="Title" style={styles.input} />
        <TextInput placeholder="Description" style={[styles.input, { height: 80 }]} multiline />
        <TouchableOpacity style={styles.imageBtn}><Text>Add Image</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function Post({ name, date, text, likes }: any) {
  return (
    <View style={styles.post}>
      <Text style={styles.bold}>{name}</Text>
      <Text style={styles.muted}>{date}</Text>
      <Text style={{ marginVertical: 8 }}>{text}</Text>
      <Text>❤️ {likes}</Text>
    </View>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  logo: { fontSize: 22, fontWeight: "700", color: "#1aa37a" },
  tagline: { color: "#777", marginBottom: 12 },
  title: { fontSize: 26, fontWeight: "700", marginVertical: 12 },

  tabs: { flexDirection: "row", marginBottom: 16 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, borderRadius: 20, backgroundColor: "#eee" },
  tabActive: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd" },
  tabText: { color: "#777" },
  tabTextActive: { color: "#000", fontWeight: "600" },

  section: { fontSize: 18, fontWeight: "700", marginTop: 16 },
  subtitle: { color: "#555" },
  muted: { color: "#777" },
  bold: { fontWeight: "700", marginTop: 8 },

  aiRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  generateBtn: { backgroundColor: "#a855f7", padding: 8, borderRadius: 8 },
  generateText: { color: "#fff" },

  card: { backgroundColor: "#f6f6f6", padding: 12, borderRadius: 12, marginTop: 10 },
  cardActive: { backgroundColor: "#f3e8ff", padding: 16, borderRadius: 16, marginTop: 12 },
  cardTitle: { fontWeight: "700" },
  cardSub: { color: "#777" },

  nutrientCard: { backgroundColor: "#fafafa", padding: 14, borderRadius: 14, marginTop: 12 },
  nutrientTitle: { fontWeight: "600" },
  expandCard: { backgroundColor: "#fdecec", padding: 14, borderRadius: 14, marginTop: 8 },

  shareBtn: { backgroundColor: "#10b981", padding: 14, borderRadius: 14, marginBottom: 16 },
  shareText: { color: "#fff", fontWeight: "600", textAlign: "center" },

  post: { backgroundColor: "#fafafa", padding: 14, borderRadius: 14, marginBottom: 12 },

  createPost: { backgroundColor: "#f6f6f6", padding: 14, borderRadius: 14, marginTop: 16 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 8 },
  imageBtn: { backgroundColor: "#ddd", padding: 10, borderRadius: 10, alignItems: "center" }
});