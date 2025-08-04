import { AIAnalysis, JournalEntry } from '../types';

// Mock AI analysis function - in production, this would call OpenAI or similar API
export const analyzeSentiment = async (text: string): Promise<AIAnalysis> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simple sentiment analysis based on keywords
  const positiveWords = ['happy', 'good', 'great', 'wonderful', 'excited', 'joy', 'love', 'amazing', 'fantastic', 'blessed'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'angry', 'hate', 'depressed', 'anxious', 'worried', 'stressed'];
  const neutralWords = ['okay', 'fine', 'normal', 'average', 'neutral', 'calm', 'tired'];
  
  const textLower = text.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;
  let neutralScore = 0;
  
  positiveWords.forEach(word => {
    if (textLower.includes(word)) positiveScore += 1;
  });
  
  negativeWords.forEach(word => {
    if (textLower.includes(word)) negativeScore += 1;
  });
  
  neutralWords.forEach(word => {
    if (textLower.includes(word)) neutralScore += 1;
  });
  
  const totalScore = positiveScore + negativeScore + neutralScore;
  let sentimentScore = 0;
  let label: 'positive' | 'negative' | 'neutral' = 'neutral';
  let emotions: string[] = [];
  
  if (totalScore > 0) {
    sentimentScore = (positiveScore - negativeScore) / totalScore;
    
    if (sentimentScore > 0.3) {
      label = 'positive';
      emotions = ['happy', 'excited', 'content'];
    } else if (sentimentScore < -0.3) {
      label = 'negative';
      emotions = ['sad', 'anxious', 'stressed'];
    } else {
      label = 'neutral';
      emotions = ['calm', 'neutral', 'balanced'];
    }
  }
  
  // Generate summary and quote based on sentiment
  const summaries = {
    positive: [
      "You're radiating positive energy today! Your words reflect a sense of joy and contentment.",
      "Your mood is uplifting and optimistic. You seem to be in a great place emotionally.",
      "There's a beautiful sense of gratitude and happiness in your reflection today."
    ],
    negative: [
      "It sounds like you're going through a challenging time. Remember, it's okay to not be okay.",
      "Your feelings are valid, and it's important to acknowledge difficult emotions.",
      "You're showing strength by expressing these feelings. Consider reaching out for support."
    ],
    neutral: [
      "You seem to be in a balanced state of mind today.",
      "Your reflection shows a calm and measured perspective on your day.",
      "You're taking a thoughtful approach to understanding your emotions."
    ]
  };
  
  const quotes = {
    positive: [
      "Every day is a new beginning. Take a deep breath and start again.",
      "You are stronger than you think, braver than you believe, and more capable than you imagine.",
      "The only way to do great work is to love what you do."
    ],
    negative: [
      "Your feelings are valid, and it's okay to not be okay.",
      "It's okay to ask for help. You don't have to go through this alone.",
      "Every storm runs out of rain. This too shall pass."
    ],
    neutral: [
      "Life is a balance of holding on and letting go.",
      "Peace comes from within. Do not seek it without.",
      "The present moment is filled with joy and happiness."
    ]
  };
  
  const moods = {
    positive: ['Joyful', 'Optimistic', 'Grateful', 'Excited', 'Content'],
    negative: ['Sad', 'Anxious', 'Stressed', 'Overwhelmed', 'Frustrated'],
    neutral: ['Calm', 'Balanced', 'Reflective', 'Peaceful', 'Centered']
  };
  
  const suggestions = {
    positive: [
      "Share your positive energy with someone who might need it",
      "Write down what made today special",
      "Practice gratitude by listing three things you appreciate"
    ],
    negative: [
      "Take deep breaths and practice self-compassion",
      "Consider talking to a trusted friend or family member",
      "Try a short meditation or mindfulness exercise"
    ],
    neutral: [
      "Take a moment to reflect on your current state",
      "Consider what would bring you more joy today",
      "Practice being present in the moment"
    ]
  };
  
  const randomIndex = Math.floor(Math.random() * 3);
  
  return {
    sentiment: {
      score: sentimentScore,
      label,
      emotions,
      confidence: Math.abs(sentimentScore) * 0.8 + 0.2
    },
    emotions, // Add top-level emotions
    summary: summaries[label][randomIndex],
    quote: quotes[label][randomIndex],
    mood: moods[label][Math.floor(Math.random() * moods[label].length)],
    suggestions: suggestions[label],
    keywords: extractKeywords(text)
  };
};

const extractKeywords = (text: string): string[] => {
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'his', 'hers', 'ours', 'theirs'];
  
  const keywords = words
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5);
  
  return Array.from(new Set(keywords));
};

export const generateWellnessTip = (): string => {
  const tips = [
    "Take deep breaths when feeling overwhelmed",
    "Practice gratitude by writing down 3 things you appreciate",
    "Connect with a friend or family member",
    "Go for a walk in nature",
    "Try a 5-minute meditation",
    "Listen to your favorite music",
    "Write down your thoughts and feelings",
    "Practice self-compassion and kindness",
    "Get adequate sleep and rest",
    "Stay hydrated and eat nourishing foods"
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}; 