export type PageId = 'chat' | 'plan' | 'map' | 'materials' | 'analytics';

export interface KnowledgeNode {
  id: string;
  name: string;
  description?: string;
  children?: KnowledgeNode[];
  completed?: boolean;
  active?: boolean;
}

export interface SidebarItem {
  id: PageId;
  label: string;
  icon: string;
  active?: boolean;
}

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  status: 'pending' | 'learning' | 'completed';
}

export interface RoadmapStage {
  id: string;
  title: string;
  skills: string[];
  duration: string;
  progress: number;
  tasks: DailyTask[];
}

export interface LearningPlan {
  goal: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  weeklyHours: number;
  stages: RoadmapStage[];
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  relatedIds: string[];
}
