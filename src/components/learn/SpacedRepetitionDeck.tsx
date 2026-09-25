import React, { useState } from 'react';
import { 
  RotateCcw, 
  Brain, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  ChevronRight,
  ShieldCheck, 
  Award
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';
import { SrsRating, QuizQuestion } from '../../types';

interface SpacedRepetitionDeckProps {
  onCompleteSession: () => void;
}

export const SpacedRepetitionDeck: React.FC<SpacedRepetitionDeckProps> = ({ onCompleteSession }) => {
  const { questions, reviewSrsCard, user } = useCyberStore();
  
  // Filtrar questões para revisão ou caixa 1/2
  const dueQuestions = questions.filter(q => (q.srsBox || 1) <= 3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState(0);

  const currentCard: QuizQuestion | undefined = dueQuestions[currentIndex];

  const handleRate = (rating: SrsRating) => {
    if (!currentCard) return;

    reviewSrsCard(currentCard.id, rating);
    setSessionReviewedCount(prev => prev + 1);

    if (currentIndex + 1 < dueQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setSessionCompleted(true);
    }
  };

  if (sessionCompleted || dueQuestions.length === 0) {
    return (
      <div className="mx-auto max-w-xl p-8 rounded-lg border border-neutral-800 bg-[#0B0E14] text-center space-y-6 dark:border-neutral-800 light:border-neutral-300 light:bg-white shadow-xl">
        <div className="h-16 w-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
          <Brain className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
            CICLO DE RETENÇÃO SRS CONCLUÍDO
          </span>
          <h2 className="text-xl font-semibold text-white dark:text-white light:text-neutral-950">
            Consolidação de Memória Verificada
          </h2>
          <p className="text-xs text-neutral-400 light:text-neutral-600 max-w-md mx-auto leading-relaxed">
            Você revisou {sessionReviewedCount || dueQuestions.length} conceitos de segurança. Os intervalos foram recalibrados para garantir perda zero de retenção.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left border-y border-neutral-800 py-4 font-mono text-xs text-neutral-400">
          <div>
            <span className="text-neutral-500 block">XP RECOMPENSADO</span>
            <span className="text-emerald-400 font-bold text-sm">+{(sessionReviewedCount || dueQuestions.length) * 25} XP</span>
          </div>
          <div>
            <span className="text-neutral-500 block">PRÓXIMO LOTE</span>
            <span className="text-white dark:text-white light:text-neutral-950 font-bold text-sm">Amanhã, 09:00</span>
          </div>
        </div>

        <button
          onClick={onCompleteSession}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white"
        >
          <span>Retornar ao Hub de Currículo</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  const boxNumber = currentCard.srsBox || 1;
  const correctOption = currentCard.options.find(o => o.id === currentCard.correctOptionId);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      
      {/* Cabeçalho do Progresso da Sessão */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-emerald-400" />
          <span className="uppercase text-white dark:text-white light:text-neutral-950 font-semibold">
            DECK ORGÂNICO DE SRS
          </span>
          <span>·</span>
          <span>CARD {currentIndex + 1} DE {dueQuestions.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-500">Estabilidade:</span>
          <span className="text-emerald-400 font-semibold">Caixa {boxNumber} de 5</span>
        </div>
      </div>

      {/* Card de Desafio Rápido */}
      <div className="border border-neutral-800/80 bg-neutral-900/30 p-6 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/30 light:border-neutral-200 light:bg-white space-y-6 shadow-lg">
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
            <span className="uppercase text-sky-400 font-semibold">{currentCard.moduleTitle}</span>
            <span className="uppercase">{currentCard.difficulty}</span>
          </div>

          <h2 className="text-base sm:text-lg font-medium text-white dark:text-white light:text-neutral-950 leading-relaxed">
            {currentCard.question}
          </h2>

          {currentCard.scenarioCode && (
            <div className="p-3.5 rounded bg-black/60 border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto">
              <code>{currentCard.scenarioCode}</code>
            </div>
          )}
        </div>

        {/* Resposta Revelada & Mecanismo */}
        {showAnswer ? (
          <div className="space-y-4 pt-4 border-t border-neutral-800/80 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold block">
                VERIFICAÇÃO CORRETA
              </span>
              <p className="text-sm font-semibold text-emerald-300 font-mono">
                {correctOption?.text || currentCard.correctOptionId}
              </p>
            </div>

            <div className="space-y-1 text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
              <span className="font-mono text-neutral-500 uppercase block">Mecanismo Subjacente:</span>
              <p>{currentCard.explanation}</p>
            </div>

            <div className="space-y-1 text-xs text-neutral-400 light:text-neutral-600 border-l-2 border-neutral-700 pl-3">
              <span className="font-mono text-neutral-500 uppercase block">Por Que Isso Importa:</span>
              <p>{currentCard.whyItMatters}</p>
            </div>

            {/* Botões de Avaliação da Memória */}
            <div className="space-y-2 pt-4 border-t border-neutral-800/80">
              <span className="text-[11px] font-mono text-neutral-400 uppercase block text-center">
                Calibre a Dificuldade de Recordação:
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleRate(1)}
                  className="p-3 rounded border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 text-xs font-mono transition-colors text-center"
                >
                  <span className="font-bold block text-sm">1 · Difícil</span>
                  <span className="text-[10px] text-rose-400 block mt-0.5">Amanhã</span>
                </button>

                <button
                  onClick={() => handleRate(2)}
                  className="p-3 rounded border border-sky-500/30 bg-sky-950/20 hover:bg-sky-950/40 text-sky-300 text-xs font-mono transition-colors text-center"
                >
                  <span className="font-bold block text-sm">2 · Bom</span>
                  <span className="text-[10px] text-sky-400 block mt-0.5">3–5 Dias</span>
                </button>

                <button
                  onClick={() => handleRate(3)}
                  className="p-3 rounded border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 text-xs font-mono transition-colors text-center"
                >
                  <span className="font-bold block text-sm">3 · Fácil</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">7–14 Dias</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAnswer(true)}
            className="w-full py-3 px-4 rounded border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider text-white transition-colors"
          >
            Revelar Mecanismo & Avaliar Recordação
          </button>
        )}

      </div>

    </div>
  );
};
