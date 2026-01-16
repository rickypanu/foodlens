import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function NutritionGuide() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Nutrient Encyclopedia</Text>
      <Text style={styles.subHeader}>
        Simple nutrition guidance for everyday healthy living
      </Text>

      {/* 1. Protein */}
      <ExpandableNutrient
        index={0}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Protein"
        value="0.8–1.6g per kg body weight"
        note="• Sedentary: Aim for 0.8g\n• Active/Muscle Gain: Aim for 1.2–1.6g
• More is not always better; excess protein may stress kidneys if hydration is poor
"
        does="Builds and repairs tissues, muscles, organs. Essential for enzymes and hormones."
        matters="Critical for muscle growth, recovery, immune function, and keeping you full (satiety)."
        veg="Dal (Lentils), Paneer, Chickpeas, Tofu, Soy chunks, Milk, Yogurt, Nuts."
        nonVeg="Chicken, Fish, Eggs, Mutton, Prawns."
      />

      {/* 2. Carbohydrates */}
      <ExpandableNutrient
        index={1}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Carbohydrates"
        value="45–60% of daily calories"
        note="• Focus on complex carbs (whole grains) over sugar.
• Low-carb diets may reduce energy, focus, and workout performance.
"
        does="The body's primary fuel source. Breaks down into glucose for immediate energy."
        matters="Fuels the brain, muscles, and daily physical activities."
        veg="Roti (Wheat), Rice, Oats, Potatoes, Sweet Potatoes, Fruits, Quinoa, Millets (Bajra/Jowar)."
        nonVeg={null} // Minimal in animal sources
      />

      {/* 3. Fats */}
      <ExpandableNutrient
        index={2}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Fats"
        value="20–30% of daily calories"
        note="• Limit saturated fats; avoid trans fats.
• Focus on unsaturated fats; avoid fried and packaged foods.
"
        does="Supports hormone production, nutrient absorption (Vit A, D, E, K), and cell structure."
        matters="Essential for brain health, glowing skin, and long-term energy storage."
        veg="Ghee, Mustard Oil, Olive Oil, Almonds, Walnuts, Chia Seeds, Flaxseeds, Avocado."
        nonVeg="Fatty Fish (Salmon/Rohu), Egg Yolks."
      />

      {/* 4. Fiber */}
      <ExpandableNutrient
        index={3}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
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
        index={4}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Iron"
        value="Men: 8mg | Women: 18mg"
        note="• Pair veg sources with Vitamin C (Lemon) for better absorption.
• Especially important for women due to monthly blood loss.
"
        does="Used to make hemoglobin, which transports oxygen in the blood."
        matters="Prevents anemia, reduces fatigue, and maintains energy levels."
        veg="Spinach (Palak), Lentils, Pumpkin Seeds, Jaggery (Gud), Dates, Beetroot."
        nonVeg="Red Meat, Liver, Chicken, Fish."
      />

      {/* 6. Calcium */}
      <ExpandableNutrient
        index={5}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
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
        index={6}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Vitamin D"
        value="600 IU (15mcg) per day"
        note="• Hard to get from food alone; sunlight is key.
• 15–20 minutes of midday sun exposure is usually sufficient.
"
        does="Helps the body absorb calcium and phosphorus."
        matters="Strengthens bones, boosts immune system, and improves mood."
        veg="Sunlight (Primary Source), Mushrooms, Fortified Milk."
        nonVeg="Egg Yolks, Fatty Fish."
      />

      {/* 8. Vitamin B12 */}
      <ExpandableNutrient
        index={7}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Vitamin B12"
        value="2.4mcg per day"
        note="• Vegetarians may need supplements.
• Vegetarians often require supplements after blood testing.
"
        does="Keeps nerve and blood cells healthy; helps make DNA."
        matters="Prevents megaloblastic anemia (tiredness/weakness) and nerve damage."
        veg="Fortified Cereals, Milk, Curd (small amounts)."
        nonVeg="Clams, Liver, Fish, Meat, Eggs, Poultry."
      />

      {/* 9. Vitamin C */}
      <ExpandableNutrient
        index={8}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Vitamin C"
        value="75–90mg per day"
        note="• Heat destroys Vitamin C; eat raw fruits."
        does="Powerful antioxidant that creates collagen and repairs tissues."
        matters="Boosts immunity, speeds up wound healing, and creates healthy skin."
        veg="Amla (Indian Gooseberry), Guava, Oranges, Lemon, Capsicum, Tomatoes."
        nonVeg={null}
      />
      {/* 10. Potassium */}
      <ExpandableNutrient
        index={9}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Potassium"
        value="3,500–4,700mg per day"
        note="• Helps counter the effects of high sodium (salt) intake."
        does="Regulates fluid balance, muscle contractions, and nerve signals."
        matters="Crucial for maintaining healthy blood pressure and preventing muscle cramps."
        veg="Banana, Coconut Water, Sweet Potato, Spinach, Beans (Rajma), Lentils."
        nonVeg="Fish (Salmon), Chicken Breast."
      />

      {/* 11. Magnesium */}
      <ExpandableNutrient
        index={10}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Magnesium"
        value="Men: 400mg | Women: 310mg"
        note="• Often lacking in processed diets; aids sleep."
        does="Involved in over 300 biochemical reactions, including energy creation and muscle movement."
        matters="Reduces stress, improves sleep quality, and supports heart health."
        veg="Almonds, Cashews, Pumpkin Seeds, Spinach, Whole Grains (Brown Rice)."
        nonVeg="Fatty Fish (Mackerel)."
      />

      {/* 12. Omega-3 Fatty Acids */}
      <ExpandableNutrient
        index={11}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Omega-3 (EPA/DHA)"
        value="250–500mg (combined EPA/DHA)"
        note="• Plant sources (ALA) convert poorly; supplements may be needed for vegetarians.
