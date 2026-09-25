import React, { useState } from 'react';
import { 
  BookOpen, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Brain,
  Filter
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';
import { QuizPlayer } from '../quiz/QuizPlayer';
import { SpacedRepetitionDeck } from './SpacedRepetitionDeck';

interface LearnHubProps {
  onOpenMentorWithContext: (topic: string, question: string) => void;
}

export const LearnHub: React.FC<LearnHubProps> = ({ onOpenMentorWithContext }) => {
  const { questions, user } = useCyberStore();
  const [activeMode, setActiveMode] = useState<'hub' | 'quiz' | 'srs'>('hub');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const modules = [
    { id: 'all', title: 'Currículo Completo', count: questions.length, desc: 'Desafios abrangendo todos os domínios essenciais de cybersecurity' },
    { id: 'networking', title: 'Fundamentos de Redes', count: questions.filter(q => q.moduleId === 'networking').length, desc: 'Modelo OSI de 7 Camadas, Handshake TCP/IP, ARP, DNS, Subnetting e CIDR' },
    { id: 'linux', title: 'Segurança & Internais do Linux', count: questions.filter(q => q.moduleId === 'linux').length, desc: 'Permissões POSIX, avaliação do bit SUID, pipelines bash e logs de auditoria' },
    { id: 'web_security', title: 'Segurança de Aplicações Web', count: questions.filter(q => q.moduleId === 'web_security').length, desc: 'OWASP Top 10, SQLi, XSS, CSRF, Clickjacking e políticas CSP' },
    { id: 'cryptography', title: 'Criptografia & Proteção de Dados', count: questions.filter(q => q.moduleId === 'cryptography').length, desc: 'Criptografia Simétrica vs Assimétrica, Hashes com Salt e certificados PKI' },
    { id: 'forensics', title: 'Computação Forense & Triagem', count: questions.filter(q => q.moduleId === 'forensics').length, desc: 'Imagens de disco, reconstrução de linha do tempo, dumps de memória e cadeias de hash' },
    { id: 'defensive', title: 'Arquitetura Defensiva', count: questions.filter(q => q.moduleId === 'defensive').length, desc: 'Correlação de logs em SIEM, verificação Zero Trust e regras de IDS' },
  ];

  // Calcular itens para repetição espaçada (Caixas 1 a 3)
  const srsDueCards = questions.filter(q => (q.srsBox || 1) <= 3);

  if (activeMode === 'srs') {
    return (
      <div className="space-y-4">
        <div className="mx-auto max-w-3xl px-4 pt-4 sm:px-6">
          <button
            onClick={() => setActiveMode('hub')}
            className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            ← Voltar aos Módulos
          </button>
        </div>
        <SpacedRepetitionDeck onCompleteSession={() => setActiveMode('hub')} />
      </div>
    );
  }

  if (activeMode === 'quiz') {
    return (
      <div className="space-y-4">
        <div className="mx-auto max-w-3xl px-4 pt-4 sm:px-6">
          <button
            onClick={() => setActiveMode('hub')}
            className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            ← Voltar aos Módulos
          </button>
        </div>
        <QuizPlayer
          onOpenMentorWithContext={onOpenMentorWithContext}
          onFinishQuiz={() => setActiveMode('hub')}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-10">
      
      {/* Cabeçalho */}
      <div className="space-y-2 border-b border-neutral-800/80 pb-4 dark:border-neutral-800 light:border-neutral-200">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="uppercase text-emerald-400 font-semibold">ARQUIVO DO CURRÍCULO</span>
          <span>·</span>
          <span>MOTOR DE REPETIÇÃO ESPAÇADA</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white dark:text-white light:text-neutral-950">
          Trilhas de Conhecimento em Cybersecurity
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 light:text-neutral-600 max-w-2xl leading-relaxed">
          Domine disciplinas essenciais através da prática deliberada de recuperação ativa. As questões são agendadas automaticamente de acordo com intervalos científicos de retenção.
        </p>
      </div>

      {/* Banner de Repetição Espaçada (SRS) */}
      <div className="border border-neutral-800/80 bg-neutral-900/30 p-5 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/30 light:border-neutral-200 light:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Brain className="h-4 w-4" />
            <span className="uppercase font-semibold">FILA DIÁRIA DE RETENÇÃO</span>
          </div>
          <h2 className="text-base font-semibold text-white dark:text-white light:text-neutral-950">
            {srsDueCards.length} Conceitos Agendados para Revisão
          </h2>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Fortaleça a recordação neural de conceitos das Caixas 1 e 2 antes do declínio da memória.
          </p>
        </div>

        <button
          onClick={() => setActiveMode('srs')}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Iniciar Revisão SRS</span>
        </button>
      </div>

      {/* Grade de Módulos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
          <span className="uppercase font-semibold">MÓDULOS DE APRENDIZADO ATIVOS</span>
          <span>{modules.length} TRILHAS</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => setActiveMode('quiz')}
              className="group cursor-pointer p-5 rounded border border-neutral-800/80 bg-neutral-900/20 hover:border-neutral-600 hover:bg-neutral-900/40 transition-all flex flex-col justify-between space-y-4 dark:border-neutral-800 dark:bg-neutral-900/20 light:border-neutral-200 light:bg-white"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span className="uppercase text-[11px] text-emerald-400">MÓDULO PRÁTICO</span>
                  <span>{mod.count} DESAFIOS</span>
                </div>
                <h3 className="text-sm font-semibold text-white dark:text-white light:text-neutral-950 group-hover:text-emerald-400 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-neutral-400 light:text-neutral-600 leading-relaxed line-clamp-2">
                  {mod.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white dark:border-neutral-800 light:border-neutral-200">
                <span>Iniciar Trilha</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
