import React from 'react';
import { 
  Home, 
  BookOpen, 
  Terminal, 
  Flag, 
  Trophy, 
  Sparkles,
  Database
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: any) => void;
  onOpenMentor: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenMentor,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'learn', label: 'Aprender', icon: BookOpen },
    { id: 'labs', label: 'Labs', icon: Terminal },
    { id: 'database', label: 'Defesa DB', icon: Database },
    { id: 'leaderboard', label: 'Ranking', icon: Trophy },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-md px-2 py-1 light:border-neutral-200 light:bg-white/95">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${
                isActive 
                  ? 'text-white font-semibold light:text-neutral-950' 
                  : 'text-neutral-400 light:text-neutral-500'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400 light:text-emerald-600' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
        <button
          onClick={onOpenMentor}
          className="flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium text-emerald-400 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>Mentor</span>
        </button>
      </div>
    </nav>
  );
};
