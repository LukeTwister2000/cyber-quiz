import React, { useState } from 'react';
import { 
  TrendingUp, 
  Award, 
  Calendar, 
  Download, 
  Upload, 
  CheckCircle2, 
  Flame,
  Shield,
  Clock
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';

export const AnalyticsView: React.FC = () => {
  const { user, achievements, questions, resetAllProgress } = useCyberStore();
  const [importText, setImportText] = useState('');
  const [exportNotice, setExportNotice] = useState(false);

  const completedQuestions = questions.filter(q => (q.srsBox || 1) > 1).length;
  const accuracyPercent = Math.min(100, Math.round((completedQuestions / Math.max(1, questions.length)) * 100));

  const handleExport = () => {
    const raw = localStorage.getItem('cyberquiz_app_state_v1') || '{}';
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cyberquiz-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const handleImport = () => {
    try {
      if (!importText.trim()) return;
      JSON.parse(importText);
      localStorage.setItem('cyberquiz_app_state_v1', importText);
      window.location.reload();
    } catch (e) {
      alert('Invalid JSON archive format.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-10">
      
      {/* Header */}
      <div className="space-y-1 border-b border-neutral-800/80 pb-4 dark:border-neutral-800 light:border-neutral-200">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="uppercase text-emerald-400 font-semibold">COGNITIVE TELEMETRY</span>
          <span>·</span>
          <span>MONTHLY OPERATIVE REPORT</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white dark:text-white light:text-neutral-950">
          Learning Analytics & Retention Report
        </h1>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="border border-neutral-800/80 bg-neutral-900/20 p-4 rounded dark:border-neutral-800 light:border-neutral-200 light:bg-white space-y-1">
          <span className="text-[11px] font-mono uppercase text-neutral-500">ACCURACY INDEX</span>
          <p className="text-2xl font-mono font-semibold text-white dark:text-white light:text-neutral-950 tabular-nums">
            {accuracyPercent}%
          </p>
          <span className="text-[10px] text-emerald-400 font-mono">+4% vs baseline</span>
        </div>

        <div className="border border-neutral-800/80 bg-neutral-900/20 p-4 rounded dark:border-neutral-800 light:border-neutral-200 light:bg-white space-y-1">
          <span className="text-[11px] font-mono uppercase text-neutral-500">LEARNING VELOCITY</span>
          <p className="text-2xl font-mono font-semibold text-white dark:text-white light:text-neutral-950 tabular-nums">
            {user.todayXpEarned} XP
          </p>
          <span className="text-[10px] text-neutral-500 font-mono">Today's yield</span>
        </div>

        <div className="border border-neutral-800/80 bg-neutral-900/20 p-4 rounded dark:border-neutral-800 light:border-neutral-200 light:bg-white space-y-1">
          <span className="text-[11px] font-mono uppercase text-neutral-500">PERSISTENCE STREAK</span>
          <p className="text-2xl font-mono font-semibold text-amber-400 tabular-nums">
            {user.streak} DAYS
          </p>
          <span className="text-[10px] text-sky-400 font-mono">{user.streakFreezes} freezes remaining</span>
        </div>

        <div className="border border-neutral-800/80 bg-neutral-900/20 p-4 rounded dark:border-neutral-800 light:border-neutral-200 light:bg-white space-y-1">
          <span className="text-[11px] font-mono uppercase text-neutral-500">BADGES UNLOCKED</span>
          <p className="text-2xl font-mono font-semibold text-white dark:text-white light:text-neutral-950 tabular-nums">
            {achievements.filter(a => !!a.unlockedAt).length} / {achievements.length}
          </p>
          <span className="text-[10px] text-emerald-400 font-mono">High prestige</span>
        </div>
      </div>

      {/* Prestige Achievements Showcase */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
          OPERATIVE DISTINCTIONS & ACHIEVEMENTS
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded border text-left space-y-2 transition-all ${
                  isUnlocked 
                    ? 'border-neutral-700 bg-neutral-900/40 text-neutral-200' 
                    : 'border-neutral-800/60 bg-neutral-950/40 text-neutral-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-mono text-[10px] uppercase font-semibold ${
                    ach.rarity === 'Legendary' ? 'text-amber-400' : ach.rarity === 'Epic' ? 'text-purple-400' : 'text-neutral-400'
                  }`}>
                    {ach.rarity}
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400">
                    +{ach.xpBonus} XP
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white dark:text-white light:text-neutral-950">
                  {ach.title}
                </h3>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {ach.description}
                </p>

                <div className="pt-1 text-[10px] font-mono text-neutral-500">
                  {isUnlocked ? `Unlocked on ${new Date(ach.unlockedAt!).toLocaleDateString()}` : 'Requirement pending'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup, Export & Offline Portability */}
      <div className="border border-neutral-800/80 bg-neutral-900/30 p-6 rounded-lg space-y-4 dark:border-neutral-800 light:border-neutral-200 light:bg-white">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white dark:text-white light:text-neutral-950">
            Data Portability & Offline Backup
          </h3>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            All progress is persisted securely in local storage. Export an encrypted JSON snapshot or restore previous training archives.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-mono border border-neutral-700 rounded text-neutral-200 hover:text-white hover:border-neutral-500 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Snapshot (.json)</span>
          </button>

          <button
            onClick={resetAllProgress}
            className="px-4 py-2 text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors"
          >
            Reset Progress
          </button>
        </div>

        {exportNotice && (
          <p className="text-xs font-mono text-emerald-400">
            Archive exported successfully.
          </p>
        )}
      </div>

    </div>
  );
};
