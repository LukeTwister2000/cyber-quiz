import React, { useState } from 'react';
import { 
  Award, 
  Terminal, 
  Flame, 
  ShieldAlert, 
  Brain, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  X,
  Network
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';
import { Achievement } from '../../types';

export const AchievementToast: React.FC = () => {
  const { activeAchievementToast, dismissAchievementToast } = useCyberStore();

  if (!activeAchievementToast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="border border-emerald-500/80 bg-neutral-950/95 backdrop-blur-md p-4 rounded-lg shadow-2xl flex items-start gap-4 max-w-sm dark:bg-neutral-950/95 light:bg-white light:border-emerald-600">
        <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 shrink-0">
          <Award className="h-6 w-6" />
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              CONQUISTA DESBLOQUEADA
            </span>
            <button 
              onClick={dismissAchievementToast}
              className="text-neutral-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <h4 className="text-sm font-semibold text-white dark:text-white light:text-neutral-950">
            {activeAchievementToast.title}
          </h4>

          <p className="text-xs text-neutral-400 light:text-neutral-600 leading-relaxed">
            {activeAchievementToast.description}
          </p>

          <div className="pt-1 flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span>+{activeAchievementToast.xpBonus} XP de Bônus</span>
            <span>·</span>
            <span className="uppercase text-[10px] text-neutral-400">{activeAchievementToast.rarity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AchievementComponent: React.FC = () => {
  const { achievements, user } = useCyberStore();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return Terminal;
      case 'Network': return Network;
      case 'Flame': return Flame;
      case 'ShieldAlert': return ShieldAlert;
      case 'Brain': return Brain;
      default: return Award;
    }
  };

  const filteredAchievements = achievements.filter(ach => {
    if (filter === 'unlocked') return !!ach.unlockedAt;
    if (filter === 'locked') return !ach.unlockedAt;
    return true;
  });

  const unlockedCount = achievements.filter(a => !!a.unlockedAt).length;

  const filterLabels: Record<'all' | 'unlocked' | 'locked', string> = {
    all: 'Todas',
    unlocked: 'Desbloqueadas',
    locked: 'Bloqueadas',
  };

  return (
    <div className="space-y-6">
      
      {/* Linha de Resumo Geral */}
      <div className="border border-neutral-800/80 bg-neutral-900/30 p-5 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/30 light:border-neutral-200 light:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="text-emerald-400 uppercase font-semibold">MARCOS DE PRESTÍGIO</span>
            <span>·</span>
            <span>REGISTRO DE SERVIÇO DO OPERADOR</span>
          </div>
          <h2 className="text-base font-semibold text-white dark:text-white light:text-neutral-950">
            {unlockedCount} de {achievements.length} Insígnias Conquistadas
          </h2>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Conquiste insígnias de alto prestígio através de sequências diárias, triagem de CTFs e maestria aprofundada dos módulos.
          </p>
        </div>

        {/* Controles de Filtro */}
        <div className="flex items-center gap-2">
          {(['all', 'unlocked', 'locked'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded font-mono text-xs transition-colors ${
                filter === tab 
                  ? 'bg-neutral-800 text-white font-medium dark:bg-neutral-800 light:bg-neutral-200 light:text-neutral-950' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {filterLabels[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Grade de Insígnias */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((ach) => {
          const isUnlocked = !!ach.unlockedAt;
          const Icon = getIcon(ach.icon);

          const rarityColor = 
            ach.rarity === 'Legendary' ? 'text-amber-400 border-amber-500/40 bg-amber-950/20' :
            ach.rarity === 'Epic' ? 'text-purple-400 border-purple-500/40 bg-purple-950/20' :
            ach.rarity === 'Rare' ? 'text-sky-400 border-sky-500/40 bg-sky-950/20' :
            'text-neutral-300 border-neutral-700 bg-neutral-900/40';

          const progressVal = ach.progress || 0;
          const targetVal = ach.target || 1;
          const progressPercent = Math.min(100, Math.round((progressVal / targetVal) * 100));

          return (
            <div
              key={ach.id}
              className={`p-5 rounded border transition-all flex flex-col justify-between space-y-4 ${
                isUnlocked 
                  ? 'border-neutral-700 bg-neutral-900/30 text-white dark:border-neutral-700 dark:bg-neutral-900/30 light:border-neutral-300 light:bg-white light:text-neutral-950' 
                  : 'border-neutral-800/60 bg-neutral-950/40 text-neutral-500 dark:border-neutral-800/60 light:border-neutral-200 light:bg-neutral-50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-semibold uppercase ${rarityColor}`}>
                    {ach.rarity}
                  </span>
                  <span className="font-mono text-emerald-400 text-xs">
                    +{ach.xpBonus} XP
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded border shrink-0 ${
                    isUnlocked 
                      ? 'border-neutral-700 bg-neutral-800 text-emerald-400' 
                      : 'border-neutral-800 bg-neutral-900 text-neutral-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white dark:text-white light:text-neutral-950">
                      {ach.title}
                    </h3>
                    <p className="text-xs text-neutral-400 light:text-neutral-600 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Barra de Progresso & Status */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-800/60 dark:border-neutral-800 light:border-neutral-200">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>{isUnlocked ? 'Desbloqueada' : 'Progresso'}</span>
                  <span>
                    {isUnlocked 
                      ? new Date(ach.unlockedAt!).toLocaleDateString('pt-BR') 
                      : `${progressVal} / ${targetVal} ${ach.unit || ''}`}
                  </span>
                </div>

                {!isUnlocked && (
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
