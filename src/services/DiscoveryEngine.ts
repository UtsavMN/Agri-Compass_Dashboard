import { LearnerProfileService } from "./LearnerProfile";

export interface ConceptNode {
  id: string;
  title: string;
  description: string;
  category: "soil" | "weather" | "finance" | "crop";
}

export interface Recommendation {
  concept: ConceptNode;
  reason: string;   // Explainability: Why was this recommended?
  matchScore: number;
}

// Mock Knowledge Graph
const KNOWLEDGE_GRAPH: ConceptNode[] = [
  { id: "nitrogen_deficiency", title: "Nitrogen Deficiency", description: "Yellowing of older leaves, stunted growth.", category: "soil" },
  { id: "npk_ratios", title: "NPK Fertilizer Ratios", description: "Understanding Nitrogen, Phosphorus, Potassium blends.", category: "soil" },
  { id: "drip_irrigation", title: "Drip Irrigation", description: "Targeted watering directly to the roots, saving 40% water.", category: "crop" },
  { id: "monsoon_forecasting", title: "Monsoon Forecasting", description: "Predicting rain cycles for sowing preparation.", category: "weather" },
  { id: "mandi_pricing", title: "Mandi Pricing Trends", description: "Historical data analysis of crop prices across Karnataka.", category: "finance" },
  { id: "crop_insurance", title: "PMFBY Crop Insurance", description: "Government safety net for unpredictable weather.", category: "finance" }
];

export const DiscoveryEngine = {
  /**
   * Recommends next topics based on the learner profile.
   * Demonstrates the Vol I Ch 04 & Ch 05 "Discovery & Explainability" principles.
   */
  getRecommendations: (): Recommendation[] => {
    const profile = LearnerProfileService.getProfile();
    const recommendations: Recommendation[] = [];

    // Rule 1: If soil mastery is high, recommend advanced soil topic (NPK)
    if (profile.mastery["soil_health"] > 80) {
      const npk = KNOWLEDGE_GRAPH.find(c => c.id === "npk_ratios")!;
      recommendations.push({
        concept: npk,
        reason: "Because you have mastered basic Soil Health (85% score).",
        matchScore: 92
      });
    }

    // Rule 2: If weather mastery is low, recommend forecasting
    if (profile.mastery["weather_patterns"] < 50) {
      const weather = KNOWLEDGE_GRAPH.find(c => c.id === "monsoon_forecasting")!;
      recommendations.push({
        concept: weather,
        reason: "Suggested for revision based on your recent quiz performance.",
        matchScore: 88
      });
    }

    // Rule 3: Interest based recommendation
    if (profile.interests.includes("Water Conservation")) {
      const drip = KNOWLEDGE_GRAPH.find(c => c.id === "drip_irrigation")!;
      recommendations.push({
        concept: drip,
        reason: "Matches your stated interest in Water Conservation.",
        matchScore: 95
      });
    }

    // Fallback if we don't have 3
    if (recommendations.length < 3) {
      const finance = KNOWLEDGE_GRAPH.find(c => c.id === "crop_insurance")!;
      recommendations.push({
        concept: finance,
        reason: "Popular topic among farmers in your region.",
        matchScore: 75
      });
    }

    return recommendations.slice(0, 3);
  },

  getAllNodes: (): ConceptNode[] => {
    return [...KNOWLEDGE_GRAPH];
  }
};
