/**
 * ZenZone – TypeScript Type Definitions
 * Typed session and yoga pose models
 */

export interface YogaSession {
  id: number;
  title: string;
  duration: number; // in minutes
  category: string; // 'Meditation' | 'Yoga' | 'Breathing'
  completed: boolean;
  date?: string;
}

export interface YogaPose {
  id: string;
  name: string;
  sanskrit: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  benefits: string[];
  instructions: string[];
  category: string;
}

export interface MeditationPreset {
  id: string;
  title: string;
  duration: number; // in minutes
  description: string;
  icon: string;
}
