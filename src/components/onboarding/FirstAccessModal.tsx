import React, { useState } from 'react';
import { Terminal, ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';
import { UserLevel } from '../../types';

interface FirstAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirstAccessModal: React.FC<FirstAccessModalProps> = ({ isOpen, onClose }) => {
  const { setOnboardingComplete, addXp } = useCyberStore();
  const [step, setStep] = useState<'level' | 'terminal' | 'success'>('level');
  const [selectedLevel, setSelectedLevel] = useState<UserLevel>('beginner');
  
  // Estado do mini-terminal interativo
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'sandbox-init: enclave virtual montado em /home/student',
    'digite "cat flag.txt" para extrair sua chave de autorização de orientador.'
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [flagDiscovered, setFlagDiscovered] = useState(false);

  if (!isOpen) return null;

  const handleLevelSelect = (level: UserLevel) => {
    setSelectedLevel(level);
    setStep('terminal');
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'whoami') {
      setTerminalHistory(prev => [...prev, '$ whoami', 'student']);
    } else if (cmd === 'ls') {
      setTerminalHistory(prev => [...prev, '$ ls', 'flag.txt  notes.txt']);
    } else if (cmd === 'cat flag.txt') {
      setTerminalHistory(prev => [
        ...prev, 
        '$ cat flag.txt', 
        'FLAG: CYBER{welcome_to_cyberquiz}',
        'STATUS: AUTORIZAÇÃO VERIFICADA (+100 XP RECOMPENSADOS)'
      ]);
      setFlagDiscovered(true);
      addXp(100, 'Conclusão do Onboarding de Primeiro Acesso');
    } else {
      setTerminalHistory(prev => [...prev, `$ ${terminalInput}`, `command not found: ${cmd}. Tente "cat flag.txt"`]);
    }
    setTerminalInput('');
  };

  const handleComplete = () => {
    setOnboardingComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-xl border border-neutral-800 bg-[#0A0D12] rounded-lg p-6 sm:p-8 space-y-6 dark:border-neutral-800 light:border-neutral-300 light:bg-white shadow-2xl">
        
        {step === 'level' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
                PROTOCOLO DE ORIENTAÇÃO
              </span>
              <h1 className="text-2xl font-semibold text-white dark:text-white light:text-neutral-950">
                QUAL É O SEU NÍVEL?
              </h1>
              <p className="text-xs text-neutral-400 light:text-neutral-600 leading-relaxed">
                O CYBERQUIZ calibra a complexidade dos desafios e a mentoria diagnóstica de acordo com seu histórico e experiência.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleLevelSelect('beginner')}
                className="w-full p-4 rounded border border-neutral-800 bg-neutral-900/40 text-left hover:border-neutral-600 hover:bg-neutral-900/80 transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-white">INICIANTE</span>
                  <span className="text-neutral-500">Tier 1</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Sei pouco ou nada. Começar a partir dos fundamentos essenciais de redes e sistemas.
                </p>
              </button>

              <button
                onClick={() => handleLevelSelect('intermediate')}
                className="w-full p-4 rounded border border-neutral-800 bg-neutral-900/40 text-left hover:border-neutral-600 hover:bg-neutral-900/80 transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-white">INTERMEDIÁRIO</span>
                  <span className="text-sky-400">Tier 2</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Conheço redes básicas e CLI do Linux. Pronto para computação forense e vulnerabilidades web.
                </p>
              </button>

              <button
                onClick={() => handleLevelSelect('advanced')}
                className="w-full p-4 rounded border border-neutral-800 bg-neutral-900/40 text-left hover:border-neutral-600 hover:bg-neutral-900/80 transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-white">AVANÇADO</span>
                  <span className="text-amber-400">Tier 3</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Já atuo na área de tecnologia/segurança. Foco direto em resposta a incidentes e CTFs complexos.
                </p>
              </button>
            </div>
          </div>
        )}

        {step === 'terminal' && (
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
                ETAPA 2 DE 2 · BATISMO NO TERMINAL
              </span>
              <h2 className="text-xl font-semibold text-white dark:text-white light:text-neutral-950">
                Execute Seu Primeiro Comando
              </h2>
              <p className="text-xs text-neutral-400 light:text-neutral-600">
                Recupere sua chave de autorização executando <span className="font-mono text-emerald-400">cat flag.txt</span>.
              </p>
            </div>

            {/* Mini-CLI Interativa */}
            <div className="rounded border border-neutral-800 bg-black p-4 font-mono text-xs text-neutral-300 space-y-3 min-h-[160px]">
              <div className="space-y-1 text-neutral-400 leading-relaxed">
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className={line.includes('FLAG:') ? 'text-emerald-400 font-semibold' : ''}>
                    {line}
                  </div>
                ))}
              </div>

              <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
                <span className="text-emerald-400">student@cyberquiz:~$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="digite: cat flag.txt"
                  autoFocus
                  className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-xs caret-emerald-400"
                />
              </form>
            </div>

            {flagDiscovered ? (
              <div className="pt-2">
                <button
                  onClick={handleComplete}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white"
                >
                  <span>Entrar na Academia (+100 XP Concedidos)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>Dica: Clique no terminal e digite "cat flag.txt"</span>
                <button
                  onClick={() => {
                    setTerminalInput('cat flag.txt');
                  }}
                  className="text-neutral-400 hover:text-white underline underline-offset-4"
                >
                  Preencher comando
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
