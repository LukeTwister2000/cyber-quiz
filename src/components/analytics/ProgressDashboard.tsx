import React, { useState } from 'react';
import { 
  TrendingUp, 
  Award, 
  Calendar, 
  Brain, 
  Shield, 
  ShieldCheck, 
  Flame, 
  FileText, 
  Download, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Printer
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';
import { AchievementComponent } from '../achievements/AchievementComponent';

export const ProgressDashboard: React.FC = () => {
  const { user, questions, skills, ctfs, labs, buyStreakFreeze } = useCyberStore();
  
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [showMonthlyReportModal, setShowMonthlyReportModal] = useState(false);
  const [freezeMessage, setFreezeMessage] = useState<string | null>(null);

  // Dados de velocidade para os gráficos
  const velocity7Days = [
    { label: 'Seg', xp: 45, date: '17 Set' },
    { label: 'Ter', xp: 80, date: '18 Set' },
    { label: 'Qua', xp: 35, date: '19 Set' },
    { label: 'Qui', xp: 110, date: '20 Set' },
    { label: 'Sex', xp: 60, date: '21 Set' },
    { label: 'Sáb', xp: 95, date: '22 Set' },
    { label: 'Dom', xp: user.todayXpEarned || 50, date: '23 Set' },
  ];

  const velocity30Days = [
    { label: 'S1', xp: 320, date: '25 - 31 Ago' },
    { label: 'S2', xp: 480, date: '01 - 07 Set' },
    { label: 'S3', xp: 610, date: '08 - 14 Set' },
    { label: 'S4', xp: user.xp || 750, date: '15 - 23 Set' },
  ];

  const currentChartData = timeRange === '7d' ? velocity7Days : velocity30Days;
  const maxChartXp = Math.max(...currentChartData.map(d => d.xp), 120);

  // Precisão e maestria por domínio
  const domainMastery = [
    { name: 'Redes (L2-L4)', progress: 85, color: 'bg-emerald-400' },
    { name: 'Privilégios Linux & SUID', progress: 70, color: 'bg-sky-400' },
    { name: 'Segurança de Aplicações Web', progress: 60, color: 'bg-amber-400' },
    { name: 'Computação Forense & Triagem', progress: 75, color: 'bg-purple-400' },
    { name: 'Arquitetura Defensiva & SIEM', progress: 50, color: 'bg-rose-400' },
    { name: 'Criptografia & Hashes', progress: 40, color: 'bg-indigo-400' },
  ];

  // Divisão por caixas de repetição espaçada (SRS)
  const box1to2 = questions.filter(q => (q.srsBox || 1) <= 2).length;
  const box3to4 = questions.filter(q => (q.srsBox || 1) === 3 || (q.srsBox || 1) === 4).length;
  const box5 = questions.filter(q => (q.srsBox || 1) >= 5).length;

  const handleBuyFreeze = () => {
    const res = buyStreakFreeze(150);
    setFreezeMessage(res.message);
    setTimeout(() => setFreezeMessage(null), 3500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-10">
      
      {/* Cabeçalho & Ação do Relatório */}
      <div className="border border-neutral-800/80 bg-neutral-900/30 p-6 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/30 light:border-neutral-200 light:bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="uppercase text-emerald-400 font-semibold">ARQUITETURA COGNITIVA</span>
            <span>·</span>
            <span>TELEMETRIA DE PROGRESSO</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white dark:text-white light:text-neutral-950">
            Telemetria de Prática Deliberada
          </h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Acompanhamento empírico de retenção, distribuição de competências e proteção de sequência diária.
          </p>
        </div>

        <button
          onClick={() => setShowMonthlyReportModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white shrink-0"
        >
          <FileText className="h-4 w-4" />
          <span>Gerar Relatório de Evolução Mensal</span>
        </button>
      </div>

      {/* Métricas Resumidas (KPIs) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="border border-neutral-800/80 bg-neutral-900/20 p-4 rounded dark:border-neutral-800 light:border-neutral-200 light:bg-white space-y-1">
          <span className="text-[11px] font-mono uppercase text-neutral-500">ÍNDICE DE RETENÇÃO</span>
          <p className="text-2xl font-mono font-semibold text-emerald-400 tabular-nums">
            92.4%
          </p>
          <span className="text-[10px] text-neutral-500 font-mono">Meta de perda zero</span>
        </div>

        <div className="border border-neutral-800/80 bg-neutral-900/20 p-4 rounded dark:border-neutral-800 light:border-neutral-200 light:bg-white space-y-1">
          <span className="text-[11px] font-mono uppercase text-neutral-500">SEQUÊNCIA DE ESTUDO</span>
          <p className="text-2xl font-mono font-semibold text-amber-400 tabular-nums">
            {user.streak} DIAS
          </p>
          <span className="text-[10px] text-sky-400 font-mono">{user.streakFreezes} escudos ativos</span>
        </div>

        <div className="border border-neutral-800/80 bg-neutral-900/20 p-4 rounded dark:border-neutral-800 light:border-neutral-200 light:bg-white space-y-1">
          <span className="text-[11px] font-mono uppercase text-neutral-500">EXPERIÊNCIA TOTAL</span>
          <p className="text-2xl font-mono font-semibold text-white dark:text-white light:text-neutral-950 tabular-nums">
            {user.xp.toLocaleString()} XP
          </p>
          <span className="text-[10px] text-emerald-400 font-mono">Operador Nível {user.level}</span>
        </div>

        <div className="border border-neutral-800/80 bg-neutral-900/20 p-4 rounded dark:border-neutral-800 light:border-neutral-200 light:bg-white space-y-1">
          <span className="text-[11px] font-mono uppercase text-neutral-500">CONCEITOS DOMINADOS</span>
          <p className="text-2xl font-mono font-semibold text-white dark:text-white light:text-neutral-950 tabular-nums">
            {skills.filter(s => s.mastered).length} / {skills.length}
          </p>
          <span className="text-[10px] text-neutral-500 font-mono">Nós especializados</span>
        </div>
      </div>

      {/* Gráficos Interativos: Velocidade & Domínio */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Coluna Esquerda: Velocidade de XP (7 colunas) */}
        <div className="lg:col-span-7 border border-neutral-800/80 bg-neutral-900/20 p-6 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/20 light:border-neutral-200 light:bg-white space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono uppercase text-neutral-500">VELOCIDADE DE APRENDIZADO</span>
              <h3 className="text-sm font-semibold text-white dark:text-white light:text-neutral-950">
                Taxa de Aquisição de Experiência
              </h3>
            </div>

            <div className="flex items-center gap-1 border border-neutral-800 rounded p-0.5 text-xs font-mono">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  timeRange === '7d' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-500 hover:text-white'
                }`}
              >
                7 Dias
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  timeRange === '30d' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-500 hover:text-white'
                }`}
              >
                30 Dias
              </button>
            </div>
          </div>

          {/* Gráfico de Barras em Vetor Limpo */}
          <div className="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-neutral-800/60 dark:border-neutral-800 light:border-neutral-200">
            {currentChartData.map((d, idx) => {
              const heightPercent = Math.max(10, Math.round((d.xp / maxChartXp) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-emerald-400 tabular-nums">
                    {d.xp} XP
                  </span>
                  <div 
                    className="w-full bg-neutral-800 group-hover:bg-emerald-400 rounded-t transition-all duration-300 relative"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="font-mono text-[10px] text-neutral-500 group-hover:text-white">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>Média: {Math.round(user.xp / 14)} XP / Dia</span>
            <span>Dia Pico: 110 XP (Incidente 402)</span>
          </div>
        </div>

        {/* Coluna Direita: Domínio de Áreas & SRS (5 colunas) */}
        <div className="lg:col-span-5 border border-neutral-800/80 bg-neutral-900/20 p-6 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/20 light:border-neutral-200 light:bg-white space-y-6">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase text-neutral-500">COMPETÊNCIAS POR DOMÍNIO</span>
            <h3 className="text-sm font-semibold text-white dark:text-white light:text-neutral-950">
              Distribuição Disciplinar
            </h3>
          </div>

          <div className="space-y-3.5">
            {domainMastery.map((dm, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-300 dark:text-neutral-300 light:text-neutral-800 truncate">
                    {dm.name}
                  </span>
                  <span className="text-neutral-400 tabular-nums">{dm.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${dm.color}`}
                    style={{ width: `${dm.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Partição das Caixas SRS (Leitner) */}
          <div className="pt-4 border-t border-neutral-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between font-mono text-[11px] text-neutral-400">
              <span className="uppercase">Consolidação de Memória</span>
              <span>Leitner SM-2</span>
            </div>
            <div className="flex items-center gap-1 h-3 rounded overflow-hidden">
              <div style={{ flex: box1to2 || 1 }} className="bg-rose-500/80 h-full" title="Caixas 1-2 Emergente" />
              <div style={{ flex: box3to4 || 1 }} className="bg-sky-500/80 h-full" title="Caixas 3-4 Consolidando" />
              <div style={{ flex: box5 || 1 }} className="bg-emerald-500/80 h-full" title="Caixa 5 Permanente" />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Emergente</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> Consolidando</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Permanente</span>
            </div>
          </div>

        </div>

      </div>

      {/* Escudo de Proteção de Sequência */}
      <div className="border border-neutral-800/80 bg-neutral-900/30 p-6 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/30 light:border-neutral-200 light:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-sky-950/60 border border-sky-500/40 text-sky-400 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white dark:text-white light:text-neutral-950">
                Mecanismo de Escudo Streak Freeze
              </h3>
              <span className="font-mono text-xs text-sky-400 font-bold px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800">
                {user.streakFreezes} ATIVO(S)
              </span>
            </div>
            <p className="text-xs text-neutral-400 light:text-neutral-600 max-w-xl leading-relaxed">
              Se imprevistos do mundo real impedirem o treinamento diário, um escudo ativo se consumirá automaticamente para preservar sua sequência e prevenir penalidades de retenção.
            </p>
            {freezeMessage && (
              <p className="text-xs font-mono text-emerald-400 pt-1">
                {freezeMessage}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleBuyFreeze}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded transition-colors dark:border-neutral-700 light:bg-neutral-900 light:text-white shrink-0"
        >
          <Shield className="h-3.5 w-3.5 text-sky-400" />
          <span>Equipar Escudo (150 XP)</span>
        </button>
      </div>

      {/* Vitrine de Conquistas */}
      <AchievementComponent />

      {/* Modal do Relatório Mensal de Evolução */}
      {showMonthlyReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl border border-neutral-800 bg-[#0B0E14] rounded-lg p-6 sm:p-8 space-y-6 dark:border-neutral-800 light:border-neutral-300 light:bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 dark:border-neutral-800 light:border-neutral-200">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                  RELATÓRIO OFICIAL DE SERVIÇO DO OPERADOR
                </span>
                <h2 className="text-lg font-semibold text-white dark:text-white light:text-neutral-950">
                  Auditoria de Evolução Mensal & Competências
                </h2>
              </div>

              <button
                onClick={() => setShowMonthlyReportModal(false)}
                className="text-xs font-mono text-neutral-500 hover:text-white border border-neutral-800 px-2 py-1 rounded"
              >
                Fechar
              </button>
            </div>

            {/* Cabeçalho do Operador */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono border-b border-neutral-800 pb-4 text-neutral-400">
              <div>
                <span className="text-neutral-500 block">CODENAME</span>
                <span className="text-white dark:text-white light:text-neutral-950 font-semibold">{user.codename}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">PATENTE DE SEGURANÇA</span>
                <span className="text-emerald-400 font-semibold">{user.rank}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">PERÍODO DE AUDITORIA</span>
                <span className="text-white dark:text-white light:text-neutral-950 font-semibold">Setembro 2026</span>
              </div>
              <div>
                <span className="text-neutral-500 block">SCORE DE RETENÇÃO</span>
                <span className="text-sky-400 font-bold">92.4%</span>
              </div>
            </div>

            {/* Síntese Executiva */}
            <div className="space-y-2 text-xs leading-relaxed">
              <h4 className="font-mono font-semibold uppercase text-neutral-400">
                1. Síntese Executiva
              </h4>
              <p className="text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                Ao longo dos últimos 30 dias, o operador {user.codename} demonstrou velocidade diagnóstica superior na inspeção de pacotes das Camadas 2 e 3 e na mitigação de incidentes. A adesão à prática deliberada resultou em uma sequência ativa de {user.streak} dias sem lacunas de conhecimento.
              </p>
            </div>

            {/* Insights Pedagógicos Acionáveis */}
            <div className="space-y-3 text-xs">
              <h4 className="font-mono font-semibold uppercase text-neutral-400">
                2. Insights Acionáveis & Recomendações
              </h4>

              <div className="space-y-2">
                <div className="p-3 rounded border border-emerald-950/60 bg-emerald-950/20 text-emerald-200 space-y-1">
                  <span className="font-bold font-mono text-[11px] block">PONTO FORTE PRINCIPAL: TRIAGEM DE PACOTES & ARP</span>
                  <p className="text-xs text-neutral-300">
                    Alta precisão sob estresse. Identificou envenenamento de cache ARP durante o Incidente 402 com rápida aplicação de Dynamic ARP Inspection (DAI) na camada de acesso.
                  </p>
                </div>

                <div className="p-3 rounded border border-amber-950/60 bg-amber-950/20 text-amber-200 space-y-1">
                  <span className="font-bold font-mono text-[11px] block">VETOR DE APERFEIÇOAMENTO: CRIPTOGRAFIA ASSIMÉTRICA</span>
                  <p className="text-xs text-neutral-300">
                    Latência observada em listas de revogação de certificados PKI (CRL) versus OCSP stapling. Recomendadas 3 sessões práticas de repetição espaçada na trilha de Criptografia.
                  </p>
                </div>

                <div className="p-3 rounded border border-neutral-800 bg-neutral-900/40 text-neutral-300 space-y-1">
                  <span className="font-bold font-mono text-[11px] block text-sky-400">PRÓXIMO MARCO: AUDITORIA SUID EM LINUX</span>
                  <p className="text-xs text-neutral-400">
                    Resolva a operação CTF Operation Shadow Cipher para desbloquear a distinção de Senior Security Architect.
                  </p>
                </div>
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="pt-2 flex items-center justify-between border-t border-neutral-800 text-xs">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-white font-mono"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Imprimir PDF Oficial</span>
              </button>

              <button
                onClick={() => setShowMonthlyReportModal(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded font-mono"
              >
                Concluir Auditoria
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
