export type SectionType = 
  | 'Glomerulus'
  | 'Proximal Tubule'
  | 'Loop of Henle'
  | 'Distal Tubule & Collecting Duct'
  | 'Bladder';

export type TileActionType = 
  | 'start' 
  | 'resource' 
  | 'henle_even' 
  | 'henle_odd' 
  | 'hormone' 
  | 'bladder' 
  | 'quiz';

export interface BoardTile {
  tileId: number;
  section: SectionType;
  sectionColor: string; // Tailwind color class or hex
  name: string;
  description: string;
  effect: string;
  effectType: TileActionType;
  icon: string;
  statChange?: {
    hydration: number;
    sodium: number;
  };
}

export interface Player {
  id: string;
  name: string;
  color: string;
  position: number; // 1 to 40
  hydration: number; // 0 to 100
  sodium: number; // 0 to 100
  adhCards: number;
  aldosteroneCards: number;
  diureticCards: number;
  anpCards: number;
  adhCooldown?: number;
  aldosteroneCooldown?: number;
  diureticCooldown?: number;
  anpCooldown?: number;
  isReady: boolean;
  isBot: boolean;
  score?: number;
  hasFinished?: boolean;
}

export type Phase = 'EVENT' | 'ROLL' | 'ACTION' | 'CARD' | 'ENDED';

export interface GlobalEvent {
  id: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  hydrationChange: number;
  sodiumChange: number;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  category?: SectionType | 'General';
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  statReward: {
    hydration: number;
    sodium: number;
  };
}

export interface GameRoomState {
  id: string;
  code: string;
  status: 'lobby' | 'playing' | 'finished';
  currentPlayerIndex: number;
  phase: Phase;
  currentEvent: GlobalEvent | null;
  players: Player[];
  logs: string[];
}
