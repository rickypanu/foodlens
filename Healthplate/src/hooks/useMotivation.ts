import { useMemo } from "react";

export const useMotivation = (stats, targets, streakCount = 0) => {
  return useMemo(() => {
    if (!stats || !targets) return "";

    const proteinPercent =
      targets.protein > 0 ? stats.total_protein / targets.protein : 0;
    const caloriePercent =
      targets.calories > 0 ? stats.total_calories / targets.calories : 0;

    const hour = new Date().getHours();

    const pick = (messages) =>
      messages[Math.floor(Math.random() * messages.length)];

    // --- TIME-BASED GREETINGS ---
    const timeGreeting = (() => {
      if (hour >= 6 && hour < 12) return "Good morning ☀️"; // 6–11
      if (hour >= 12 && hour < 18) return "Good afternoon 🌤️"; // 12–17
      if (hour >= 18 && hour < 21) return "Good evening 🌙"; // 18–20
      return "Good night 🌌"; // 21–23, 0–5
    })();

    // --- STREAK MESSAGES (1–7 days) ---
    const streakMessages = {
      1: "Day 1 — every journey starts with a single step 🌱",
      2: "Day 2 — consistency is building 💪",
      3: "Day 3 — habits are forming 🔥",
      4: "Day 4 — strong discipline, keep going 🚀",
      5: "Day 5 — amazing focus this week 👏",
      6: "Day 6 — almost a full week of consistency 🏆",
      7: "7-day streak! You’re unstoppable 🔥🔥",
    };
    

    // --- MESSAGE POOLS ---
    const startMessages = [
      "Let’s start strong — log your first meal 🍽️",
      "A healthy day begins with one meal 🥗",
      "Your body is waiting — fuel it right 💚",
    ];

    const proteinCrushedMessages = [
      "Protein goal crushed! 💪 Amazing discipline",
      "Muscles are thanking you today 🏋️‍♂️",
      "Strong choices, strong body 💥",
    ];

    const proteinAlmostMessages = [
      "Almost there! One protein-rich meal to go 🔥",
      "So close! Add some dal, eggs, or paneer 🧀",
      "Just a little more protein — you’ve got this 💪",
    ];

    const calorieWarningMessages = [
      "Careful — you're close to your calorie limit 👀",
      "Mindful eating now will pay off later ⚖️",
      "You’re near your calorie target — choose wisely 🍽️",
    ];

    const balancedDayMessages = [
      "You’re doing great — consistency beats perfection 🌱",
      "Small healthy choices add up ✨",
      "Progress over perfection — keep going 🚀",
    ];

    // --- PRIORITY LOGIC ORDER ---

    // 1️⃣ Time greeting + streak (highest emotional impact)
    if (streakCount >= 1 && streakCount <= 7) {
      return `${timeGreeting} · ${streakMessages[streakCount]}`;
    }

    // 2️⃣ No meals yet
    if (stats.meal_count === 0) {
      return `${timeGreeting} · ${pick(startMessages)}`;
    }

    // 3️⃣ Protein logic
    if (proteinPercent >= 1) {
      return pick(proteinCrushedMessages);
    }

    if (proteinPercent >= 0.75) {
      return pick(proteinAlmostMessages);
    }

    // 4️⃣ Calorie warning
    if (caloriePercent >= 0.9) {
      return pick(calorieWarningMessages);
    }

    // 5️⃣ Default encouragement
    return pick(balancedDayMessages);
  }, [stats, targets, streakCount]);
};
