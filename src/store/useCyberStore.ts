import { useState, useEffect } from 'react';
import { 
  UserProfile, 
  QuizQuestion, 
  CliLab, 
  CtfMission, 
  SkillNode, 
  Achievement, 
  BossChallenge,
  UserRank,
  SrsRating,
  SyncState
} from '../types';
import { 
  INITIAL_QUESTIONS, 
  INITIAL_LABS, 
  INITIAL_CTFS, 
  INITIAL_SKILLS, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_BOSS 
} from '../data/curriculum';

const STORAGE_KEY = 'cyberquiz_app_state_v2';
const DEFAULT_SYNC_TOKEN = 'CQ-SYNC-AV09';

export interface AppState {
  user: UserProfile;
  questions: QuizQuestion[];
  labs: CliLab[];
  ctfs: CtfMission[];
  skills: SkillNode[];
  achievements: Achievement[];
  boss: BossChallenge;
  bossCompleted: boolean;
  theme: 'dark' | 'light';
  hasSeenOnboarding: boolean;
  activeLabId: string | null;
  activeCtfId: string | null;
  notificationLog: { id: string; message: string; timestamp: string }[];
  // Offline & Multi-device sync
  syncToken: string;
  syncState: SyncState;
  lastSyncTimestamp: string | null;
  isOnline: boolean;
  // Achievement Toast Hook
  activeAchievementToast: Achievement | null;
  // SRS Review items
  studyMinutesTotal: number;
}

const DEFAULT_USER: UserProfile = {
  name: 'Alex Vance',
  codename: 'OPERATIVE_09',
  avatar: 'AV',
  level: 1,
  xp: 150,
  xpToNextLevel: 300,
  rank: 'Apprentice Analyst',
  streak: 3,
  lastActiveDate: getYesterdayDateStr(), // yesterday to start in active waiting state
  streakFreezes: 2,
  dailyGoalXp: 50,
  todayXpEarned: 25,
  notificationsEnabled: true,
  studyReminderTime: '19:00',
};

function getTodayDateStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function calculateRank(xp: number): UserRank {
  if (xp >= 2500) return 'Security Architect';
  if (xp >= 1500) return 'Cyber Sentinel';
  if (xp >= 800) return 'Systems Specialist';
  if (xp >= 300) return 'Security Operative';
  return 'Apprentice Analyst';
}

function calculateLevel(xp: number): { level: number; xpToNextLevel: number } {
  const level = Math.max(1, Math.floor(xp / 250) + 1);
  const xpToNextLevel = level * 250;
  return { level, xpToNextLevel };
}

// Calculate milestone progress for achievements
function enrichAchievements(achievements: Achievement[], user: UserProfile, ctfs: CtfMission[], skills: SkillNode[], labs: CliLab[], bossCompleted: boolean): Achievement[] {
  const solvedCtfs = ctfs.filter(c => c.solved).length;
  const masteredSkills = skills.filter(s => s.mastered).length;
  const firstAccessUnlocked = achievements.some(a => a.id === 'ach-first-access' && !!a.unlockedAt);

  return achievements.map(ach => {
    switch (ach.id) {
      case 'ach-first-access':
        return { ...ach, progress: firstAccessUnlocked ? 1 : 0, target: 1, unit: 'enclave access' };
      case 'ach-packet-whisperer':
        return { ...ach, progress: Math.min(3, Math.floor(user.xp / 100)), target: 3, unit: 'networking queries' };
      case 'ach-streak-fire':
        return { ...ach, progress: Math.min(7, user.streak), target: 7, unit: 'consecutive days' };
      case 'ach-ctf-blackice':
        return { ...ach, progress: solvedCtfs, target: 1, unit: 'mission resolved' };
      case 'ach-srs-master':
        return { ...ach, progress: Math.min(5, masteredSkills + 1), target: 5, unit: 'spaced reviews' };
      case 'ach-architect':
        return { ...ach, progress: Math.min(2000, user.xp), target: 2000, unit: 'total XP' };
      default:
        return ach;
    }
  });
}

function loadInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const user = parsed.user || DEFAULT_USER;
      const ctfs = parsed.ctfs || INITIAL_CTFS;
      const skills = parsed.skills || INITIAL_SKILLS;
      const labs = parsed.labs || INITIAL_LABS;
      const achievements = enrichAchievements(parsed.achievements || INITIAL_ACHIEVEMENTS, user, ctfs, skills, labs, parsed.bossCompleted || false);

      return {
        ...parsed,
        user,
        questions: parsed.questions?.length ? parsed.questions : INITIAL_QUESTIONS,
        labs,
        ctfs,
        skills,
        achievements,
        boss: parsed.boss || INITIAL_BOSS,
        bossCompleted: parsed.bossCompleted || false,
        syncToken: parsed.syncToken || DEFAULT_SYNC_TOKEN,
        syncState: 'synced',
        lastSyncTimestamp: parsed.lastSyncTimestamp || new Date().toISOString(),
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
        activeAchievementToast: null,
        studyMinutesTotal: parsed.studyMinutesTotal || 45,
      };
    }
  } catch (e) {
    console.error('Failed to load CyberQuiz local state:', e);
  }

  const defaultAchievements = enrichAchievements(INITIAL_ACHIEVEMENTS, DEFAULT_USER, INITIAL_CTFS, INITIAL_SKILLS, INITIAL_LABS, false);

  return {
    user: DEFAULT_USER,
    questions: INITIAL_QUESTIONS,
    labs: INITIAL_LABS,
    ctfs: INITIAL_CTFS,
    skills: INITIAL_SKILLS,
    achievements: defaultAchievements,
    boss: INITIAL_BOSS,
    bossCompleted: false,
    theme: 'dark',
    hasSeenOnboarding: false,
    activeLabId: 'lab-first-access',
    activeCtfId: 'ctf-black-ice',
    notificationLog: [],
    syncToken: DEFAULT_SYNC_TOKEN,
    syncState: 'synced',
    lastSyncTimestamp: new Date().toISOString(),
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    activeAchievementToast: null,
    studyMinutesTotal: 45,
  };
}

let globalState: AppState = loadInitialState();
const listeners = new Set<() => void>();

function saveState(newState: AppState) {
  globalState = newState;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (e) {
    console.warn('Could not persist CyberQuiz state:', e);
  }
  listeners.forEach(fn => fn());
}

