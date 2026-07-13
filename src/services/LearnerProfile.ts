/**
 * AgriCompass Learner Profile Service
 * 
 * Manages the personalised learning state. Tracks mastery, interests, 
 * and confidence to tailor recommendations in the Discovery Engine.
 */

export interface LearnerProfile {
  mastery: Record<string, number>; // conceptId -> score 0-100
  interests: string[];             // list of topic categories
  confidence: "low" | "medium" | "high";
  recentViews: string[];
}

// In a real app, this would be persisted in local storage or a backend DB.
// For the showcase, we use a mock in-memory profile.
let currentProfile: LearnerProfile = {
  mastery: {
    "soil_health": 85,
    "weather_patterns": 40,
    "market_prices": 10,
  },
  interests: ["Organic Farming", "Water Conservation"],
  confidence: "medium",
  recentViews: ["nitrogen_deficiency", "drip_irrigation"],
};

export const LearnerProfileService = {
  getProfile: (): LearnerProfile => {
    return { ...currentProfile };
  },

  updateMastery: (conceptId: string, score: number) => {
    currentProfile.mastery[conceptId] = score;
  },

  addInterest: (interest: string) => {
    if (!currentProfile.interests.includes(interest)) {
      currentProfile.interests.push(interest);
    }
  },

  setConfidence: (level: "low" | "medium" | "high") => {
    currentProfile.confidence = level;
  },

  logView: (conceptId: string) => {
    if (!currentProfile.recentViews.includes(conceptId)) {
      currentProfile.recentViews.push(conceptId);
      if (currentProfile.recentViews.length > 10) {
        currentProfile.recentViews.shift();
      }
    }
  }
};
