import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Terminal, 
  Brain, 
  Loader2, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

interface CyberMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialContext?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const CyberMentorModal: React.FC<CyberMentorModalProps> = ({
  isOpen,
  onClose,
  initialTopic,
  initialContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'mentor-welcome',
      role: 'model',
      content: `ESTAÇÃO DE PESQUISA DO CYBER MENTOR INICIALIZADA.\n\nSou seu instrutor de pesquisa em cybersecurity. Nosso foco é a investigação aprofundada — dissecando cabeçalhos de pacotes, privilégios de kernel, limites de memória e técnicas de adversários de forma analítica.\n\nDigite sua dúvida técnica ou selecione um atalho diagnóstico abaixo.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useDeepThinking, setUseDeepThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTopic || initialContext) {
      const topicPrompt = `Gostaria de aprofundar meu entendimento neste conceito: ${initialTopic || ''}. Contexto técnico: ${initialContext || ''}`;
      sendMessage(topicPrompt);
    }
  }, [initialTopic, initialContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const sendMessage = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          useDeepThinking,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'model',
        content: data.text || 'Nenhuma resposta gerada.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'model',
          content: 'Inquérito diagnóstico interrompido. Verifique sua conexão ou a telemetria do servidor.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shortcuts = [
    'Por que DNS opera sobre UDP por padrão na porta 53?',
    'Como o bit SUID em binários possibilita escalação de privilégios?',
    'Qual a diferença mecanicista entre Blind SQLi e Union SQLi?',
    'Como calcular o endereço de broadcast e rede em uma sub-rede /27?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl border border-neutral-800 bg-[#0B0E14] rounded-lg shadow-2xl flex flex-col h-[650px] overflow-hidden dark:border-neutral-800 light:border-neutral-300 light:bg-white">
        
        {/* Barra Superior do Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <div>
              <span className="font-mono text-xs font-semibold text-white dark:text-white light:text-neutral-950 uppercase tracking-wider block">
                CYBER MENTOR · INVESTIGADOR DE SISTEMAS
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                MOTOR DE RACIOCÍNIO PEDAGÓGICO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Seletor de Raciocínio Profundo */}
            <button
              onClick={() => setUseDeepThinking(!useDeepThinking)}
              title="Alternar modo de raciocínio aprofundado para análises arquiteturais"
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono transition-colors border ${
                useDeepThinking 
                  ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300' 
                  : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Brain className="h-3 w-3" />
              <span>Raciocínio: {useDeepThinking ? 'PROFUNDO' : 'RÁPIDO'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-white dark:hover:text-white light:hover:text-neutral-900 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Fluxo de Mensagens */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-xs">
          {messages.map((msg) => {
            const isModel = msg.role === 'model';
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col space-y-1.5 ${isModel ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                  <span>{isModel ? 'MENTOR' : 'OPERADOR'}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className={`relative group max-w-[90%] rounded p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                  isModel 
                    ? 'border border-neutral-800/80 bg-neutral-900/40 text-neutral-200 dark:border-neutral-800 dark:bg-neutral-900/40 light:border-neutral-200 light:bg-neutral-50 light:text-neutral-900' 
                    : 'bg-neutral-800 text-white dark:bg-neutral-800 light:bg-neutral-900 light:text-white'
                }`}>
                  {msg.content}
                  
                  {isModel && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-white transition-opacity"
                      title="Copiar resposta"
                    >
                      {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 py-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
              <span>Analisando lógica de sistemas...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Atalhos Rápidos de Consulta */}
        <div className="px-5 py-2 border-t border-neutral-800/60 bg-neutral-950/40 overflow-x-auto flex items-center gap-2 text-[11px] font-mono text-neutral-400">
          <span className="text-neutral-500 uppercase shrink-0">Consultas:</span>
          {shortcuts.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(sc)}
              className="px-2 py-1 rounded border border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors shrink-0"
            >
              {sc}
            </button>
          ))}
        </div>

        {/* Barra de Entrada */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputVal);
          }}
          className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center gap-2 dark:border-neutral-800 light:border-neutral-200 light:bg-white"
        >
          <input
            type="text"
            placeholder="Pergunte ao Cyber Mentor sobre protocolos, vulnerabilidades ou comandos..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs font-mono bg-neutral-900/60 border border-neutral-800 rounded text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 dark:border-neutral-800 light:bg-neutral-50 light:border-neutral-300 light:text-neutral-900"
          />
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
