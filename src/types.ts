export type SectionType = 'home' | 'learning' | 'simulator' | 'library' | 'dashboard';

export interface VibeProject {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  icon: string;
  promptText: string;
  estimatedTime: string;
  previewColor: string;
  features: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  analogy: string;
  content: string[];
  keyTakeaways: string[];
  vibeTip: string;
}

export interface Level {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  estimatedMinutes: number;
  badgeName: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
  isCompleted?: boolean;
}

export interface VibePrompt {
  id: string;
  title: string;
  description: string;
  category: 'تصميم الواجهات' | 'المتاجر والتطبيقات' | 'أدوات تفاعلية' | 'حل الأخطاء' | 'ألعاب وتسلية';
  promptText: string;
  tags: string[];
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  copyCount: number;
  presetHtml?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  howToEarn?: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  category: 'learning' | 'simulator' | 'library' | 'general';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isCodeUpdate?: boolean;
}

export interface GlossaryItem {
  term: string;
  englishTerm: string;
  simpleAnalogy: string;
  explanation: string;
  category: 'الذكاء الاصطناعي' | 'الخزانة السحابية' | 'أساسيات الويب';
}

export interface UserProgress {
  xp: number;
  completedLevelIds: number[];
  generatedAppsCount: number;
  copiedPromptsCount: number;
  unlockedBadgeIds: string[];
  quizScores?: Record<number, number>; // levelId -> score percentage or score count
  simulatorHistory: Array<{
    id: string;
    prompt: string;
    timestamp: string;
  }>;
}
