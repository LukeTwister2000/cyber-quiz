import React from 'react';
import { 
  ArrowRight, 
  Flame, 
  Shield, 
  Terminal, 
  Flag, 
  Brain, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Snowflake,
  Database
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';

interface DashboardProps {
  onStartQuiz: () => void;
  onOpenLab: (labId?: string) => void;
  onOpenCtf: (ctfId?: string) => void;
  onOpenSkills: () => void;
  onOpenBoss: () => void;
  onOpenMentor: () => void;
  onOpenLeaderboard?: () => void;
  onOpenTelemetry?: () => void;
  onOpenDatabase?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartQuiz,
  onOpenLab,
  onOpenCtf,
  onOpenSkills,
  onOpenBoss,
  onOpenMentor,
  onOpenLeaderboard,
  onOpenTelemetry,
  onOpenDatabase,
}) => {
  const { 
    user, 
    questions, 
    labs, 
    ctfs, 
    achievements, 
    bossCompleted,
    buyStreakFreeze 
  } = useCyberStore();

  // Métricas de progresso das disciplinas fundamentais
  const categories = [
    { id: 'networking', name: 'Fundamentos de Redes', total: 3, done: questions.filter(q => q.moduleId === 'networking' && (q.srsBox || 1) > 1).length, percent: 72 },
    { id: 'linux', name: 'Segurança & Linux', total: 2, done: questions.filter(q => q.moduleId === 'linux' && (q.srsBox || 1) > 1).length, percent: 81 },
    { id: 'web_security', name: 'Segurança Web', total: 2, done: questions.filter(q => q.moduleId === 'web_security' && (q.srsBox || 1) > 1).length, percent: 45 },
    { id: 'cryptography', name: 'Criptografia', total: 1, done: questions.filter(q => q.moduleId === 'cryptography' && (q.srsBox || 1) > 1).length, percent: 33 },
  ];

  // Helper de barra de progresso em texto discreto
  const renderAsciiBar = (percent: number) => {
    const filledBlocks = Math.round((percent / 100) * 10);
    const emptyBlocks = 10 - filledBlocks;
    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-12">
      
      {/* Cabeçalho Editorial Hero */}
      <section className="relative overflow-hidden border border-neutral-800/80 bg-neutral-900/40 p-6 sm:p-10 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/40 light:border-neutral-200 light:bg-neutral-50/80">
        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-neutral-400 light:text-neutral-500 uppercase">
              <span>AMBIENTE DA ACADEMIA</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 light:text-emerald-600">SANDBOX VERIFICADO</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white dark:text-white light:text-neutral-950 text-balance">
              CIBERSEGURANÇA É UMA HABILIDADE PRÁTICA.
            </h1>
            
            <p className="text-sm sm:text-base leading-relaxed text-neutral-400 light:text-neutral-600 max-w-xl">
              Entenda como sistemas funcionam. Compreenda como eles falham. Aprenda como protegê-los. Domine fundamentos ofensivos e defensivos através da prática deliberada.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartQuiz}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:text-neutral-950 dark:bg-white dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white light:hover:bg-neutral-800"
              >
                <span>Começar Treinamento</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={onOpenSkills}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded transition-colors dark:border-neutral-800 dark:text-neutral-300 light:border-neutral-300 light:text-neutral-700"
              >
                <span>Explorar Habilidades</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 hidden sm:block">
            <div className="relative aspect-video overflow-hidden rounded border border-neutral-800/80 dark:border-neutral-800 light:border-neutral-200">
              <img 
                src="/src/assets/images/cyberquiz_hero_defense_1790205476324.jpg" 
                alt="Mapa Arquitetural de Cibersegurança"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-3 text-[11px] font-mono text-neutral-400">
                TELEMETRIA DE LAB ATIVO · ENCLAVE 01
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Linha de Status do Operador */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 border-y border-neutral-800/80 py-4 dark:border-neutral-800 light:border-neutral-200">
        <div>
          <span className="text-[11px] font-mono uppercase text-neutral-500 light:text-neutral-400">OPERADOR</span>
          <p className="text-sm font-semibold text-neutral-200 dark:text-neutral-200 light:text-neutral-900 truncate">
            {user.codename}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase text-neutral-500 light:text-neutral-400">PATENTE & NÍVEL</span>
          <p className="text-sm font-semibold text-neutral-200 dark:text-neutral-200 light:text-neutral-900 truncate">
            {user.rank}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase text-neutral-500 light:text-neutral-400">EXPERIÊNCIA TOTAL</span>
          <p className="text-sm font-mono font-semibold text-neutral-200 dark:text-neutral-200 light:text-neutral-900 tabular-nums">
            {user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP
          </p>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase text-neutral-500 light:text-neutral-400">SEQUÊNCIA ATIVA</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-semibold text-amber-400 tabular-nums">
              {user.streak} DIAS
            </span>
            {user.streakFreezes > 0 && (
              <span 
                title={`${user.streakFreezes} escudos de proteção de sequência disponíveis`}
                className="text-[11px] font-mono text-sky-400 flex items-center gap-0.5"
              >
                <Snowflake className="h-3 w-3" />
                {user.streakFreezes}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Seção: CONTINUAR APRENDIZADO */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2 dark:border-neutral-800 light:border-neutral-200">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 light:text-neutral-600">
            CONTINUAR APRENDIZADO
          </h2>
          <span className="text-xs font-mono text-neutral-500">
            MISSÃO RECOMENDADA
          </span>
        </div>

        <div className="border border-neutral-800/80 bg-neutral-900/30 p-5 rounded-lg hover:border-neutral-700 transition-colors dark:border-neutral-800 dark:bg-neutral-900/30 light:border-neutral-200 light:bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-neutral-500 light:text-neutral-400">
              <span className="font-mono text-emerald-400 light:text-emerald-600">TRILHA PRINCIPAL</span>
              <span>·</span>
              <span>Resolução de Rede & Sistemas</span>
              <span>·</span>
              <span className="font-mono">+120 XP</span>
            </div>
            <h3 className="text-lg font-semibold text-white dark:text-white light:text-neutral-950">
              Resolução de DNS & Verificação de Transporte
            </h3>
            <p className="text-xs text-neutral-400 light:text-neutral-600 max-w-xl">
              Investigue anomalias de alcance de estações, analise capturas de pacotes e verifique o comportamento da Camada 4 vs Camada 7 sob degradação ativa de DNS.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onStartQuiz}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wide uppercase text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white"
            >
              <span>Retomar Questão</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onOpenLab('lab-net-recon')}
              className="px-3 py-2 text-xs font-mono border border-neutral-800 text-neutral-300 hover:text-white rounded transition-colors dark:border-neutral-800 light:border-neutral-300 light:text-neutral-700"
            >
              Abrir Terminal Lab
            </button>
          </div>
        </div>
      </section>

      {/* Seção: SEU PROGRESSO */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2 dark:border-neutral-800 light:border-neutral-200">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 light:text-neutral-600">
            SEU PROGRESSO
          </h2>
          <button 
            onClick={onOpenSkills}
            className="text-xs text-neutral-400 hover:text-white light:text-neutral-600 light:hover:text-neutral-900 transition-colors flex items-center gap-1"
          >
            <span>Ver Árvore de Habilidades</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="border border-neutral-800/80 bg-neutral-900/20 p-4 rounded dark:border-neutral-800 dark:bg-neutral-900/20 light:border-neutral-200 light:bg-white space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-200 dark:text-neutral-200 light:text-neutral-900">
                  {cat.name}
                </span>
                <span className="font-mono text-neutral-400 light:text-neutral-500 tabular-nums">
                  {cat.percent}%
                </span>
              </div>
              <div className="font-mono text-xs tracking-wider text-emerald-400/90 light:text-emerald-600">
                {renderAsciiBar(cat.percent)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seção: ATIVIDADE RECENTE & RECOMENDADO PARA VOCÊ */}
      <div className="grid gap-8 md:grid-cols-12">
        
        {/* Coluna Esquerda: Atividade Recente */}
        <section className="md:col-span-7 space-y-4">
          <div className="border-b border-neutral-800/60 pb-2 dark:border-neutral-800 light:border-neutral-200">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 light:text-neutral-600">
              ATIVIDADE RECENTE
            </h2>
          </div>

          <div className="divide-y divide-neutral-800/60 border border-neutral-800/80 bg-neutral-900/20 rounded dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/20 light:divide-neutral-200 light:border-neutral-200 light:bg-white">
            <div className="p-3.5 flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <p className="font-medium text-neutral-200 dark:text-neutral-200 light:text-neutral-900">
                  Resolvido: Escalação de Privilégios Linux & Avaliação de SUID
                </p>
                <p className="text-neutral-400 light:text-neutral-500">
                  Agendado para Repetição Espaçada · Caixa 2 (+140 XP)
                </p>
              </div>
            </div>

            <div className="p-3.5 flex items-start gap-3">
              <Terminal className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <p className="font-medium text-neutral-200 dark:text-neutral-200 light:text-neutral-900">
                  Terminal CLI: Flag de Autorização de Primeiro Acesso Capturada
                </p>
                <p className="text-neutral-400 light:text-neutral-500">
                  Nó desbloqueado: Sistemas Linux & POSIX
                </p>
              </div>
            </div>

            <div className="p-3.5 flex items-start gap-3">
              <Flag className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <p className="font-medium text-neutral-200 dark:text-neutral-200 light:text-neutral-900">
                  Briefing de CTF Inspecionado: Operação Black Ice
                </p>
                <p className="text-neutral-400 light:text-neutral-500">
                  Telemetria extraída do arquivo de auditoria auth.log
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Coluna Direita: Recomendado Para Você */}
        <section className="md:col-span-5 space-y-4">
          <div className="border-b border-neutral-800/60 pb-2 dark:border-neutral-800 light:border-neutral-200">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 light:text-neutral-600">
              RECOMENDADO PARA VOCÊ
            </h2>
          </div>

          <div className="space-y-3">
            
            {/* Novo Lab de Defesa de Banco de Dados */}
            {onOpenDatabase && (
              <div 
                onClick={onOpenDatabase}
                className="group cursor-pointer border border-rose-900/60 bg-rose-950/20 p-4 rounded hover:border-rose-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-mono text-rose-400 font-bold">WAR ROOM: DEFESA DE DB</span>
                  <span className="text-emerald-400 font-mono">+250 XP</span>
                </div>
                <p className="text-sm font-medium text-white mt-1 group-hover:text-rose-300 transition-colors">
                  Defesa Contra Invasores em Tempo Real
                </p>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                  Proteja tabelas com senhas e dados confidenciais contra injeções SQL e invasores ativos.
                </p>
              </div>
            )}

            {/* Recomendação de CTF */}
            <div 
              onClick={() => onOpenCtf('ctf-black-ice')}
              className="group cursor-pointer border border-neutral-800/80 bg-neutral-900/20 p-4 rounded hover:border-neutral-700 transition-colors dark:border-neutral-800 dark:bg-neutral-900/20 light:border-neutral-200 light:bg-white"
            >
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-mono text-amber-400">OPERAÇÃO: BLACK ICE</span>
                <span>30 MIN</span>
              </div>
              <p className="text-sm font-medium text-neutral-200 dark:text-neutral-200 light:text-neutral-900 mt-1 group-hover:text-emerald-400 transition-colors">
                Resposta a Incidentes & Pivot via SSH
              </p>
              <p className="text-xs text-neutral-400 light:text-neutral-500 mt-1 line-clamp-2">
                Rastreie a origem do ataque de força bruta e recupere o beacon de exfiltração.
              </p>
            </div>

            {/* Incidente Boss */}
            <div 
              onClick={onOpenBoss}
              className="group cursor-pointer border border-neutral-800/80 bg-neutral-900/20 p-4 rounded hover:border-neutral-700 transition-colors dark:border-neutral-800 dark:bg-neutral-900/20 light:border-neutral-200 light:bg-white"
            >
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-mono text-rose-400">INCIDENTE BOSS</span>
                <span className="text-emerald-400 font-mono">+300 XP</span>
              </div>
              <p className="text-sm font-medium text-neutral-200 dark:text-neutral-200 light:text-neutral-900 mt-1 group-hover:text-emerald-400 transition-colors">
                Incidente 402: A Interceptação Silenciosa
              </p>
              <p className="text-xs text-neutral-400 light:text-neutral-500 mt-1 line-clamp-2">
                Diagnostique envenenamento de cache ARP ativo e aplique Dynamic ARP Inspection.
              </p>
            </div>

            {/* Ranking */}
            {onOpenLeaderboard && (
              <div 
                onClick={onOpenLeaderboard}
                className="cursor-pointer border border-neutral-800/80 bg-neutral-900/30 p-3.5 rounded flex items-center justify-between hover:border-neutral-600 transition-colors dark:border-neutral-800 light:border-neutral-200 light:bg-white"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <div className="text-xs">
                    <span className="font-semibold text-white dark:text-white light:text-neutral-950 block">
                      Classificação da Liga Operacional
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Posição #{user.xp > 3000 ? 2 : 4} no Enclave da Academia
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-500" />
              </div>
            )}

            {/* Telemetria de Evolução */}
            {onOpenTelemetry && (
              <div 
                onClick={onOpenTelemetry}
                className="cursor-pointer border border-neutral-800/80 bg-neutral-900/30 p-3.5 rounded flex items-center justify-between hover:border-neutral-600 transition-colors dark:border-neutral-800 light:border-neutral-200 light:bg-white"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <div className="text-xs">
                    <span className="font-semibold text-white dark:text-white light:text-neutral-950 block">
                      Auditoria de Evolução & Telemetria
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Gráficos interativos & relatório mensal de retenção
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-500" />
              </div>
            )}

            {/* Cyber Mentor */}
            <div 
              onClick={onOpenMentor}
              className="cursor-pointer border border-dashed border-neutral-700/80 bg-neutral-900/30 p-3.5 rounded flex items-center justify-between hover:border-neutral-500 transition-colors dark:border-neutral-800 light:border-neutral-300 light:bg-neutral-50"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-800">
                  Tirar dúvidas com o Cyber Mentor IA
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-500" />
            </div>

          </div>
        </section>

      </div>

    </div>
  );
};
