export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export type UserRank = 
  | 'Apprentice Analyst' 
  | 'Security Operative' 
  | 'Systems Specialist' 
  | 'Cyber Sentinel' 
  | 'Security Architect';

export interface UserProfile {
  name: string;
  codename: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank: UserRank;
  streak: number;
  lastActiveDate: string;
  streakFreezes: number;
  dailyGoalXp: number;
  todayXpEarned: number;
  notificationsEnabled: boolean;
  studyReminderTime: string;
}

export type ModuleCategory =
  | 'fundamentals'
  | 'networking'
  | 'linux'
  | 'programming'
  | 'web_security'
  | 'cryptography'
  | 'forensics'
  | 'osint'
  | 'defensive'
  | 'ctf';

export interface QuizQuestion {
  id: string;
  moduleId: ModuleCategory;
  moduleTitle: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  scenarioCode?: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
  whyItMatters: string;
  xpReward: number;
  // SRS (Spaced Repetition System) state
  srsBox?: number; // 1 to 5
  nextReviewDate?: string;
  lastReviewedDate?: string;
}

export interface CliLab {
  id: string;
  moduleId: ModuleCategory;
  title: string;
  objective: string;
  initialDirectory: string;
  targetFlag: string;
  xpReward: number;
  hint: string;
  files: Record<string, string>;
  directories: string[];
}

export interface CtfMission {
  id: string;
  codeName: string;
  title: string;
  category: ModuleCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  briefing: string;
  evidenceFiles: {
    name: string;
    description: string;
    content: string;
  }[];
  flag: string;
  xpReward: number;
  timeLimitMinutes: number;
  hints: string[];
  solved: boolean;
  solutionDebrief: string;
}

export interface SkillNode {
  id: string;
  title: string;
  category: ModuleCategory;
  tier: number; // 1, 2, 3
  description: string;
  prerequisites: string[];
  xpRequired: number;
  unlocked: boolean;
  mastered: boolean;
  relatedLabId?: string;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  codename: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  rankTitle: UserRank;
  change: 'up' | 'down' | 'same';
  changeAmount?: number;
  badgesCount: number;
  countryCode: string;
  isCurrentUser?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'mastery' | 'streak' | 'ctf' | 'terminal' | 'special';
  icon: string;
  unlockedAt: string | null;
  xpBonus: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  progress?: number;
  target?: number;
  unit?: string;
}

export type SrsRating = 1 | 2 | 3; // 1: Hard, 2: Good, 3: Easy

export interface SrsItemState {
  cardId: string;
  box: number; // 1 to 5
  intervalDays: number;
  repetitionCount: number;
  easeFactor: number;
  lastReviewedDate?: string;
  nextReviewDate: string;
  lastQuality: SrsRating;
}

export type SyncState = 'synced' | 'syncing' | 'offline' | 'error';

export interface MonthlyReport {
  period: string;
  generatedAt: string;
  totalXp: number;
  studyTimeMinutes: number;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracyRate: number;
  activeStreak: number;
  ctfsSolved: number;
  labsCompleted: number;
  skillsMasteredCount: number;
  topDomain: string;
  weakestDomain: string;
  retentionScore: number;
  actionableInsights: string[];
}

export interface BossChallenge {
  id: string;
  moduleId: ModuleCategory;
  title: string;
  incidentCode: string;
  description: string;
  topologyImage?: string;
  packetSummary: string[];
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  mitigationConfig: {
    ruleLabel: string;
    options: string[];
    correctIndex: number;
  };
  xpReward: number;
}

export interface PeerStudent {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isMuted: boolean;
  hasCam: boolean;
  statusText: string;
}

export interface StudyMeetSession {
  roomCode: string;
  title: string;
  topic: string;
  participants: PeerStudent[];
  activeQuestionIndex: number;
  timeRemainingSeconds: number;
}

export interface DatabaseColumn {
  name: string;
  type: string;
  isSensitive?: boolean;
  isEncrypted?: boolean;
}

export interface DatabaseTable {
  id: string;
  name: string;
  columns: DatabaseColumn[];
  recordsCount: number;
  isCanary?: boolean;
}

export interface IntruderAttack {
  id: string;
  attackerName: string;
  attackerIp: string;
  targetTable: string;
  vector: string;
  payload: string;
  timestamp: string;
  status: 'blocked' | 'infiltrated';
  mitigationRequired: string;
  lessonSummary: string;
}

export interface DefenseHardeningOption {
  id: string;
  name: string;
  description: string;
  category: 'queries' | 'access' | 'encryption' | 'detection';
  enabled: boolean;
  blocksVector: string[];
}

export type FirewallProtocol = 'TCP' | 'UDP' | 'ANY';
export type FirewallAction = 'ALLOW' | 'DENY';
export type FirewallInspectionMode = 'PACKET_FILTER' | 'WAF_SQLI' | 'RATE_LIMIT' | 'HONEYPOT_GUARD';

export interface FirewallRule {
  id: string;
  priority: number;
  name: string;
  description: string;
  sourceIp: string;
  destinationPort: number | 'ANY';
  protocol: FirewallProtocol;
  action: FirewallAction;
  inspectionMode: FirewallInspectionMode;
  rateLimitRps?: number;
  enabled: boolean;
  hitCount: number;
  createdAt: string;
  isSystemDefault?: boolean;
}

export interface DatabaseAccessLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  originCountry: string;
  originCity: string;
  originLat?: number;
  originLng?: number;
  protocol: string;
  sourcePort: number;
  destinationPort: number;
  action: 'ALLOWED' | 'BLOCKED' | 'ALERT';
  matchedRuleId?: string;
  severity: 'info' | 'warning' | 'critical';
  query?: string;
  payload?: string;
  userOrAccount?: string;
  threatActor?: string;
  threatVector?: string;
  wafBlocked?: boolean;
}

export interface AttackScript {
  id: string;
  name: string;
  fileName: string;
  vector: 'sqli' | 'bruteforce' | 'ddos' | 'wipe' | 'exfil' | 'honeytoken';
  description: string;
  attackerIp: string;
  originLocation: string;
  datacenter: string;
  originLat: number;
  originLng: number;
  targetPort: number | 'ANY';
  targetTable: string;
  frequencyIntervalMs: number;
  payloadSamples: string[];
  mitigationRuleType: 'firewall_ip' | 'firewall_port' | 'waf_sqli' | 'rate_limit' | 'honeytoken_ban';
  status: 'attacking' | 'blocked' | 'paused';
  packetsSent: number;
  packetsBlocked: number;
}

export interface DatabaseMetrics {
  healthScore: number;
  cpuLoad: number;
  activeConnections: number;
  blockedAttacksTotal: number;
  allowedLegitQueriesTotal: number;
  breachesDetectedTotal: number;
  isCompromised: boolean;
}

export interface MapsGroundingLink {
  title: string;
  uri: string;
  address?: string;
}

export interface MapsGroundingResponse {
  text: string;
  mapsLinks: MapsGroundingLink[];
  groundingChunks?: any[];
  isSimulated: boolean;
  tip?: string;
  error?: string;
}

