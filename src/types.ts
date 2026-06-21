export type CarbonCategory = 'transport' | 'food' | 'energy' | 'shopping' | 'eco_credit';

export interface LogEntry {
  id: string;
  description: string;
  category: CarbonCategory;
  type: 'spend' | 'credit';
  amount: number; // in kg of CO2
  timestamp: string; // ISO string
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  type: 'daily' | 'weekly';
  category: CarbonCategory;
  completed: boolean;
  progress: number; // current progress e.g. 0 or 1
  target: number; // target required to complete e.g. 1
  icon: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: CarbonCategory;
  unlocked: boolean;
  requirementText: string;
  unlockedAt?: string;
  currentValue: number;
  targetValue: number;
}

export interface SimulatorState {
  bikeDays: number; // 0-7 days/week
  veggieDays: number; // 0-7 days/week
  ledBulbs: number; // number of bulbs replaced, 0-20
  localFood: boolean; // whether they source local food
  compostWaste: boolean; // whether they compost waste
  solarPanels: boolean; // whether home has solar panels
}

export interface TangibleEquivalent {
  label: string;
  value: number;
  unit: string;
  emoji: string;
  colorClass: string;
}