• Anti-inflammatory fat essential for brain, heart, and eye health.
"
        does="Anti-inflammatory fat essential for cell membranes."
        matters="Vital for brain health, reducing heart disease risk, and eye health."
        veg="Flaxseeds (Alsi), Chia Seeds, Walnuts (ALA source), Algae Oil Supplements."
        nonVeg="Fatty Fish (Salmon, Sardines, Rohu, Hilsa)."
      />

      {/* 13. Zinc */}
      <ExpandableNutrient
        index={12}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Zinc"
        value="Men: 11mg | Women: 8mg"
        note="• Important for men's hormonal health."
        does="Helps immune system fight bacteria; aids in DNA synthesis."
        matters="Speeds up wound healing, supports testosterone levels, and improves sense of taste/smell."
        veg="Chickpeas (Chole), Lentils, Pumpkin Seeds, Cashews, Paneer."
        nonVeg="Red Meat, Oysters, Chicken, Eggs."
      />

      {/* 14. Folate (Vitamin B9) */}
      <ExpandableNutrient
        index={13}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Folate (Vitamin B9)"
        value="400mcg per day"
        note="• Crucial during pregnancy to prevent birth defects."
        does="Helps form DNA and RNA; involved in protein metabolism."
        matters="Essential for red blood cell formation and healthy cell growth."
        veg="Spinach, Broccoli, Peas (Matar), Kidney Beans (Rajma), Peanuts."
        nonVeg="Liver, Eggs."
      />

      {/* 15. Sodium */}
      <ExpandableNutrient
        index={14}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Sodium"
        value="Less than 2,300mg (1 tsp salt)"
        note="• Most processed foods are high in hidden sodium.
