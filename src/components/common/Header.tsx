import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Users, 
  Calendar, 
  Sun, 
  Moon, 
  ShieldCheck,
  Terminal,
  Activity
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: any) => void;
  onOpenMentor: () => void;
  onOpenMeet: () => void;
  onOpenCalendar: () => void;
  onOpenSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenMentor,
  onOpenMeet,
  onOpenCalendar,
  onOpenSync,
}) => {
  const { user, theme, toggleTheme, isOnline, syncState } = useCyberStore();

  const navItems = [
    { id: 'dashboard', label: 'Painel' },
    { id: 'learn', label: 'Aprender' },
    { id: 'labs', label: 'Laboratórios' },
    { id: 'database', label: 'Defesa DB' },
    { id: 'ctf', label: 'CTF' },
    { id: 'leaderboard', label: 'Ranking' },
    { id: 'skills', label: 'Habilidades' },
    { id: 'boss', label: 'Incidente Boss' },
    { id: 'analytics', label: 'Telemetria' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md transition-colors dark:border-neutral-800 dark:bg-neutral-950/90 light:border-neutral-200 light:bg-white/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onSelectTab('dashboard')}
            className="group flex items-center gap-2 text-left focus:outline-none"
          >
            <span className="font-mono text-base font-bold tracking-tight text-white dark:text-white light:text-neutral-900">
              CYBERQUIZ
            </span>
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400 light:text-neutral-600">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative py-1 text-xs uppercase tracking-wider transition-colors hover:text-white dark:hover:text-white light:hover:text-neutral-900 ${
                    isActive 
                      ? 'text-white dark:text-white light:text-neutral-950 font-semibold' 
                      : 'text-neutral-400 light:text-neutral-500'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-200 light:bg-neutral-900" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Zone 3: 1-2 primary actions and user telemetry context */}
        <div className="flex items-center gap-3">
          
          {/* Quick study streak display */}
          <div 
            title={`${user.streak} day streak. ${user.streakFreezes} streak freezes remaining.`}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-400/90 dark:text-amber-400 light:text-amber-600"
          >
            <Flame className="h-3.5 w-3.5 fill-amber-400/20 text-amber-400" />
            <span className="font-mono font-medium">{user.streak}d</span>
          </div>

          {/* Level / XP display */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400 light:text-neutral-600">
            <span className="font-mono font-medium text-neutral-200 dark:text-neutral-200 light:text-neutral-900">
              LVL {user.level}
            </span>
            <span className="text-neutral-600">·</span>
            <span className="font-mono text-neutral-400 tabular-nums">
              {user.xp.toLocaleString()} XP
            </span>
          </div>

          <div className="h-4 w-px bg-neutral-800 dark:bg-neutral-800 light:bg-neutral-300 hidden sm:block" />

          {/* Interactive Study Meet Launcher */}
          <button
            onClick={onOpenMeet}
            title="Iniciar Sala de Estudos Colaborativa"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-neutral-700/60 bg-neutral-900/60 text-neutral-200 hover:border-neutral-500 hover:text-white dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 light:border-neutral-300 light:bg-neutral-100 light:text-neutral-800 transition-colors"
          >
            <Users className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline">Sala de Estudos</span>
          </button>

          {/* AI Mentor Trigger */}
          <button
            onClick={onOpenMentor}
            title="Consultar Cyber Mentor IA"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-neutral-700/60 bg-neutral-900/60 text-neutral-200 hover:border-neutral-500 hover:text-white dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 light:border-neutral-300 light:bg-neutral-100 light:text-neutral-800 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Cyber Mentor</span>
          </button>

          {/* Multi-Device Cloud Sync & Offline Status */}
          {onOpenSync && (
            <button
              onClick={onOpenSync}
              title={isOnline ? `Nuvem Segura: ${syncState.toUpperCase()}` : 'Modo Offline (Armazenamento Local)'}
              aria-label="Sincronização em nuvem"
              className="flex items-center gap-1 p-1.5 text-neutral-400 hover:text-white dark:hover:text-white light:hover:text-neutral-900 transition-colors"
            >
              <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="hidden lg:inline text-[10px] font-mono text-neutral-400">
                {isOnline ? 'SYNC' : 'OFFLINE'}
              </span>
            </button>
          )}

          {/* External Calendar Launcher */}
          <button
            onClick={onOpenCalendar}
            title="Sincronizar com Calendário"
            aria-label="Sincronização de calendário"
            className="p-1.5 text-neutral-400 hover:text-white dark:hover:text-white light:hover:text-neutral-900 transition-colors"
          >
            <Calendar className="h-4 w-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            aria-label="Alternar tema"
            className="p-1.5 text-neutral-400 hover:text-white dark:hover:text-white light:hover:text-neutral-900 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
