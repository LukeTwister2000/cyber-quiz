import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Flame, 
  ShieldCheck, 
  Award, 
  Users, 
  Globe, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';
import { LeaderboardUser } from '../../types';

interface LeaderboardProps {
  onOpenProfile?: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = () => {
  const { user, achievements } = useCyberStore();
  const [filter, setFilter] = useState<'global' | 'weekly' | 'enclave'>('global');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [seasonInfo, setSeasonInfo] = useState<{ season: string; endsInDays: number }>({
    season: 'Temporada 4: Enclave Zero Trust',
    endsInDays: 14,
  });

  useEffect(() => {
    fetchLeaderboard();
  }, [user.xp]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setSeasonInfo({
          season: data.season || 'Temporada 4: Enclave Zero Trust',
          endsInDays: data.endsInDays || 14,
        });

        // Inserir usuário atual dinamicamente no ranking da coorte baseado no XP
        const baseCohort: LeaderboardUser[] = data.cohort;
        const currentUserEntry: LeaderboardUser = {
          id: 'user-current',
          rank: 0,
          name: `${user.name} (Você)`,
          codename: user.codename,
          avatar: user.avatar,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          rankTitle: user.rank,
          change: 'same',
          badgesCount: achievements.filter(a => !!a.unlockedAt).length,
          countryCode: 'BR',
          isCurrentUser: true,
        };

        const combined = [...baseCohort.filter(u => u.codename !== user.codename), currentUserEntry]
          .sort((a, b) => b.xp - a.xp)
          .map((u, index) => ({
            ...u,
            rank: index + 1,
          }));

        setLeaderboardData(combined);
      }
    } catch (e) {
      console.warn('Erro ao carregar leaderboard, usando coorte local', e);
    }
  };

  const currentUserRank = leaderboardData.find(u => u.isCurrentUser)?.rank || 4;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      
      {/* Cabeçalho & Info da Temporada */}
      <div className="border border-neutral-800/80 bg-neutral-900/30 p-6 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/30 light:border-neutral-200 light:bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="text-amber-400 font-semibold uppercase">{seasonInfo.season}</span>
            <span>·</span>
            <span>CLASSIFICAÇÃO DA LIGA</span>
            <span>·</span>
            <span className="text-neutral-500 font-mono">{seasonInfo.endsInDays} DIAS RESTANTES</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white dark:text-white light:text-neutral-950">
            Classificação dos Operadores da Academia
          </h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Classificação calibrada por flags verificadas em labs, resolução de incidentes CTF e sequências diárias de retenção.
          </p>
        </div>

        {/* Resumo do Usuário Atual */}
        <div className="border border-neutral-800 bg-neutral-950 p-4 rounded text-xs space-y-1 shrink-0 dark:border-neutral-800 light:border-neutral-300 light:bg-neutral-50">
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">SUA POSIÇÃO ATUAL</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xl font-bold text-emerald-400">
              #{currentUserRank}
            </span>
            <div>
              <span className="font-mono font-semibold text-white dark:text-white light:text-neutral-950 block">
                {user.codename}
              </span>
              <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                {user.xp.toLocaleString()} XP · {user.streak}d de sequência
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Abas de Filtro */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 text-xs dark:border-neutral-800 light:border-neutral-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('global')}
            className={`px-3 py-1.5 rounded font-mono transition-colors ${
              filter === 'global' 
                ? 'bg-neutral-800 text-white font-medium dark:bg-neutral-800 light:bg-neutral-200 light:text-neutral-950' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Coorte Global
          </button>
          <button
            onClick={() => setFilter('weekly')}
            className={`px-3 py-1.5 rounded font-mono transition-colors ${
              filter === 'weekly' 
                ? 'bg-neutral-800 text-white font-medium dark:bg-neutral-800 light:bg-neutral-200 light:text-neutral-950' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sprint Semanal
          </button>
          <button
            onClick={() => setFilter('enclave')}
            className={`px-3 py-1.5 rounded font-mono transition-colors ${
              filter === 'enclave' 
                ? 'bg-neutral-800 text-white font-medium dark:bg-neutral-800 light:bg-neutral-200 light:text-neutral-950' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Meu Nível de Enclave
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1 font-mono text-xs text-neutral-500">
          <Globe className="h-3.5 w-3.5" />
          <span>Sincronização em Tempo Real Ativa</span>
        </div>
      </div>

      {/* Tabela da Leaderboard */}
      <div className="rounded border border-neutral-800/80 bg-neutral-900/20 overflow-hidden dark:border-neutral-800 dark:bg-neutral-900/20 light:border-neutral-200 light:bg-white">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-neutral-800/80 text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:border-neutral-800 light:border-neutral-200">
          <div className="col-span-1">Pos</div>
          <div className="col-span-5 sm:col-span-4">Operador</div>
          <div className="col-span-3 sm:col-span-3 hidden sm:block">Especialização</div>
          <div className="col-span-3 sm:col-span-2 text-center">Sequência</div>
          <div className="col-span-3 sm:col-span-2 text-right">XP Total</div>
        </div>

        <div className="divide-y divide-neutral-800/60 dark:divide-neutral-800 light:divide-neutral-200">
          {leaderboardData.map((operative) => {
            const rankColor = operative.rank === 1 
              ? 'text-amber-400' 
              : operative.rank === 2 
              ? 'text-neutral-300' 
              : operative.rank === 3 
              ? 'text-amber-600' 
              : 'text-neutral-500';

            return (
              <div
                key={operative.id}
                className={`grid grid-cols-12 items-center px-5 py-3.5 text-xs transition-colors ${
                  operative.isCurrentUser 
                    ? 'bg-emerald-950/20 border-l-2 border-emerald-500 dark:bg-emerald-950/20 light:bg-emerald-50/60' 
                    : 'hover:bg-neutral-900/40 dark:hover:bg-neutral-900/40 light:hover:bg-neutral-50'
                }`}
              >
                {/* Posição & Movimento */}
                <div className="col-span-1 flex items-center gap-1.5 font-mono">
                  <span className={`font-bold ${rankColor}`}>
                    {String(operative.rank).padStart(2, '0')}
                  </span>
                  {operative.change === 'up' && (
                    <TrendingUp className="h-3 w-3 text-emerald-400 hidden sm:inline" />
                  )}
                  {operative.change === 'down' && (
                    <TrendingDown className="h-3 w-3 text-rose-400 hidden sm:inline" />
                  )}
                  {operative.change === 'same' && (
                    <Minus className="h-3 w-3 text-neutral-600 hidden sm:inline" />
                  )}
                </div>

                {/* Info do Operador */}
                <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono font-semibold text-neutral-300 text-xs shrink-0">
                    {operative.avatar}
                  </div>
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white dark:text-white light:text-neutral-950 truncate">
                        {operative.codename}
                      </span>
                      {operative.isCurrentUser && (
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold px-1 rounded bg-emerald-950/60 border border-emerald-800/60">
                          VOCÊ
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-500 block truncate">
                      {operative.name}
                    </span>
                  </div>
                </div>

                {/* Título de Patente */}
                <div className="col-span-3 sm:col-span-3 hidden sm:block text-xs font-mono text-neutral-400 light:text-neutral-600 truncate">
                  {operative.rankTitle}
                </div>

                {/* Sequência */}
                <div className="col-span-3 sm:col-span-2 flex items-center justify-center gap-1 text-xs font-mono text-amber-400">
                  <Flame className="h-3.5 w-3.5 fill-amber-400/20 text-amber-400" />
                  <span>{operative.streak}d</span>
                </div>

                {/* XP Total */}
                <div className="col-span-3 sm:col-span-2 text-right font-mono font-semibold text-neutral-200 dark:text-neutral-200 light:text-neutral-900 tabular-nums">
                  {operative.xp.toLocaleString()} XP
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