• Athletes and people who sweat heavily may need slightly more sodium.
"
        does="Maintains fluid balance and supports nerve/muscle function."
        matters="Too much causes high blood pressure; too little causes cramping/weakness."
        veg="Table Salt, Pickles (Achar), Papad, Sea Salt."
        nonVeg="Processed Meats, Salted Fish."
      />

      {/* 16. Vitamin A */}
      <ExpandableNutrient
        index={15}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Vitamin A"
        value="Men: 900mcg | Women: 700mcg"
        note="• Fat-soluble; eat with some oil/ghee for absorption."
        does="Maintains vision, immune system, and reproduction."
        matters="Prevents night blindness and keeps skin/lining of organs healthy."
        veg="Carrots, Sweet Potatoes, Pumpkin, Spinach, Papaya, Mango."
        nonVeg="Liver, Fish Oil, Eggs, Milk."
      />

      {/* 17. Vitamin E */}
      <ExpandableNutrient
        index={16}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Vitamin E"
        value="15mg per day"
        note="• A powerful antioxidant often used in skincare."
        does="Protects cells from damage and boosts immune function."
        matters="Key for glowing skin, healthy hair, and preventing oxidative stress."
        veg="Almonds (Badam), Sunflower Seeds, Spinach, Peanuts, Avocado."
        nonVeg="Eggs (Yolk), Salmon."
      />

      {/* 18. Vitamin K */}
      <ExpandableNutrient
        index={17}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Vitamin K"
        value="Men: 120mcg | Women: 90mcg"
        note="• Be careful with Vitamin K if you are on blood thinners."
        does="Essential for blood clotting and regulating blood calcium levels."
        matters="Prevents excessive bleeding and is crucial for bone density."
        veg="Green Leafy Veg (Sarson ka Saag, Palak), Broccoli, Cauliflower, Cabbage."
        nonVeg="Liver, Chicken, Egg Yolks."
      />

      {/* 19. Iodine */}
      <ExpandableNutrient
        index={18}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Iodine"
        value="150mcg per day"
        note="• Most table salt in India is iodized to prevent deficiency."
        does="The building block for thyroid hormones."
        matters="Controls metabolism, growth, and development (especially in children)."
        veg="Iodized Salt, Dairy (Milk/Curd), Prunes."
        nonVeg="Saltwater Fish, Shrimp, Eggs."
      />

      {/* 20. Selenium */}
      <ExpandableNutrient
        index={19}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Selenium"
        value="55mcg per day"
        note="• You only need a small amount; excess can be harmful."
        does="Works with iodine to protect the thyroid gland."
        matters="Boosts immunity, fertility, and prevents cell damage."
        veg="Brown Rice, Lentils, Cashews, Mushrooms, Whole Wheat Bread."
        nonVeg="Chicken, Eggs, Fish (Tuna/Sardines)."
      />

      {/* 21. Vitamin B6 (Pyridoxine) */}
      <ExpandableNutrient
        index={20}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Vitamin B6"
        value="1.3mg per day"
        note="• Helps the body produce serotonin (the 'happy' hormone)."
        does="Metabolizes protein/carbs and creates neurotransmitters."
        matters="Improves mood, brain function, and reduces morning sickness in pregnancy."
        veg="Chickpeas (Chole), Bananas, Potatoes, Oats, Soya."
        nonVeg="Fish, Chicken Liver, Meat."
      />

      {/* 22. Probiotics (Gut Health) */}
      <ExpandableNutrient
        index={21}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Probiotics"
        value="1–2 servings per day"
        note="• Look for 'live active cultures' on labels."
        does="Introduces healthy bacteria to your digestive system."
        matters="Improves digestion, immunity, and even mental health (gut-brain axis)."
        veg="Curd (Dahi), Idli/Dosa Batter (Fermented), Kanji, Pickles (homemade)."
        nonVeg={null} // Primarily found in fermented dairy/veg
      />

      {/* 23. Phosphorus */}
      <ExpandableNutrient
        index={22}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        title="Phosphorus"
        value="700mg per day"
        note="• Usually abundant in diets that are high in protein."
        does="Works closely with Calcium to build strong bones and teeth."
        matters="Filters waste in kidneys and manages how the body stores energy."
        veg="Soybeans, Lentils, Pumpkin Seeds, Paneer, Quinoa."
        nonVeg="Chicken, Fish, Eggs."
      />

      <Text style={styles.disclaimer}>
        This guide is for educational purposes only. Consult a doctor or
        dietitian for medical advice.
      </Text>
    </ScrollView>
  );
}

// --- Helper Component ---
function ExpandableNutrient({
  index,
  openIndex,
  setOpenIndex,
  title,
  value,
  note,
  does,
  matters,
  veg,
  nonVeg,
}) {
  const isOpen = openIndex === index;
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.nutrientHeader}
        onPress={() => setOpenIndex(isOpen ? null : index)}
        activeOpacity={0.7}
      >
        <View>
          <Text style={styles.nutrientTitle}>{title}</Text>
          <Text style={styles.nutrientValue}>{value}</Text>
        </View>
        <Text style={styles.arrow}>{isOpen ? "Hide ▲" : "Show ▼"}</Text>
      </TouchableOpacity>

      {isOpen && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setOpenIndex(null)}
          style={styles.expandContent}
        >
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
                {veg.split(",").map((item, index) => (
                  <Text key={index} style={styles.foodTag}>
                    {item.trim()}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Non-Veg Sources */}
          {nonVeg && (
            <View style={styles.sourceRow}>
              <Text style={styles.sourceLabel}>🍖 Non-Veg Sources:</Text>
              <View style={styles.tagContainer}>
                {nonVeg.split(",").map((item, index) => (
                  <Text key={index} style={styles.foodTag}>
                    {item.trim()}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#fff" },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subHeader: { fontSize: 14, color: "#666", marginBottom: 20 },

  cardContainer: {
    width: "100%",
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fffefe",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  nutrientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fafafa",
  },
  nutrientTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  nutrientValue: {
    fontSize: 13,
    color: "#2d6a4f",
    fontWeight: "600",
    marginTop: 2,
  },
  arrow: { fontSize: 14, color: "#999" },

  expandContent: { padding: 16, backgroundColor: "#fff5f5" }, // Light red background like image

  noteBox: {
    backgroundColor: "rgba(230, 57, 70, 0.1)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 12,
    color: "#d62828",
    lineHeight: 18,
    fontWeight: "600",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginTop: 10,
    marginBottom: 4,
  },
  bodyText: { fontSize: 14, color: "#444", lineHeight: 20, marginBottom: 4 },

  sourceRow: { marginTop: 12 },
  sourceLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2d6a4f",
    marginBottom: 6,
  },

  tagContainer: { flexDirection: "row", flexWrap: "wrap" },
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
    borderColor: "#eee",
  },
  disclaimer: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginVertical: 24,
  },
});
