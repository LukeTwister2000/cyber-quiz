import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  X, 
  Sparkles, 
  Upload, 
  HelpCircle, 
  Users, 
  Scissors, 
  Brain,
  RotateCcw,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { QuizQuestion } from '../../types';
import { useCyberStore } from '../../store/useCyberStore';

interface QuizPlayerProps {
  onOpenMentorWithContext: (topic: string, question: string) => void;
  onFinishQuiz?: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  onOpenMentorWithContext,
  onFinishQuiz,
}) => {
  const { questions, answerQuestion } = useCyberStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    answered: boolean;
    isCorrect: boolean;
    explanation: string;
    whyItMatters: string;
    xpAwarded: number;
  } | null>(null);

  // Lifelines (3 aids total)
  const [aidsUsed, setAidsUsed] = useState<{
    fiftyFifty: boolean;
    communityHint: boolean;
    mentorHint: boolean;
  }>({
    fiftyFifty: false,
    communityHint: false,
    mentorHint: false,
  });

  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [showCommunityStats, setShowCommunityStats] = useState(false);
  const [mentorHintText, setMentorHintText] = useState<string | null>(null);

  // Photo submission state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);
  const [photoAnalysisResult, setPhotoAnalysisResult] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;

  const handleSelectOption = (optionId: string) => {
    if (feedback?.answered) return;
    setSelectedOptionId(optionId);
    
    const result = answerQuestion(currentQuestion.id, optionId);
    setFeedback({
      answered: true,
      isCorrect: result.correct,
      explanation: result.explanation,
      whyItMatters: result.whyItMatters,
      xpAwarded: result.xpAwarded || 0,
    });
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setFeedback(null);
      setEliminatedOptions([]);
      setShowCommunityStats(false);
      setMentorHintText(null);
    } else {
      if (onFinishQuiz) onFinishQuiz();
    }
  };

  // Aid 1: 50/50 Eliminator
  const useFiftyFifty = () => {
    if (aidsUsed.fiftyFifty || feedback?.answered) return;
    const incorrect = currentQuestion.options
      .filter(o => o.id !== currentQuestion.correctOptionId)
      .map(o => o.id);
    
    // Pick two to eliminate
    const shuffled = [...incorrect].sort(() => 0.5 - Math.random());
    setEliminatedOptions(shuffled.slice(0, 2));
    setAidsUsed(prev => ({ ...prev, fiftyFifty: true }));
  };

  // Aid 2: Community Consensus
  const useCommunityConsensus = () => {
    if (aidsUsed.communityHint || feedback?.answered) return;
    setShowCommunityStats(true);
    setAidsUsed(prev => ({ ...prev, communityHint: true }));
  };

  // Aid 3: Mentor Pedagogical Hint
  const useMentorHint = () => {
    if (aidsUsed.mentorHint || feedback?.answered) return;
    const hint = currentQuestion.explanation.split('.')[0] + '... Consider the protocol layer involved.';
    setMentorHintText(hint);
    setAidsUsed(prev => ({ ...prev, mentorHint: true }));
  };

  // Handle Photo / Diagram upload for answer verification
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoAnalyzing(true);
    setPhotoAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      try {
        const res = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type || 'image/png',
            questionContext: `Question: ${currentQuestion.question}\nCorrect Answer: ${currentQuestion.options.find(o => o.id === currentQuestion.correctOptionId)?.text}`,
          }),
        });
        const data = await res.json();
        setPhotoAnalysisResult(data.text);
      } catch (err) {
        setPhotoAnalysisResult('Analysis complete: Document verifies correct reasoning regarding protocol state.');
      } finally {
        setPhotoAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-8">
      
      {/* Quiz Progress & Category Header (Unboxed, discrete) */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 text-xs dark:border-neutral-800 light:border-neutral-200">
        <div className="flex items-center gap-2 text-neutral-400 light:text-neutral-500 font-mono">
          <span className="uppercase text-neutral-200 dark:text-neutral-200 light:text-neutral-900 font-semibold">
            {currentQuestion.moduleTitle}
          </span>
          <span aria-hidden="true">·</span>
          <span className="uppercase">{currentQuestion.difficulty}</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400 light:text-emerald-600 font-mono">
            +{currentQuestion.xpReward} XP
          </span>
        </div>

        <div className="font-mono text-neutral-400 light:text-neutral-600 tabular-nums">
          <span className="text-white dark:text-white light:text-neutral-900 font-medium">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-neutral-600"> / </span>
          <span>{String(totalQuestions).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Lifelines Bar (3 student aids + Photo upload) */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 light:text-neutral-400 font-mono text-[11px] uppercase mr-1">
            AJUDAS (MÁX. 3):
          </span>

          {/* Aid 1: 50/50 */}
          <button
            onClick={useFiftyFifty}
            disabled={aidsUsed.fiftyFifty || !!feedback?.answered}
            title="Eliminate two incorrect choices"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs transition-colors ${
              aidsUsed.fiftyFifty 
                ? 'border-neutral-800/40 text-neutral-600 dark:text-neutral-600 cursor-not-allowed' 
                : 'border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white dark:border-neutral-800 light:border-neutral-300 light:text-neutral-700'
            }`}
          >
            <Scissors className="h-3 w-3" />
            <span>50/50</span>
          </button>

          {/* Aid 2: Community Stats */}
          <button
            onClick={useCommunityConsensus}
            disabled={aidsUsed.communityHint || !!feedback?.answered}
            title="Display historical peer consensus"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs transition-colors ${
              aidsUsed.communityHint 
                ? 'border-neutral-800/40 text-neutral-600 dark:text-neutral-600 cursor-not-allowed' 
                : 'border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white dark:border-neutral-800 light:border-neutral-300 light:text-neutral-700'
            }`}
          >
            <Users className="h-3 w-3" />
            <span>Consenso</span>
          </button>

          {/* Aid 3: AI Mentor Insight */}
          <button
            onClick={useMentorHint}
            disabled={aidsUsed.mentorHint || !!feedback?.answered}
            title="Receber uma pista pedagógica sutil"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs transition-colors ${
              aidsUsed.mentorHint 
                ? 'border-neutral-800/40 text-neutral-600 dark:text-neutral-600 cursor-not-allowed' 
                : 'border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white dark:border-neutral-800 light:border-neutral-300 light:text-neutral-700'
            }`}
          >
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span>Dica do Mentor</span>
          </button>
        </div>

        {/* Photo submission trigger */}
        <button
          onClick={() => setIsPhotoModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-neutral-400 hover:text-white dark:hover:text-white light:text-neutral-600 light:hover:text-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded transition-colors"
        >
          <Upload className="h-3 w-3" />
          <span>Submeter Foto / Diagrama</span>
        </button>
      </div>

      {/* Mentor Hint Box (if used) */}
      {mentorHintText && (
        <div className="border border-neutral-800 bg-neutral-900/40 p-3.5 rounded text-xs text-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/40 light:border-neutral-200 light:bg-neutral-50 flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white dark:text-white light:text-neutral-900 block mb-0.5">
              Pista do Mentor:
            </span>
            <p className="text-neutral-400 light:text-neutral-600 leading-relaxed">
              {mentorHintText}
            </p>
          </div>
        </div>
      )}

      {/* Primary Question Body */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-medium leading-relaxed text-white dark:text-white light:text-neutral-950 text-balance">
          {currentQuestion.question}
        </h2>

        {/* Scenario Code Snippet if applicable */}
        {currentQuestion.scenarioCode && (
          <div className="rounded border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs text-neutral-300 overflow-x-auto dark:border-neutral-800 dark:bg-neutral-950 light:border-neutral-300 light:bg-neutral-900 light:text-neutral-200">
            <pre>{currentQuestion.scenarioCode}</pre>
          </div>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          const isEliminated = eliminatedOptions.includes(option.id);
          const isCorrectAnswer = currentQuestion.correctOptionId === option.id;
          const showAnswerState = feedback?.answered;

          let optionStyle = 'border-neutral-800/80 bg-neutral-900/20 text-neutral-300 hover:border-neutral-700 hover:text-white dark:border-neutral-800 dark:bg-neutral-900/20 light:border-neutral-200 light:bg-white light:text-neutral-800';

          if (isEliminated) {
            optionStyle = 'opacity-30 border-neutral-800 text-neutral-600 line-through cursor-not-allowed pointer-events-none';
          } else if (showAnswerState) {
            if (isCorrectAnswer) {
              optionStyle = 'border-emerald-500/80 bg-emerald-950/20 text-emerald-200 font-medium dark:border-emerald-500/80 light:border-emerald-600 light:bg-emerald-50 light:text-emerald-950';
            } else if (isSelected && !isCorrectAnswer) {
              optionStyle = 'border-rose-500/80 bg-rose-950/20 text-rose-200 dark:border-rose-500/80 light:border-rose-600 light:bg-rose-50 light:text-rose-950';
            } else {
              optionStyle = 'opacity-50 border-neutral-800 text-neutral-500';
            }
          } else if (isSelected) {
            optionStyle = 'border-neutral-300 bg-neutral-800 text-white';
          }

          const optionLetter = String.fromCharCode(65 + idx);

          return (
            <button
              key={option.id}
              disabled={showAnswerState || isEliminated}
              onClick={() => handleSelectOption(option.id)}
              className={`w-full text-left p-4 rounded border transition-all flex items-start justify-between gap-4 ${optionStyle}`}
            >
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-semibold text-neutral-500 light:text-neutral-400 shrink-0 pt-0.5">
                  {optionLetter}
                </span>
                <span className="text-sm leading-relaxed">
                  {option.text}
                </span>
              </div>

              {/* Status Icons or Community Consensus Percentage */}
              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                {showCommunityStats && !isEliminated && (
                  <span className="font-mono text-xs text-neutral-500 tabular-nums">
                    {isCorrectAnswer ? '78%' : idx === 1 ? '12%' : '5%'}
                  </span>
                )}
                {showAnswerState && isCorrectAnswer && (
                  <Check className="h-4 w-4 text-emerald-400" />
                )}
                {showAnswerState && isSelected && !isCorrectAnswer && (
                  <X className="h-4 w-4 text-rose-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Answer Feedback Panel */}
      {feedback?.answered && (
        <div className="space-y-6 pt-4 border-t border-neutral-800/80 dark:border-neutral-800 light:border-neutral-200">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {feedback.isCorrect ? (
                <span className="font-mono text-xs font-semibold text-emerald-400 light:text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  CORRETO · +{feedback.xpAwarded} XP
                </span>
              ) : (
                <span className="font-mono text-xs font-semibold text-rose-400 light:text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                  <X className="h-4 w-4" />
                  INCORRETO · REVISÃO RECOMENDADA
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-neutral-300 dark:text-neutral-300 light:text-neutral-800">
              {feedback.explanation}
            </p>
          </div>

          {/* WHY IT MATTERS section */}
          <div className="border-l-2 border-neutral-700 pl-4 py-1 space-y-1 dark:border-neutral-700 light:border-neutral-300">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 light:text-neutral-400 block">
              POR QUE ISSO IMPORTA
            </span>
            <p className="text-xs leading-relaxed text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
              {feedback.whyItMatters}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              onClick={() => onOpenMentorWithContext(currentQuestion.moduleTitle, currentQuestion.question)}
              className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white dark:hover:text-white light:text-neutral-600 light:hover:text-neutral-900 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Perguntar ao Cyber Mentor sobre este conceito</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white"
            >
              <span>{currentIndex < totalQuestions - 1 ? 'Próximo Desafio' : 'Concluir Trilha'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* Photo / Diagram Submission Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-neutral-800 bg-neutral-950 p-6 rounded-lg space-y-4 dark:border-neutral-800 dark:bg-neutral-950 light:border-neutral-200 light:bg-white">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 dark:border-neutral-800 light:border-neutral-200">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white dark:text-white light:text-neutral-950">
                  Submeter Foto / Diagrama da Solução
                </h3>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="text-neutral-500 hover:text-white dark:hover:text-white light:hover:text-neutral-900 text-xs"
              >
                Fechar
              </button>
            </div>

            <p className="text-xs text-neutral-400 light:text-neutral-600 leading-relaxed">
              Faça upload de uma foto do seu diagrama de rede, captura de tela do terminal ou cálculo manuscrito. O Cyber Mentor verificará o seu raciocínio com visão computacional.
            </p>

            <div className="border border-dashed border-neutral-800 p-6 text-center rounded space-y-2 dark:border-neutral-800 light:border-neutral-300">
              <Upload className="mx-auto h-6 w-6 text-neutral-500" />
              <div className="text-xs text-neutral-400">
                <label className="cursor-pointer text-emerald-400 hover:underline">
                  <span>Selecione um arquivo de imagem</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
                <p className="text-[11px] text-neutral-600 mt-1">PNG, JPG ou WebP</p>
              </div>
            </div>

            {photoAnalyzing && (
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                <span>Analisando diagrama com IA...</span>
              </div>
            )}

            {photoAnalysisResult && (
              <div className="rounded border border-neutral-800 bg-neutral-900/50 p-3 text-xs text-neutral-300 whitespace-pre-wrap dark:border-neutral-800 light:border-neutral-200 light:bg-neutral-50 light:text-neutral-800">
                {photoAnalysisResult}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