export function useCyberStore() {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    const listener = () => setState(globalState);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Online / Offline Detection
  useEffect(() => {
    const handleOnline = () => {
      saveState({
        ...globalState,
        isOnline: true,
        syncState: 'syncing',
      });
      // Trigger cloud sync upon coming back online
      pushSyncToCloud();
    };

    const handleOffline = () => {
      saveState({
        ...globalState,
        isOnline: false,
        syncState: 'offline',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Theme Sync
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [state.theme]);

  // Streak Verification on Mount / Access
  useEffect(() => {
    checkAndMaintainStreak();
  }, []);

  // Streak algorithm with automatic streak freeze protection
  const checkAndMaintainStreak = () => {
    const today = getTodayDateStr();
    const lastActive = globalState.user.lastActiveDate;

    if (!lastActive || lastActive === today) {
      return; // Already checked or active today
    }

    const yesterday = getYesterdayDateStr();
    if (lastActive === yesterday) {
      return; // Streak is pending today's activity, intact!
    }

    // If last active was 2 or more days ago:
    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays >= 2) {
      if (globalState.user.streakFreezes > 0) {
        // Automatic streak freeze shield deployed!
        const remainingFreezes = globalState.user.streakFreezes - 1;
        const msg = `Streak Freeze Shield Activated! Your ${globalState.user.streak}-day streak was protected from decay. (${remainingFreezes} shields left)`;
        
        saveState({
          ...globalState,
          user: {
            ...globalState.user,
            streakFreezes: remainingFreezes,
            lastActiveDate: yesterday, // Pull forward to preserve streak
          },
          notificationLog: [
            { id: Math.random().toString(), message: msg, timestamp: new Date().toLocaleTimeString() },
            ...globalState.notificationLog.slice(0, 9)
          ]
        });
      } else {
        // No streak freeze available: streak resets to 1
        const msg = `Daily study streak reset to 1. Complete today's module to rebuild momentum!`;
        saveState({
          ...globalState,
          user: {
            ...globalState.user,
            streak: 1,
            lastActiveDate: yesterday,
          },
          notificationLog: [
            { id: Math.random().toString(), message: msg, timestamp: new Date().toLocaleTimeString() },
            ...globalState.notificationLog.slice(0, 9)
          ]
        });
      }
    }
  };

  // Add XP and trigger streak updates & achievements
  const addXp = (amount: number, reason?: string) => {
    const today = getTodayDateStr();
    let currentStreak = globalState.user.streak;
    let newLastActive = globalState.user.lastActiveDate;

    // Check if first activity of today to increment streak
    if (newLastActive !== today) {
      currentStreak += 1;
      newLastActive = today;
    }

    const newXp = globalState.user.xp + amount;
    const { level, xpToNextLevel } = calculateLevel(newXp);
    const rank = calculateRank(newXp);
    const newTodayXp = globalState.user.todayXpEarned + amount;

    // Check achievements
    let newlyUnlockedBadge: Achievement | null = null;
    let updatedAchievements = globalState.achievements.map(ach => {
      if (!ach.unlockedAt) {
        let shouldUnlock = false;
        if (ach.id === 'ach-architect' && newXp >= 2000) shouldUnlock = true;
        if (ach.id === 'ach-streak-fire' && currentStreak >= 7) shouldUnlock = true;

        if (shouldUnlock) {
          const unlocked = { ...ach, unlockedAt: new Date().toISOString() };
          newlyUnlockedBadge = unlocked;
          return unlocked;
        }
      }
      return ach;
    });

    updatedAchievements = enrichAchievements(
      updatedAchievements, 
      { ...globalState.user, xp: newXp, streak: currentStreak }, 
      globalState.ctfs, 
      globalState.skills, 
      globalState.labs, 
      globalState.bossCompleted
    );

    const notification = reason 
      ? { id: Math.random().toString(), message: `+${amount} XP: ${reason}`, timestamp: new Date().toLocaleTimeString() }
      : null;

    saveState({
      ...globalState,
      user: {
        ...globalState.user,
        xp: newXp,
        level,
        xpToNextLevel,
        rank,
        streak: currentStreak,
        lastActiveDate: newLastActive,
        todayXpEarned: newTodayXp,
      },
      achievements: updatedAchievements,
      activeAchievementToast: newlyUnlockedBadge || globalState.activeAchievementToast,
      notificationLog: notification ? [notification, ...globalState.notificationLog.slice(0, 9)] : globalState.notificationLog,
    });
  };

  // Buy a Streak Freeze using earned XP
  const buyStreakFreeze = (costXp = 150): { success: boolean; message: string } => {
    if (globalState.user.xp < costXp) {
      return { success: false, message: `Insufficient XP. Requires ${costXp} XP (You have ${globalState.user.xp} XP).` };
    }
    if (globalState.user.streakFreezes >= 5) {
      return { success: false, message: 'Maximum 5 streak freeze shields equipped.' };
    }

    const newXp = globalState.user.xp - costXp;
    const { level, xpToNextLevel } = calculateLevel(newXp);
    const newFreezes = globalState.user.streakFreezes + 1;

    saveState({
      ...globalState,
      user: {
        ...globalState.user,
        xp: newXp,
        level,
        xpToNextLevel,
        streakFreezes: newFreezes,
      },
      notificationLog: [
        { id: Math.random().toString(), message: `Equipped Streak Freeze Shield (${newFreezes} active)`, timestamp: new Date().toLocaleTimeString() },
        ...globalState.notificationLog.slice(0, 9),
      ]
    });

    return { success: true, message: `Streak Freeze Shield acquired! You now have ${newFreezes} protective shields.` };
  };

  // Organic Spaced Repetition (SM-2 / Leitner hybrid)
  const reviewSrsCard = (questionId: string, rating: SrsRating) => {
    const qIndex = globalState.questions.findIndex(q => q.id === questionId);
    if (qIndex === -1) return;

    const target = globalState.questions[qIndex];
    let box = target.srsBox || 1;
    let daysToAdd = 1;

    if (rating === 1) {
      // Hard
      box = 1;
      daysToAdd = 1;
    } else if (rating === 2) {
      // Good
      box = Math.min(5, box + 1);
      daysToAdd = [1, 3, 5, 8, 14][box - 1] || 3;
    } else {
      // Easy
      box = Math.min(5, box + 2);
      daysToAdd = [2, 5, 9, 14, 28][box - 1] || 7;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    const updatedQuestions = [...globalState.questions];
    updatedQuestions[qIndex] = {
      ...target,
      srsBox: box,
      lastReviewedDate: new Date().toISOString(),
      nextReviewDate: nextDate.toISOString(),
    };

    // XP for SRS review
    const xpReward = rating === 3 ? 35 : rating === 2 ? 25 : 15;
    addXp(xpReward, `SRS Review: ${target.moduleTitle} (Box ${box})`);

    saveState({
      ...globalState,
      questions: updatedQuestions,
    });
  };

  const answerQuestion = (questionId: string, optionId: string, srsPerformance?: 'hard' | 'good' | 'easy') => {
    const qIndex = globalState.questions.findIndex(q => q.id === questionId);
    if (qIndex === -1) return { correct: false, explanation: '', whyItMatters: '' };

    const target = globalState.questions[qIndex];
    const isCorrect = target.correctOptionId === optionId;

    let newSrsBox = target.srsBox || 1;
    if (isCorrect) {
      if (srsPerformance === 'easy') newSrsBox = Math.min(5, newSrsBox + 2);
      else if (srsPerformance === 'good') newSrsBox = Math.min(5, newSrsBox + 1);
      else newSrsBox = Math.min(5, newSrsBox + 1);
    } else {
      newSrsBox = 1;
    }

    const daysToAdd = [1, 2, 4, 7, 14][newSrsBox - 1] || 1;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    const updatedQuestions = [...globalState.questions];
    updatedQuestions[qIndex] = {
      ...target,
      srsBox: newSrsBox,
      lastReviewedDate: new Date().toISOString(),
      nextReviewDate: nextDate.toISOString(),
    };

    if (isCorrect) {
      addXp(target.xpReward, `Solved ${target.moduleTitle}`);
    }

    saveState({
      ...globalState,
      questions: updatedQuestions,
    });

    return {
      correct: isCorrect,
      explanation: target.explanation,
      whyItMatters: target.whyItMatters,
      xpAwarded: isCorrect ? target.xpReward : 0,
    };
  };

  const submitFlag = (labId: string, submittedFlag: string) => {
    const lab = globalState.labs.find(l => l.id === labId);
    if (!lab) return { success: false, message: 'Lab not found' };

    const cleanInput = submittedFlag.trim();
    if (cleanInput === lab.targetFlag) {
      addXp(lab.xpReward, `Flag Captured: ${lab.title}`);

      let updatedAchievements = [...globalState.achievements];
      let newlyUnlocked: Achievement | null = null;
      if (labId === 'lab-first-access') {
        updatedAchievements = updatedAchievements.map(a => {
          if (a.id === 'ach-first-access' && !a.unlockedAt) {
            newlyUnlocked = { ...a, unlockedAt: new Date().toISOString() };
            return newlyUnlocked;
          }
          return a;
        });
      }

      saveState({
        ...globalState,
        achievements: updatedAchievements,
        activeAchievementToast: newlyUnlocked || globalState.activeAchievementToast,
      });

      return { success: true, message: `ACCESS GRANTED! Flag confirmed. +${lab.xpReward} XP earned.` };
    }

    return { success: false, message: 'FLAG MISMATCH. Verification checksum failed.' };
  };

  const submitCtfFlag = (ctfId: string, submittedFlag: string) => {
    const ctf = globalState.ctfs.find(c => c.id === ctfId);
    if (!ctf) return { success: false, message: 'Operation not found' };

    if (submittedFlag.trim() === ctf.flag) {
      const updatedCtfs = globalState.ctfs.map(c => 
        c.id === ctfId ? { ...c, solved: true } : c
      );

      let newlyUnlocked: Achievement | null = null;
      let updatedAchievements = globalState.achievements.map(a => {
        if (ctfId === 'ctf-black-ice' && a.id === 'ach-ctf-blackice' && !a.unlockedAt) {
          newlyUnlocked = { ...a, unlockedAt: new Date().toISOString() };
          return newlyUnlocked;
        }
        return a;
      });

      addXp(ctf.xpReward, `Mission Completed: ${ctf.codeName}`);

      saveState({
        ...globalState,
        ctfs: updatedCtfs,
        achievements: updatedAchievements,
        activeAchievementToast: newlyUnlocked || globalState.activeAchievementToast,
      });

      return { 
        success: true, 
        message: `OPERATION RESOLVED. Forensic analysis accepted. +${ctf.xpReward} XP rewarded.` 
      };
    }

    return { success: false, message: 'INVALID FLAG. Re-inspect network and authentication logs.' };
  };

  const unlockSkill = (skillId: string) => {
    const updatedSkills = globalState.skills.map(s => 
      s.id === skillId ? { ...s, unlocked: true } : s
    );
    saveState({
      ...globalState,
      skills: updatedSkills,
    });
  };

  const completeBossChallenge = () => {
    addXp(globalState.boss.xpReward, 'Neutralized Incident 402 - Networking Boss');
    saveState({
      ...globalState,
      bossCompleted: true,
    });
  };

  const dismissAchievementToast = () => {
    saveState({
      ...globalState,
      activeAchievementToast: null,
    });
  };

  // Cross-device Cloud Synchronization
  const pushSyncToCloud = async (): Promise<boolean> => {
    if (!navigator.onLine) {
      saveState({ ...globalState, syncState: 'offline' });
      return false;
    }

    saveState({ ...globalState, syncState: 'syncing' });

    try {
      const payload = {
        syncToken: globalState.syncToken,
        deviceId: 'device-' + Math.random().toString(36).slice(2, 8),
        state: {
          user: globalState.user,
          questions: globalState.questions,
          labs: globalState.labs,
          ctfs: globalState.ctfs,
          skills: globalState.skills,
          achievements: globalState.achievements,
          bossCompleted: globalState.bossCompleted,
        }
      };

      const res = await fetch('/api/sync/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        saveState({
          ...globalState,
          syncState: 'synced',
          lastSyncTimestamp: data.updatedAt,
        });
        return true;
      }
    } catch (e) {
      console.warn('Sync push error:', e);
    }

    saveState({ ...globalState, syncState: 'error' });
    return false;
  };

  const pullSyncFromCloud = async (token?: string): Promise<{ success: boolean; message: string }> => {
    const targetToken = token || globalState.syncToken;
    if (!targetToken) return { success: false, message: 'Sync Token required' };

    saveState({ ...globalState, syncState: 'syncing' });

    try {
      const res = await fetch(`/api/sync/pull?syncToken=${encodeURIComponent(targetToken)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          const merged: AppState = {
            ...globalState,
            ...data.state,
            syncToken: targetToken,
            syncState: 'synced',
            lastSyncTimestamp: data.updatedAt,
          };
          saveState(merged);
          return { success: true, message: `Profile synchronized from cloud (${new Date(data.updatedAt).toLocaleTimeString()})` };
        }
      }
    } catch (e) {
      console.warn('Sync pull error:', e);
    }

    saveState({ ...globalState, syncState: 'error' });
    return { success: false, message: 'No cloud profile found with this sync token.' };
  };

  const setSyncToken = (token: string) => {
    saveState({ ...globalState, syncToken: token });
  };

  const toggleTheme = () => {
    saveState({
      ...globalState,
      theme: globalState.theme === 'dark' ? 'light' : 'dark',
    });
  };

  const setOnboardingComplete = () => {
    saveState({
      ...globalState,
      hasSeenOnboarding: true,
    });
  };

  const setActiveLab = (labId: string) => {
    saveState({ ...globalState, activeLabId: labId });
  };

  const setActiveCtf = (ctfId: string) => {
    saveState({ ...globalState, activeCtfId: ctfId });
  };

  const resetAllProgress = () => {
    saveState({
      user: DEFAULT_USER,
      questions: INITIAL_QUESTIONS,
      labs: INITIAL_LABS,
      ctfs: INITIAL_CTFS,
      skills: INITIAL_SKILLS,
      achievements: INITIAL_ACHIEVEMENTS,
      boss: INITIAL_BOSS,
      bossCompleted: false,
      theme: 'dark',
      hasSeenOnboarding: false,
      activeLabId: 'lab-first-access',
      activeCtfId: 'ctf-black-ice',
      notificationLog: [],
      syncToken: DEFAULT_SYNC_TOKEN,
      syncState: 'synced',
      lastSyncTimestamp: new Date().toISOString(),
      isOnline: navigator.onLine,
      activeAchievementToast: null,
      studyMinutesTotal: 45,
    });
  };

  return {
    ...state,
    addXp,
    buyStreakFreeze,
    reviewSrsCard,
    answerQuestion,
    submitFlag,
    submitCtfFlag,
    unlockSkill,
    completeBossChallenge,
    dismissAchievementToast,
    pushSyncToCloud,
    pullSyncFromCloud,
    setSyncToken,
    toggleTheme,
    setOnboardingComplete,
    setActiveLab,
    setActiveCtf,
    resetAllProgress,
  };
}
