import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RotateCw, 
  Copy, 
  Check, 
  X, 
  Smartphone, 
  Laptop, 
  ShieldCheck, 
  Cloud,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';

interface MultiDeviceSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiDeviceSyncModal: React.FC<MultiDeviceSyncModalProps> = ({ isOpen, onClose }) => {
  const { 
    isOnline, 
    syncState, 
    syncToken, 
    lastSyncTimestamp, 
    pushSyncToCloud, 
    pullSyncFromCloud,
    setSyncToken
  } = useCyberStore();

  const [inputToken, setInputToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCopyToken = () => {
    navigator.clipboard.writeText(syncToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleManualPush = async () => {
    setIsProcessing(true);
    const success = await pushSyncToCloud();
    setIsProcessing(false);
    if (success) {
      setSyncMessage('Progresso local sincronizado com o enclave em nuvem.');
    } else {
      setSyncMessage('Falha ao sincronizar. Verifique a conexão com a internet.');
    }
    setTimeout(() => setSyncMessage(null), 4000);
  };

  const handleManualPull = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) return;

    setIsProcessing(true);
    const res = await pullSyncFromCloud(inputToken.trim());
    setIsProcessing(false);
    setSyncMessage(res.message);
    if (res.success) {
      setInputToken('');
    }
    setTimeout(() => setSyncMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg border border-neutral-800 bg-[#0B0E14] rounded-lg p-6 sm:p-7 space-y-6 dark:border-neutral-800 light:border-neutral-300 light:bg-white shadow-2xl">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 dark:border-neutral-800 light:border-neutral-200">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-sky-400" />
            <h2 className="font-mono text-xs font-semibold text-white dark:text-white light:text-neutral-950 uppercase tracking-wider">
              SINCRONIZAÇÃO MULTIDISPOSITIVO & RESILIÊNCIA OFFLINE
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Banner de Status de Rede e Offline */}
        <div className={`p-4 rounded border text-xs flex items-center justify-between ${
          isOnline 
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
            : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
        }`}>
          <div className="flex items-center gap-3">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-emerald-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-amber-400" />
            )}
            <div>
              <span className="font-mono font-semibold block uppercase">
                {isOnline ? 'ONLINE · NUVEM PRONTA PARA SINCRONIZAR' : 'MODO OFFLINE ATIVO'}
              </span>
              <span className="text-[11px] text-neutral-400">
                {isOnline 
                  ? 'Todo o progresso local é espelhado automaticamente entre os dispositivos pareados.' 
                  : 'Todos os laboratórios, quizzes e CTFs funcionam 100% offline. A sincronização ocorrerá automaticamente ao reconectar.'}
              </span>
            </div>
          </div>

          {isOnline && (
            <button
              onClick={handleManualPush}
              disabled={isProcessing}
              className="p-2 rounded border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              title="Disparar sincronização agora"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        {/* Código de Pareamento do Dispositivo */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase text-neutral-400 block">
            Seu Código de Pareamento de Dispositivo:
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 rounded border border-neutral-800 bg-neutral-900/60 font-mono text-xs text-emerald-400 font-semibold truncate dark:border-neutral-800 light:border-neutral-300 light:bg-neutral-50">
              {syncToken}
            </div>
            <button
              onClick={handleCopyToken}
              className="px-3 py-2 rounded border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
          <span className="text-[10px] font-mono text-neutral-500 block">
            Insira este código no seu celular, tablet ou estação de trabalho secundária para compartilhar o progresso.
          </span>
        </div>

        {/* Formulário de Pareamento de Dispositivo Secundário */}
        <div className="space-y-3 pt-2 border-t border-neutral-800/80 dark:border-neutral-800 light:border-neutral-200">
          <label className="text-[11px] font-mono uppercase text-neutral-400 block">
            Vincular Código de Outro Dispositivo:
          </label>
          <form onSubmit={handleManualPull} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="ex: CQ-SYNC-XXXX"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="flex-1 px-3 py-2 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 dark:border-neutral-800 light:bg-neutral-50 light:border-neutral-300 light:text-neutral-900"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputToken.trim()}
              className="px-4 py-2 text-xs font-mono uppercase font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded transition-colors disabled:opacity-40"
            >
              Mesclar & Puxar
            </button>
          </form>
        </div>

        {syncMessage && (
          <div className="p-3 rounded bg-neutral-900/60 border border-neutral-800 text-xs font-mono text-neutral-300">
            {syncMessage}
          </div>
        )}

        {/* Rodapé com Informações de Sincronização */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:border-neutral-800 light:border-neutral-200">
          <span>Última Sincronização: {lastSyncTimestamp ? new Date(lastSyncTimestamp).toLocaleTimeString('pt-BR') : 'Nunca'}</span>
          <span>Status: {syncState.toUpperCase()}</span>
        </div>

      </div>
    </div>
  );
};
