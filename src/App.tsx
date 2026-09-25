import React, { useState, useEffect } from 'react';
import { useCyberStore } from './store/useCyberStore';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { LearnHub } from './components/learn/LearnHub';
import { TerminalLab } from './components/terminal/TerminalLab';
import { CtfArena } from './components/ctf/CtfArena';
import { Leaderboard } from './components/leaderboard/Leaderboard';
import { SkillTree } from './components/skills/SkillTree';
import { BossArena } from './components/boss/BossArena';
import { ProgressDashboard } from './components/analytics/ProgressDashboard';
import { DatabaseDefenseLab } from './components/database-defense/DatabaseDefenseLab';
import { CyberMentorModal } from './components/mentor/CyberMentorModal';
import { StudyMeetModal } from './components/meet/StudyMeetModal';
import { CalendarModal } from './components/calendar/CalendarModal';
import { FirstAccessModal } from './components/onboarding/FirstAccessModal';
import { AchievementToast } from './components/achievements/AchievementComponent';
import { MultiDeviceSyncModal } from './components/sync/MultiDeviceSyncModal';

export default function App() {
  const { hasSeenOnboarding, setActiveLab, setActiveCtf } = useCyberStore();
  
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'learn' | 'labs' | 'ctf' | 'leaderboard' | 'skills' | 'boss' | 'analytics' | 'database'>('dashboard');
  
  // Modals state
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [mentorContext, setMentorContext] = useState<{ topic?: string; question?: string }>({});
  
  const [isMeetOpen, setIsMeetOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!hasSeenOnboarding);

  useEffect(() => {
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, [hasSeenOnboarding]);

  const handleOpenMentorWithContext = (topic: string, question: string) => {
    setMentorContext({ topic, question });
    setIsMentorOpen(true);
  };

  const handleOpenLab = (labId?: string) => {
    if (labId) setActiveLab(labId);
    setCurrentTab('labs');
  };

  const handleOpenCtf = (ctfId?: string) => {
    if (ctfId) setActiveCtf(ctfId);
    setCurrentTab('ctf');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 dark:bg-neutral-950 dark:text-neutral-100 light:bg-[#FAFAFA] light:text-neutral-900 transition-colors pb-16 md:pb-8">
      
      {/* Editorial Top Bar adhering to 3-Zone Contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenMentor={() => {
          setMentorContext({});
          setIsMentorOpen(true);
        }}
        onOpenMeet={() => setIsMeetOpen(true)}
        onOpenCalendar={() => setIsCalendarOpen(true)}
        onOpenSync={() => setIsSyncOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentTab === 'dashboard' && (
          <Dashboard
            onStartQuiz={() => setCurrentTab('learn')}
            onOpenLab={handleOpenLab}
            onOpenCtf={handleOpenCtf}
            onOpenSkills={() => setCurrentTab('skills')}
            onOpenBoss={() => setCurrentTab('boss')}
            onOpenMentor={() => {
              setMentorContext({});
              setIsMentorOpen(true);
            }}
            onOpenLeaderboard={() => setCurrentTab('leaderboard')}
            onOpenTelemetry={() => setCurrentTab('analytics')}
            onOpenDatabase={() => setCurrentTab('database')}
          />
        )}

        {currentTab === 'learn' && (
          <LearnHub onOpenMentorWithContext={handleOpenMentorWithContext} />
        )}

        {currentTab === 'labs' && (
          <TerminalLab 
            onOpenMentorWithContext={handleOpenMentorWithContext} 
            onOpenDatabase={() => setCurrentTab('database')}
          />
        )}

        {currentTab === 'database' && (
          <DatabaseDefenseLab onOpenMentorWithContext={handleOpenMentorWithContext} />
        )}

        {currentTab === 'ctf' && (
          <CtfArena onOpenMentorWithContext={handleOpenMentorWithContext} />
        )}

        {currentTab === 'leaderboard' && (
          <Leaderboard />
        )}

        {currentTab === 'skills' && (
          <SkillTree
            onOpenLab={handleOpenLab}
            onOpenQuiz={() => setCurrentTab('learn')}
          />
        )}

        {currentTab === 'boss' && (
          <BossArena onReturnToDashboard={() => setCurrentTab('dashboard')} />
        )}

        {currentTab === 'analytics' && (
          <ProgressDashboard />
        )}
      </main>

      {/* Footer Editorial Branding */}
      <footer className="hidden md:block border-t border-neutral-800/60 py-6 mt-12 text-xs font-mono text-neutral-500 dark:border-neutral-800 light:border-neutral-200">
        <div className="mx-auto max-w-5xl px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-400">CYBERQUIZ</span>
            <span>·</span>
            <span>SANDBOX DE PESQUISA & DEFESA</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentTab('leaderboard')} 
              className="hover:text-neutral-300 transition-colors"
            >
              Ranking
            </button>
            <button 
              onClick={() => setCurrentTab('analytics')} 
              className="hover:text-neutral-300 transition-colors"
            >
              Telemetria
            </button>
            <button 
              onClick={() => setIsSyncOpen(true)} 
              className="hover:text-neutral-300 transition-colors"
            >
              Sincronização em Nuvem
            </button>
            <button 
              onClick={() => setIsOnboardingOpen(true)} 
              className="hover:text-neutral-300 transition-colors"
            >
              Rever Onboarding
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenMentor={() => {
          setMentorContext({});
          setIsMentorOpen(true);
        }}
      />

      {/* Modals & Dialogs */}
      <CyberMentorModal
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        initialTopic={mentorContext.topic}
        initialContext={mentorContext.question}
      />

      <StudyMeetModal
        isOpen={isMeetOpen}
        onClose={() => setIsMeetOpen(false)}
      />

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />

      <MultiDeviceSyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
      />

      <FirstAccessModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Global Real-time Achievement Toast Notification Hook */}
      <AchievementToast />

    </div>
  );
}
