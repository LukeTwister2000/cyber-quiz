import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  AlertTriangle,
  Network,
  Cpu,
  Terminal,
  Activity,
  Award
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';

interface BossArenaProps {
  onReturnToDashboard: () => void;
}

export const BossArena: React.FC<BossArenaProps> = ({ onReturnToDashboard }) => {
  const { boss, bossCompleted, completeBossChallenge } = useCyberStore();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [mitigationSelection, setMitigationSelection] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState<{
    submitted: boolean;
    success: boolean;
    debrief: string;
  } | null>(null);

  const handleSelectAnswer = (qIndex: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optionIdx }));
  };

  const handleFinalSubmission = () => {
    const q1Correct = selectedAnswers[0] === boss.questions[0].correctIndex;
    const q2Correct = selectedAnswers[1] === boss.questions[1].correctIndex;
    const mitCorrect = mitigationSelection === boss.mitigationConfig.correctIndex;

    const allCorrect = q1Correct && q2Correct && mitCorrect;

    if (allCorrect) {
      completeBossChallenge();
      setEvaluation({
        submitted: true,
        success: true,
        debrief: 'INCIDENTE NEUTRALIZADO: Excelente investigação de causa-raiz. Dynamic ARP Inspection (DAI) foi configurado nos switches de acesso da VLAN. Respostas ARP fraudulentas da estação 10.0.0.88 foram bloqueadas e a integridade da rede foi restabelecida.',
      });
    } else {
      setEvaluation({
        submitted: true,
        success: false,
        debrief: 'FALHA NA MITIGAÇÃO: Uma ou mais conclusões diagnósticas estavam incorretas. Reexamine o fluxo de pacotes e as opções de mitigação na camada de acesso.',
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      
      {/* Cabeçalho */}
      <div className="border border-neutral-800/80 bg-neutral-900/40 p-6 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/40 light:border-neutral-200 light:bg-white space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="text-rose-400 uppercase font-semibold">RESPOSTA A INCIDENTE CRÍTICO</span>
          <span>·</span>
          <span>{boss.incidentCode}</span>
          <span>·</span>
          <span className="text-emerald-400 font-mono">+{boss.xpReward} XP</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold text-white dark:text-white light:text-neutral-950">
          {boss.title}
        </h1>

        <p className="text-xs sm:text-sm leading-relaxed text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
          {boss.description}
        </p>
      </div>

      {/* Rastreio de Pacotes Capturados */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
          <span className="uppercase">RASTREAMENTO DE PACOTES CAPTURADOS (EXTRATO WIRESHARK)</span>
          <span className="text-neutral-500">CAPTURA PROMÍSCUA</span>
        </div>

        <div className="rounded border border-neutral-800 bg-[#0B0E14] p-4 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto dark:border-neutral-800 light:border-neutral-300">
          {boss.packetSummary.map((pkt, idx) => (
            <div key={idx} className="py-0.5 hover:bg-neutral-900/60 px-1 rounded transition-colors">
              <span className="text-neutral-500 mr-2">[{idx + 1}]</span>
              <span className={pkt.includes('Rogue') || pkt.includes('Falso') ? 'text-amber-400 font-semibold' : ''}>
                {pkt}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Questões Diagnósticas */}
      <div className="space-y-6">
        {boss.questions.map((q, qIdx) => (
          <div 
            key={qIdx}
            className="border border-neutral-800/80 bg-neutral-900/20 p-5 rounded space-y-3 dark:border-neutral-800 dark:bg-neutral-900/20 light:border-neutral-200 light:bg-white"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="text-emerald-400 font-semibold">ETAPA 0{qIdx + 1}</span>
              <span>·</span>
              <span>HIPÓTESE DIAGNÓSTICA</span>
            </div>

            <h3 className="text-sm font-medium text-white dark:text-white light:text-neutral-950">
              {q.question}
            </h3>

            <div className="space-y-2 pt-1">
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[qIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(qIdx, optIdx)}
                    className={`w-full text-left p-3 rounded border text-xs transition-colors flex items-center gap-3 ${
                      isSelected 
                        ? 'border-neutral-400 bg-neutral-800 text-white font-medium' 
                        : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-300 hover:border-neutral-700 hover:text-white dark:border-neutral-800 light:border-neutral-200 light:bg-neutral-50 light:text-neutral-800'
                    }`}
                  >
                    <span className="font-mono text-neutral-500 text-[11px]">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Configuração de Mitigação na Camada de Acesso */}
        <div className="border border-neutral-800/80 bg-neutral-900/20 p-5 rounded space-y-3 dark:border-neutral-800 dark:bg-neutral-900/20 light:border-neutral-200 light:bg-white">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="text-sky-400 font-semibold">ETAPA 03</span>
            <span>·</span>
            <span>REGRAS DE HARDENING DE PORTA DE SWITCH</span>
          </div>

          <h3 className="text-sm font-medium text-white dark:text-white light:text-neutral-950">
            {boss.mitigationConfig.ruleLabel}
          </h3>

          <div className="space-y-2 pt-1">
            {boss.mitigationConfig.options.map((opt, optIdx) => {
              const isSelected = mitigationSelection === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => setMitigationSelection(optIdx)}
                  className={`w-full text-left p-3 rounded border text-xs transition-colors flex items-center gap-3 ${
                    isSelected 
                      ? 'border-neutral-400 bg-neutral-800 text-white font-medium' 
                      : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-300 hover:border-neutral-700 hover:text-white dark:border-neutral-800 light:border-neutral-200 light:bg-neutral-50 light:text-neutral-800'
                  }`}
                >
                  <span className="font-mono text-neutral-500 text-[11px]">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Botão de Avaliação / Implantação */}
      <div className="pt-2">
        <button
          onClick={handleFinalSubmission}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white"
        >
          <span>Aplicar Mitigação & Concluir Incidente</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {evaluation && (
        <div className={`p-5 rounded border text-xs leading-relaxed space-y-2 ${
          evaluation.success 
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center gap-2 font-semibold">
            {evaluation.success ? (
              <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <CheckCircle2 className="h-4 w-4" />
                DESAFIO BOSS RESOLVIDO · +{boss.xpReward} XP
              </span>
            ) : (
              <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <AlertTriangle className="h-4 w-4" />
                FALHA NA VERIFICAÇÃO
              </span>
            )}
          </div>
          <p className="text-neutral-300">{evaluation.debrief}</p>
        </div>
      )}

    </div>
  );
};
