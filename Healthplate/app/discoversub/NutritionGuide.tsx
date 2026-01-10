import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function NutritionGuide() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Nutrient Encyclopedia</Text>
      <Text style={styles.subHeader}>Learn what each nutrient does and where to find it</Text>

      {/* 1. Protein */}
      <ExpandableNutrient
        title="Protein"
        value="0.8–1.6g per kg body weight"
        note="• Sedentary: Aim for 0.8g\n• Active/Muscle Gain: Aim for 1.2–1.6g"
        does="Builds and repairs tissues, muscles, organs. Essential for enzymes and hormones."
        matters="Critical for muscle growth, recovery, immune function, and keeping you full (satiety)."
        veg="Dal (Lentils), Paneer, Chickpeas, Tofu, Soy chunks, Milk, Yogurt, Nuts."
        nonVeg="Chicken, Fish, Eggs, Mutton, Prawns."
      />

      {/* 2. Carbohydrates */}
      <ExpandableNutrient
        title="Carbohydrates"
        value="45–60% of daily calories"
        note="• Focus on complex carbs (whole grains) over sugar."
        does="The body's primary fuel source. Breaks down into glucose for immediate energy."
        matters="Fuels the brain, muscles, and daily physical activities."
        veg="Roti (Wheat), Rice, Oats, Potatoes, Sweet Potatoes, Fruits, Quinoa, Millets (Bajra/Jowar)."
        nonVeg={null} // Minimal in animal sources
      />

      {/* 3. Fats */}
      <ExpandableNutrient
        title="Fats"
        value="20–30% of daily calories"
        note="• Limit saturated fats; avoid trans fats."
        does="Supports hormone production, nutrient absorption (Vit A, D, E, K), and cell structure."
        matters="Essential for brain health, glowing skin, and long-term energy storage."
        veg="Ghee, Mustard Oil, Olive Oil, Almonds, Walnuts, Chia Seeds, Flaxseeds, Avocado."
        nonVeg="Fatty Fish (Salmon/Rohu), Egg Yolks."
      />

      {/* 4. Fiber */}
      <ExpandableNutrient
        title="Fiber"
        value="25–35g per day"
        note="• Drink plenty of water when increasing fiber."
        does="Aids digestion, adds bulk to stool, and feeds healthy gut bacteria."
        matters="Prevents constipation, stabilizes blood sugar levels, and lowers cholesterol."
        veg="Green Leafy Veg, Whole Grains, Kidney Beans (Rajma), Guava, Apples, Oats."
        nonVeg={null} // No fiber in meat
      />

      {/* 5. Iron */}
      <ExpandableNutrient
        title="Iron"
        value="Men: 8mg | Women: 18mg"
        note="• Pair veg sources with Vitamin C (Lemon) for better absorption."
        does="Used to make hemoglobin, which transports oxygen in the blood."
        matters="Prevents anemia, reduces fatigue, and maintains energy levels."
        veg="Spinach (Palak), Lentils, Pumpkin Seeds, Jaggery (Gud), Dates, Beetroot."
        nonVeg="Red Meat, Liver, Chicken, Fish."
      />

      {/* 6. Calcium */}
      <ExpandableNutrient
        title="Calcium"
        value="1000mg per day"
        note="• Essential for all ages, especially seniors."
        does="Structural component of bones and teeth; aids muscle contraction."
        matters="Prevents osteoporosis (brittle bones) and ensures proper heart rhythm."
        veg="Milk, Curd, Paneer, Ragi (Finger Millet), Sesame Seeds (Til), Broccoli."
        nonVeg="Small fish eaten with bones (like Sardines)."
      />

      {/* 7. Vitamin D */}
      <ExpandableNutrient
        title="Vitamin D"
        value="600 IU (15mcg) per day"
        note="• Hard to get from food alone; sunlight is key."
        does="Helps the body absorb calcium and phosphorus."
        matters="Strengthens bones, boosts immune system, and improves mood."
        veg="Sunlight (Primary Source), Mushrooms, Fortified Milk."
        nonVeg="Egg Yolks, Fatty Fish."
      />

      {/* 8. Vitamin B12 */}
      <ExpandableNutrient
        title="Vitamin B12"
        value="2.4mcg per day"
        note="• Vegetarians may need supplements."
        does="Keeps nerve and blood cells healthy; helps make DNA."
        matters="Prevents megaloblastic anemia (tiredness/weakness) and nerve damage."
        veg="Fortified Cereals, Milk, Curd (small amounts)."
        nonVeg="Clams, Liver, Fish, Meat, Eggs, Poultry."
      />

      {/* 9. Vitamin C */}
      <ExpandableNutrient
        title="Vitamin C"
        value="75–90mg per day"
        note="• Heat destroys Vitamin C; eat raw fruits."
        does="Powerful antioxidant that creates collagen and repairs tissues."
        matters="Boosts immunity, speeds up wound healing, and creates healthy skin."
        veg="Amla (Indian Gooseberry), Guava, Oranges, Lemon, Capsicum, Tomatoes."
        nonVeg={null}
      />
    </ScrollView>
  );
}

