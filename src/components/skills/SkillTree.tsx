import React, { useState } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Terminal, 
  ShieldCheck, 
  Brain,
  ChevronRight
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';
import { SkillNode, ModuleCategory } from '../../types';

interface SkillTreeProps {
  onOpenLab: (labId?: string) => void;
  onOpenQuiz: () => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({
  onOpenLab,
  onOpenQuiz,
}) => {
  const { skills, user, unlockSkill } = useCyberStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(skills[0]);

  const categories = [
    { id: 'all', label: 'Todas as Disciplinas' },
    { id: 'networking', label: 'Redes' },
    { id: 'linux', label: 'Linux' },
    { id: 'web_security', label: 'Segurança Web' },
    { id: 'cryptography', label: 'Criptografia' },
    { id: 'forensics', label: 'Forense' },
    { id: 'defensive', label: 'Defensiva' },
    { id: 'ctf', label: 'CTF' },
  ];

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(s => s.category === selectedCategory);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      
      {/* Cabeçalho */}
      <div className="space-y-1 border-b border-neutral-800/80 pb-4 dark:border-neutral-800 light:border-neutral-200">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="uppercase text-emerald-400 font-semibold">ARQUITETURA COGNITIVA</span>
          <span>·</span>
          <span>{skills.length} COMPETÊNCIAS ESPECIALIZADAS</span>
        </div>
        <h1 className="text-xl font-semibold text-white dark:text-white light:text-neutral-950">
          Árvore de Habilidades em Cybersecurity
        </h1>
        <p className="text-xs text-neutral-400 light:text-neutral-600 max-w-xl">
          Grafo progressivo de conhecimento. Complete os nós fundamentais para desbloquear operações avançadas de engenharia defensiva e resposta a incidentes.
        </p>
      </div>

      {/* Abas de Filtro */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap font-mono text-xs ${
                isActive 
                  ? 'bg-neutral-800 text-white font-medium dark:bg-neutral-800 light:bg-neutral-200 light:text-neutral-950' 
                  : 'text-neutral-400 hover:text-white dark:hover:text-white light:text-neutral-600 light:hover:text-neutral-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Matriz de Conhecimento em 2 Zonas */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Coluna Esquerda: Grade de Nós de Habilidade */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredSkills.map((node) => {
              const isSelected = selectedSkill?.id === node.id;
              const isUnlocked = node.unlocked;
              const isMastered = node.mastered;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedSkill(node)}
                  className={`cursor-pointer p-4 rounded border text-left transition-all space-y-2 ${
                    isSelected 
                      ? 'border-neutral-400 bg-neutral-900/60 dark:border-neutral-500 dark:bg-neutral-900/60 light:border-neutral-600 light:bg-neutral-100' 
                      : 'border-neutral-800/80 bg-neutral-900/20 hover:border-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/20 light:border-neutral-200 light:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-neutral-500 light:text-neutral-400 uppercase">
                      NÍVEL {node.tier} · {node.category}
                    </span>
                    {isMastered ? (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 uppercase font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        DOMINADO
                      </span>
                    ) : isUnlocked ? (
                      <span className="font-mono text-[10px] text-sky-400 uppercase">
                        ATIVO
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-neutral-500 uppercase">
                        <Lock className="h-3 w-3" />
                        BLOQUEADO
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-white dark:text-white light:text-neutral-950">
                    {node.title}
                  </h3>

                  <p className="text-xs text-neutral-400 light:text-neutral-500 line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: Detalhe do Nó Selecionado & Ações */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-neutral-800/80 bg-neutral-900/30 p-6 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/30 light:border-neutral-200 light:bg-white space-y-6">
            
            <div className="space-y-1">
              <span className="font-mono text-xs text-neutral-500 uppercase">
                ESPECIFICAÇÃO DA COMPETÊNCIA
              </span>
              <h2 className="text-lg font-semibold text-white dark:text-white light:text-neutral-950">
                {selectedSkill.title}
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="font-mono text-neutral-500 uppercase block">Descrição</span>
                <p className="text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
                  {selectedSkill.description}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-neutral-800/60 dark:border-neutral-800 light:border-neutral-200">
                <span className="font-mono text-neutral-500 uppercase block">Pré-requisitos</span>
                <p className="text-neutral-400 font-mono">
                  {selectedSkill.prerequisites.length > 0 
                    ? selectedSkill.prerequisites.join(', ') 
                    : 'Nenhum (Nó Inicial Fundamental)'}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-neutral-800/60 dark:border-neutral-800 light:border-neutral-200">
                <span className="font-mono text-neutral-500 uppercase block">Experiência Necessária</span>
                <p className="text-neutral-400 font-mono">
                  {selectedSkill.xpRequired} XP
                </p>
              </div>
            </div>

            {/* Ação Prática */}
            <div className="space-y-2 pt-2">
              {selectedSkill.relatedLabId ? (
                <button
                  onClick={() => onOpenLab(selectedSkill.relatedLabId)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Iniciar Lab Conectado</span>
                </button>
              ) : (
                <button
                  onClick={onOpenQuiz}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white"
                >
                  <span>Praticar Conceitos</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
