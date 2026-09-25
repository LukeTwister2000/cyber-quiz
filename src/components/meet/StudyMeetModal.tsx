import React, { useState, useEffect } from 'react';
import { 
  Users, 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Hand, 
  MessageSquare, 
  Send, 
  Check, 
  Clock, 
  Share2 
} from 'lucide-react';
import { INITIAL_PEERS } from '../../data/curriculum';
import { useCyberStore } from '../../store/useCyberStore';

interface StudyMeetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyMeetModal: React.FC<StudyMeetModalProps> = ({ isOpen, onClose }) => {
  const { questions, answerQuestion, user } = useCyberStore();

  const [peers, setPeers] = useState(INITIAL_PEERS);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  
  // Quiz colaborativo na sala
  const [roomQuestionIndex, setRoomQuestionIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [roomTimer, setRoomTimer] = useState(45);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Elena Rostova', text: 'Pessoal, vamos resolver a questão de inspeção de pacotes juntos!', time: '14:20' },
    { sender: 'Marcus Vance', text: 'Verificando os flags da tabela ARP agora.', time: '14:21' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const currentRoomQuestion = questions[roomQuestionIndex] || questions[0];

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setRoomTimer(prev => (prev > 0 ? prev - 1 : 45));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        sender: user.codename,
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    setChatInput('');
  };

  const handleSelectAnswer = (optionId: string) => {
    setSelectedOpt(optionId);
    answerQuestion(currentRoomQuestion.id, optionId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl border border-neutral-800 bg-[#0A0D12] rounded-lg shadow-2xl flex flex-col h-[700px] overflow-hidden dark:border-neutral-800 light:border-neutral-300 light:bg-white">
        
        {/* Cabeçalho da Sala */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold text-white dark:text-white light:text-neutral-950 uppercase tracking-wider">
              SALA DE ESTUDOS CYBER #402 · SPRINT COLABORATIVO
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Clock className="h-3.5 w-3.5 text-neutral-500" />
              <span>TEMPO DA RODADA: {roomTimer}s</span>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-white dark:hover:text-white light:hover:text-neutral-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Grade Principal: Colegas (Topo) + Quiz Interativo & Chat (Base) */}
        <div className="flex-1 grid grid-rows-12 overflow-hidden">
          
          {/* Grade de Presença dos Colegas (5 linhas superiores) */}
          <div className="row-span-5 border-b border-neutral-800 bg-neutral-950/60 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 dark:border-neutral-800 light:border-neutral-200 light:bg-neutral-50">
            
            {/* Estudante (Você) */}
            <div className="relative rounded border border-neutral-800 bg-neutral-900/80 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="text-emerald-400 font-semibold">{user.codename} (Você)</span>
                <span className="tabular-nums">{user.xp} XP</span>
              </div>
              <div className="my-auto text-center">
                <div className="h-12 w-12 rounded-full bg-neutral-800 border border-neutral-700 mx-auto flex items-center justify-center font-mono font-bold text-neutral-300">
                  {user.avatar}
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>{handRaised ? '✋ Mão Levantada' : 'Observando'}</span>
                <div className="flex items-center gap-1">
                  {isMicOn ? <Mic className="h-3 w-3 text-emerald-400" /> : <MicOff className="h-3 w-3 text-rose-400" />}
                  {isCamOn ? <Video className="h-3 w-3 text-emerald-400" /> : <VideoOff className="h-3 w-3 text-neutral-600" />}
                </div>
              </div>
            </div>

            {/* Colegas de Sala */}
            {peers.map((peer) => (
              <div key={peer.id} className="relative rounded border border-neutral-800/80 bg-neutral-900/40 p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span className="truncate">{peer.name}</span>
                  <span className="tabular-nums">{peer.score} XP</span>
                </div>
                <div className="my-auto text-center">
                  <div className="h-12 w-12 rounded-full bg-neutral-800/80 border border-neutral-700/60 mx-auto flex items-center justify-center font-mono font-semibold text-neutral-400">
                    {peer.avatar}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span className="truncate max-w-[90px]">{peer.statusText}</span>
                  <div className="flex items-center gap-1">
                    {peer.isMuted ? <MicOff className="h-3 w-3 text-neutral-600" /> : <Mic className="h-3 w-3 text-emerald-400" />}
                    {peer.hasCam ? <Video className="h-3 w-3 text-emerald-400" /> : <VideoOff className="h-3 w-3 text-neutral-600" />}
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* 7 Linhas Inferiores: Questão Sincronizada + Chat */}
          <div className="row-span-7 grid md:grid-cols-12 overflow-hidden">
            
            {/* Esquerda: Questão da Rodada (7 colunas) */}
            <div className="md:col-span-7 p-6 overflow-y-auto space-y-4 border-r border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="text-sky-400 uppercase font-semibold">QUESTÃO SINCRONIZADA</span>
                <span>{currentRoomQuestion.moduleTitle}</span>
              </div>

              <h3 className="text-sm sm:text-base font-medium text-white dark:text-white light:text-neutral-950 leading-relaxed">
                {currentRoomQuestion.question}
              </h3>

              <div className="space-y-2 pt-2">
                {currentRoomQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOpt === opt.id;
                  const isCorrect = currentRoomQuestion.correctOptionId === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer(opt.id)}
                      className={`w-full text-left p-3 rounded border text-xs transition-colors flex items-center justify-between ${
                        isSelected 
                          ? isCorrect 
                            ? 'border-emerald-500 bg-emerald-950/20 text-emerald-200' 
                            : 'border-rose-500 bg-rose-950/20 text-rose-200'
                          : 'border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:border-neutral-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-neutral-500">{String.fromCharCode(65 + idx)}</span>
                        <span>{opt.text}</span>
                      </div>
                      {isSelected && isCorrect && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="font-mono text-neutral-500">Consenso: Elena escolheu A · Marcus escolheu A</span>
                <button
                  onClick={() => {
                    setSelectedOpt(null);
                    setRoomQuestionIndex((prev) => (prev + 1) % questions.length);
                  }}
                  className="font-mono text-emerald-400 hover:underline"
                >
                  Próxima Questão da Sala →
                </button>
              </div>
            </div>

            {/* Direita: Chat de Estudo (5 colunas) */}
            <div className="md:col-span-5 flex flex-col h-full bg-[#080B10] dark:bg-[#080B10] light:bg-neutral-50">
              <div className="px-4 py-2 border-b border-neutral-800 text-[11px] font-mono text-neutral-400 uppercase">
                DISCUSSÃO DO GRUPO DE ESTUDO
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                      <span className="font-semibold text-neutral-400">{msg.sender}</span>
                      <span>·</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-neutral-300 text-xs leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="p-3 border-t border-neutral-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Discutir hipóteses e pistas..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs"
                >
                  <Send className="h-3 w-3" />
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Barra de Controles da Chamada */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between dark:border-neutral-800 light:border-neutral-200 light:bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-2 rounded border text-xs transition-colors ${
                isMicOn ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20' : 'border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setIsCamOn(!isCamOn)}
              className={`p-2 rounded border text-xs transition-colors ${
                isCamOn ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20' : 'border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {isCamOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setHandRaised(!handRaised)}
              className={`p-2 rounded border text-xs transition-colors ${
                handRaised ? 'border-amber-500 text-amber-400 bg-amber-950/20' : 'border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Hand className="h-4 w-4" />
            </button>
          </div>

          <div className="text-xs font-mono text-neutral-500">
            Código da Sala: CYBER-402
          </div>
        </div>

      </div>
    </div>
  );
};