// --- Helper Component ---
function ExpandableNutrient({ title, value, note, does, matters, veg, nonVeg }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity 
        style={styles.nutrientHeader} 
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View>
          <Text style={styles.nutrientTitle}>{title}</Text>
          <Text style={styles.nutrientValue}>{value}</Text>
        </View>
        <Text style={styles.arrow}>{isOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.expandContent}>
          {/* Note Section (Range Clarification) */}
          {note && (
             <View style={styles.noteBox}>
               <Text style={styles.noteText}>{note}</Text>
             </View>
          )}

          <Text style={styles.label}>What it does:</Text>
          <Text style={styles.bodyText}>{does}</Text>
          
          <Text style={styles.label}>Why it matters:</Text>
          <Text style={styles.bodyText}>{matters}</Text>
          
          {/* Veg Sources */}
          {veg && (
            <View style={styles.sourceRow}>
              <Text style={styles.sourceLabel}>🌱 Vegetarian Sources:</Text>
              <View style={styles.tagContainer}>
                 {veg.split(',').map((item, index) => (
                    <Text key={index} style={styles.foodTag}>{item.trim()}</Text>
                 ))}
              </View>
            </View>
          )}

          {/* Non-Veg Sources */}
          {nonVeg && (
            <View style={styles.sourceRow}>
              <Text style={styles.sourceLabel}>🍖 Non-Veg Sources:</Text>
              <View style={styles.tagContainer}>
                 {nonVeg.split(',').map((item, index) => (
                    <Text key={index} style={styles.foodTag}>{item.trim()}</Text>
                 ))}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "800", color: "#1a1a1a", marginBottom: 4 },
  subHeader: { fontSize: 14, color: "#666", marginBottom: 20 },
  
  cardContainer: { marginBottom: 12, borderRadius: 16, overflow: 'hidden', backgroundColor: "#fff", elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width: 0, height: 2} },
  
  nutrientHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: "#fafafa" },
  nutrientTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  nutrientValue: { fontSize: 13, color: "#e63946", fontWeight: "600", marginTop: 2 },
  arrow: { fontSize: 14, color: "#999" },

  expandContent: { padding: 16, backgroundColor: "#fff5f5" }, // Light red background like image
  
  noteBox: { backgroundColor: "rgba(230, 57, 70, 0.1)", padding: 10, borderRadius: 8, marginBottom: 12 },
  noteText: { fontSize: 12, color: "#d62828", lineHeight: 18, fontWeight: "600" },

  label: { fontSize: 14, fontWeight: "700", color: "#333", marginTop: 10, marginBottom: 4 },
  bodyText: { fontSize: 14, color: "#444", lineHeight: 20, marginBottom: 4 },
  
  sourceRow: { marginTop: 12 },
  sourceLabel: { fontSize: 14, fontWeight: "700", color: "#2d6a4f", marginBottom: 6 },
  
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  foodTag: { 
    fontSize: 12, 
    backgroundColor: "#fff", 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6, 
    marginRight: 6, 
    marginBottom: 6, 
    color: "#444",
    borderWidth: 1,
    borderColor: "#eee"
  }
});