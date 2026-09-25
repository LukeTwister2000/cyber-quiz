import React, { useState, useEffect } from 'react';
import { 
  Flag, 
  Clock, 
  FileText, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';

interface CtfArenaProps {
  onOpenMentorWithContext: (topic: string, question: string) => void;
}

export const CtfArena: React.FC<CtfArenaProps> = ({ onOpenMentorWithContext }) => {
  const { ctfs, activeCtfId, setActiveCtf, submitCtfFlag } = useCyberStore();
  
  const currentMission = ctfs.find(c => c.id === activeCtfId) || ctfs[0];
  const [selectedEvidenceIndex, setSelectedEvidenceIndex] = useState<number>(0);
  const [flagInput, setFlagInput] = useState<string>('');
  const [submissionFeedback, setSubmissionFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(currentMission.timeLimitMinutes * 60);

  useEffect(() => {
    setSecondsRemaining(currentMission.timeLimitMinutes * 60);
    setSubmissionFeedback(null);
    setFlagInput('');
  }, [currentMission.id]);

  useEffect(() => {
    if (secondsRemaining <= 0 || currentMission.solved) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining, currentMission.solved]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim()) return;

    const res = submitCtfFlag(currentMission.id, flagInput.trim());
    setSubmissionFeedback(res);
  };

  const activeEvidence = currentMission.evidenceFiles[selectedEvidenceIndex];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      
      {/* Barra de Seleção de Operações */}
      <div className="flex items-center gap-4 border-b border-neutral-800/80 pb-3 text-xs overflow-x-auto dark:border-neutral-800 light:border-neutral-200">
        <span className="text-neutral-500 light:text-neutral-400 font-mono text-[11px] uppercase shrink-0">
          MISSÕES:
        </span>
        {ctfs.map(mission => (
          <button
            key={mission.id}
            onClick={() => {
              setActiveCtf(mission.id);
              setSubmissionFeedback(null);
              setSelectedEvidenceIndex(0);
            }}
            className={`font-mono text-xs uppercase px-2.5 py-1 rounded transition-colors shrink-0 flex items-center gap-1.5 ${
              mission.id === currentMission.id 
                ? 'bg-neutral-800 text-white font-medium dark:bg-neutral-800 light:bg-neutral-200 light:text-neutral-900' 
                : 'text-neutral-400 hover:text-white light:text-neutral-600 light:hover:text-neutral-900'
            }`}
          >
            <span>{mission.codeName}</span>
            {mission.solved && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
          </button>
        ))}
      </div>

      {/* Cabeçalho da Operação & Status */}
      <div className="border border-neutral-800/80 bg-neutral-900/30 p-6 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/30 light:border-neutral-200 light:bg-white space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/60 pb-4 dark:border-neutral-800 light:border-neutral-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="text-amber-400 uppercase font-semibold">{currentMission.codeName}</span>
              <span>·</span>
              <span className="uppercase">{currentMission.difficulty}</span>
              <span>·</span>
              <span className="text-emerald-400 font-mono">+{currentMission.xpReward} XP</span>
            </div>
            <h1 className="text-xl font-semibold text-white dark:text-white light:text-neutral-950">
              {currentMission.title}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-neutral-500 light:text-neutral-400 block">
                STATUS
              </span>
              <span className={`text-xs font-mono font-semibold uppercase ${
                currentMission.solved ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {currentMission.solved ? 'RESOLVIDO' : 'INVESTIGAÇÃO ATIVA'}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-neutral-500 light:text-neutral-400 block">
                TEMPO RESTANTE
              </span>
              <span className="text-xs font-mono font-semibold text-neutral-200 dark:text-neutral-200 light:text-neutral-900 tabular-nums">
                {formatTime(secondsRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Narrativa & Briefing Tático */}
        <div className="space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-neutral-500 font-semibold">
            BRIEFING TÁTICO
          </h2>
          <p className="text-sm leading-relaxed text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
            {currentMission.briefing}
          </p>
        </div>

      </div>

      {/* Visualizador Forense de Evidências */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Coluna Esquerda: Abas de Evidências */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 light:text-neutral-600">
            EVIDÊNCIAS COLETADAS ({currentMission.evidenceFiles.length})
          </h3>
          
          <div className="space-y-2">
            {currentMission.evidenceFiles.map((evidence, idx) => (
              <button
                key={evidence.name}
                onClick={() => setSelectedEvidenceIndex(idx)}
                className={`w-full text-left p-3 rounded border text-xs transition-colors space-y-1 ${
                  selectedEvidenceIndex === idx 
                    ? 'border-neutral-600 bg-neutral-900 text-white dark:border-neutral-700 dark:bg-neutral-900 light:border-neutral-400 light:bg-neutral-100 light:text-neutral-950 font-medium' 
                    : 'border-neutral-800/80 bg-neutral-900/20 text-neutral-400 hover:border-neutral-700 hover:text-white dark:border-neutral-800 light:border-neutral-200 light:bg-white light:text-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 font-mono">
                  <FileText className="h-3.5 w-3.5 text-sky-400" />
                  <span>{evidence.name}</span>
                </div>
                <p className="text-[11px] text-neutral-500 light:text-neutral-400 line-clamp-1">
                  {evidence.description}
                </p>
              </button>
            ))}
          </div>

          {/* Botão de Dica do Mentor */}
          <div className="pt-2">
            <button
              onClick={() => onOpenMentorWithContext(currentMission.codeName, currentMission.hints[0])}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded border border-neutral-800 text-xs font-mono text-neutral-400 hover:text-emerald-400 hover:border-neutral-700 transition-colors dark:border-neutral-800 light:border-neutral-200 light:text-neutral-700"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Solicitar Pista Tática</span>
            </button>
          </div>
        </div>

        {/* Coluna Direita: Janela de Inspeção */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>INSPETOR DE LOGS: {activeEvidence?.name}</span>
            <span className="text-neutral-500">TELEMETRIA APENAS-LEITURA</span>
          </div>

          <div className="rounded border border-neutral-800 bg-[#0B0E14] p-4 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto max-h-[380px] dark:border-neutral-800 light:border-neutral-300">
            <pre className="whitespace-pre-wrap">{activeEvidence?.content}</pre>
          </div>
        </div>

      </div>

      {/* Caixa de Submissão de Flag */}
      <div className="border border-neutral-800/80 bg-neutral-900/40 p-6 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/40 light:border-neutral-200 light:bg-white space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-neutral-400 font-semibold">
            AUTORIZAÇÃO & VERIFICAÇÃO DE FLAG
          </span>
          <span className="text-xs font-mono text-neutral-500">
            Formato: CYBER&#123;...&#125;
          </span>
        </div>

        <form onSubmit={handleFlagSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Insira a flag recuperada ex: CYBER{ssh_brut3_f0rc3_id3nt1f13d}"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-mono bg-neutral-950 border border-neutral-800 rounded text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 dark:border-neutral-800 light:bg-neutral-50 light:border-neutral-300 light:text-neutral-900"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white"
          >
            Verificar Flag
          </button>
        </form>

        {submissionFeedback && (
          <div className={`p-4 rounded text-xs leading-relaxed space-y-2 ${
            submissionFeedback.success 
              ? 'bg-emerald-950/20 border border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-950/20 border border-rose-500/30 text-rose-300'
          }`}>
            <p className="font-semibold">{submissionFeedback.message}</p>
            {submissionFeedback.success && (
              <p className="text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
                Debriefing Técnico: {currentMission.solutionDebrief}
              </p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
