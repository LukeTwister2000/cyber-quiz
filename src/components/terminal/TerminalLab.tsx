import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';

interface TerminalLabProps {
  labId?: string;
  onOpenMentorWithContext: (topic: string, question: string) => void;
  onOpenDatabase?: () => void;
}

interface CommandOutput {
  id: string;
  command: string;
  output: string;
  isError?: boolean;
  isSuccess?: boolean;
}

export const TerminalLab: React.FC<TerminalLabProps> = ({
  labId,
  onOpenMentorWithContext,
  onOpenDatabase,
}) => {
  const { labs, activeLabId, submitFlag } = useCyberStore();
  
  const currentLab = labs.find(l => l.id === (labId || activeLabId)) || labs[0];
  
  const [currentDir, setCurrentDir] = useState<string>(currentLab.initialDirectory);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: 'init-1',
      command: 'systemctl status lab-sandbox',
      output: `● lab-sandbox.service - CyberQuiz Virtual Execution Enclave\n   Active: active (running) since ${new Date().toLocaleDateString()}\n   Target: ${currentLab.title}\n   Type "help" for a list of sandbox utilities or "cat mission.txt" for objectives.`,
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [flagInput, setFlagInput] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Keep focus on terminal input
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    // Record in history
    setCommandHistory(prev => [trimmed, ...prev]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = '';
    let isError = false;
    let isSuccess = false;

    switch (cmd) {
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'help':
        output = `COMANDOS DISPONÍVEIS NO SANDBOX:
  whoami           Exibe o usuário ativo da sessão
  pwd              Exibe o diretório de trabalho atual
  ls [-la]         Lista arquivos no diretório atual ou especificado
  cd <dir>         Navega entre diretórios (ex: "cd logs", "cd ..", "cd ~")
  cat <arquivo>    Exibe o conteúdo de um arquivo
  grep <p> <arq>   Busca por padrão ou expressão regular no arquivo
  curl <url>       Simula requisição HTTP (ex: "curl http://10.0.0.1/api")
  nmap <alvo>      Executa varredura de portas de rede simulada
  python <arq>     Executa script Python simulado
  submit <flag>    Submete a flag recuperada diretamente
  clear            Limpa a tela do terminal
  help             Exibe este guia operacional`;
        break;

      case 'whoami':
        output = 'student (uid=1000 gid=1000 groups=1000(student),4(adm))';
        break;

      case 'pwd':
        output = currentDir;
        break;

      case 'ls': {
        const isLong = args.includes('-la') || args.includes('-l');
        // Filter files in current directory
        const matchingFiles: string[] = [];
        const prefix = currentDir === '/' ? '/' : currentDir + '/';

        for (const filePath of Object.keys(currentLab.files)) {
          if (filePath.startsWith(prefix)) {
            const rel = filePath.slice(prefix.length);
            if (!rel.includes('/')) {
              matchingFiles.push(rel);
            }
          }
        }

        // Subdirectories
        for (const dirPath of currentLab.directories) {
          if (dirPath !== currentDir && dirPath.startsWith(prefix)) {
            const rel = dirPath.slice(prefix.length);
            if (!rel.includes('/')) {
              matchingFiles.push(rel + '/');
            }
          }
        }

        if (matchingFiles.length === 0) {
          output = '';
        } else if (isLong) {
          output = matchingFiles.map(name => {
            const isDir = name.endsWith('/');
            const perm = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            return `${perm} 1 student student 1024 Sep 23 12:00 ${name}`;
          }).join('\n');
        } else {
          output = matchingFiles.join('   ');
        }
        break;
      }

      case 'cd': {
        const target = args[0] || '~';
        if (target === '~' || target === '/home/student') {
          setCurrentDir('/home/student');
          output = '';
        } else if (target === '..') {
          const parts = currentDir.split('/').filter(Boolean);
          parts.pop();
          setCurrentDir(parts.length ? '/' + parts.join('/') : '/');
          output = '';
        } else if (target === '/') {
          setCurrentDir('/');
          output = '';
        } else {
          const resolved = target.startsWith('/') 
            ? target 
            : (currentDir === '/' ? '/' + target : `${currentDir}/${target}`);
          
          if (currentLab.directories.includes(resolved)) {
            setCurrentDir(resolved);
            output = '';
          } else {
            output = `cd: no such file or directory: ${target}`;
            isError = true;
          }
        }
        break;
      }

      case 'cat': {
        const file = args[0];
        if (!file) {
          output = 'cat: missing operand';
          isError = true;
          break;
        }

        const resolved = file.startsWith('/') 
          ? file 
          : (currentDir === '/' ? '/' + file : `${currentDir}/${file}`);

        if (currentLab.files[resolved]) {
          output = currentLab.files[resolved];
        } else {
          output = `cat: ${file}: No such file or directory`;
          isError = true;
        }
        break;
      }

      case 'grep': {
        const pattern = args[0];
        const file = args[1];
        if (!pattern || !file) {
          output = 'Usage: grep <pattern> <file>';
          isError = true;
          break;
        }
        const resolved = file.startsWith('/') 
          ? file 
          : (currentDir === '/' ? '/' + file : `${currentDir}/${file}`);

        const content = currentLab.files[resolved];
        if (!content) {
          output = `grep: ${file}: No such file or directory`;
          isError = true;
        } else {
          const lines = content.split('\n');
          const cleanPattern = pattern.replace(/['"]/g, '');
          const matches = lines.filter(l => l.toLowerCase().includes(cleanPattern.toLowerCase()));
          output = matches.length ? matches.join('\n') : '';
        }
        break;
      }

      case 'curl': {
        const url = args[0] || 'http://localhost';
        output = `HTTP/1.1 200 OK\nServer: internal-proxy/1.18.0\nContent-Type: application/json\nX-Sec-Header: strict-enclave\n\n{"status": "online", "active_nodes": 4, "flag_hint": "Check /var/log/traffic.log for exfiltration"}`;
        break;
      }

      case 'nmap': {
        const target = args[0] || '10.0.0.1';
        output = `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${target}\nHost is up (0.00042s latency).\nNot shown: 997 closed tcp ports\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n8080/tcp open  http-proxy\n\nNmap done: 1 IP address scanned in 0.42 seconds`;
        break;
      }

      case 'python':
      case 'python3': {
        const script = args[0];
        if (script) {
          const resolved = script.startsWith('/') 
            ? script 
            : (currentDir === '/' ? '/' + script : `${currentDir}/${script}`);
          if (currentLab.files[resolved]) {
            output = `[Python 3.11 Execution]\n[+] Initializing probe socket...\n[+] Socket connected: 10.0.0.1:22 [OPEN]\n[+] Probe routine completed successfully.`;
          } else {
            output = `python3: can't open file '${script}': [Errno 2] No such file or directory`;
            isError = true;
          }
        } else {
          output = 'Python 3.11.8 (main, Feb 12 2026)\nType "exit()" to leave.';
        }
        break;
      }

      case 'submit': {
        const flag = args[0];
        if (!flag) {
          output = 'Usage: submit CYBER{your_flag_here}';
          isError = true;
        } else {
          const res = submitFlag(currentLab.id, flag);
          output = res.message;
          if (res.success) isSuccess = true;
          else isError = true;
        }
        break;
      }

      default:
        output = `command not found: ${cmd}. Type "help" for available commands.`;
        isError = true;
    }

    setHistory(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        command: trimmed,
        output,
        isError,
        isSuccess,
      }
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIdx = historyIndex + 1;
        setHistoryIndex(newIdx);
        setInputVal(commandHistory[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setInputVal(commandHistory[newIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete for common commands
      const commands = ['whoami', 'pwd', 'ls', 'cd', 'cat', 'grep', 'curl', 'nmap', 'python', 'submit', 'clear', 'help'];
      const match = commands.find(c => c.startsWith(inputVal.trim()));
      if (match) setInputVal(match + ' ');
    }
  };

  const handleManualFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim()) return;

    const res = submitFlag(currentLab.id, flagInput.trim());
    setSubmissionStatus(res.message);
    if (res.success) {
      setHistory(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          command: `submit ${flagInput.trim()}`,
          output: res.message,
          isSuccess: true,
        }
      ]);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      
      {/* Lab Header & Objective */}
      {onOpenDatabase && (
        <div className="border border-rose-900/50 bg-rose-950/20 p-3.5 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping inline-block" />
            <span className="text-rose-300 font-bold uppercase">MÓDULO INTERATIVO DISPONÍVEL:</span>
            <span className="text-neutral-300 font-sans">Simulador de Defesa de Banco de Dados & Firewall Perimetral</span>
          </div>
          <button
            onClick={onOpenDatabase}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium transition-colors shrink-0 text-center"
          >
            Abrir Defesa de Banco de Dados →
          </button>
        </div>
      )}

      <div className="border border-neutral-800/80 bg-neutral-900/30 p-5 rounded dark:border-neutral-800 dark:bg-neutral-900/30 light:border-neutral-200 light:bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="text-emerald-400 uppercase font-semibold">LABORATÓRIO PRÁTICO</span>
            <span>·</span>
            <span className="uppercase">{currentLab.title}</span>
            <span>·</span>
            <span className="text-neutral-500 font-mono">+{currentLab.xpReward} XP</span>
          </div>
          <h2 className="text-base font-semibold text-white dark:text-white light:text-neutral-950">
            {currentLab.objective}
          </h2>
        </div>

        {/* Flag Submission Input */}
        <form onSubmit={handleManualFlagSubmit} className="flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="CYBER{...}"
            value={flagInput}
            onChange={(e) => setFlagInput(e.target.value)}
            className="w-48 sm:w-56 px-3 py-1.5 text-xs font-mono bg-neutral-950 border border-neutral-800 rounded text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 dark:border-neutral-800 light:bg-neutral-50 light:border-neutral-300 light:text-neutral-900"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-mono font-medium uppercase text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded transition-colors dark:bg-neutral-800 dark:hover:bg-neutral-700 light:bg-neutral-900 light:text-white"
          >
            Submeter Flag
          </button>
        </form>
      </div>

      {submissionStatus && (
        <div className={`p-3 rounded text-xs font-mono ${
          submissionStatus.includes('ACCESS GRANTED') 
            ? 'bg-emerald-950/30 border border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/30 border border-rose-500/40 text-rose-300'
        }`}>
          {submissionStatus}
        </div>
      )}

      {/* Professional Terminal Window */}
      <div 
        onClick={handleTerminalClick}
        className="rounded border border-neutral-800 bg-[#0A0D12] overflow-hidden shadow-2xl font-mono text-xs dark:border-neutral-800 light:border-neutral-300"
      >
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/80 border-b border-neutral-800 text-[11px] text-neutral-400 select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-700 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-700 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-700 inline-block" />
            </div>
            <span className="text-neutral-300 font-medium ml-2">
              student@cyberquiz-lab: {currentDir}
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-500">
            <span className="hidden sm:inline">BASH 5.2.15</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenMentorWithContext(currentLab.title, currentLab.hint);
              }}
              title="Solicitar orientação ao Cyber Mentor"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[11px]">Dica</span>
            </button>
          </div>
        </div>

        {/* Terminal Screen / Output Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[500px] overflow-y-auto leading-relaxed text-neutral-300">
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-emerald-400">student@cyberquiz:</span>
                <span className="text-sky-400">{currentDir}</span>
                <span className="text-neutral-500">$</span>
                <span className="text-neutral-100 font-medium">{item.command}</span>
              </div>
              {item.output && (
                <div className={`whitespace-pre-wrap pl-2 ${
                  item.isError 
                    ? 'text-rose-400' 
                    : item.isSuccess 
                    ? 'text-emerald-400 font-semibold' 
                    : 'text-neutral-300'
                }`}>
                  {item.output}
                </div>
              )}
            </div>
          ))}

          {/* Active Command Line Prompt */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-1">
            <span className="text-emerald-400">student@cyberquiz:</span>
            <span className="text-sky-400">{currentDir}</span>
            <span className="text-neutral-500">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              className="flex-1 bg-transparent border-none text-neutral-100 focus:outline-none font-mono text-xs caret-emerald-400"
            />
          </form>

          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Terminal Quick Utility Shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
        <div className="flex items-center gap-4">
          <span>Atalhos: Tab (autocompletar), ↑/↓ (histórico de comandos)</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setInputVal('ls -la')}
            className="hover:text-neutral-300 underline underline-offset-4"
          >
            $ ls -la
          </button>
          <button 
            onClick={() => setInputVal('cat notes.txt')}
            className="hover:text-neutral-300 underline underline-offset-4"
          >
            $ cat notes.txt
          </button>
          <button 
            onClick={() => setInputVal('help')}
            className="hover:text-neutral-300 underline underline-offset-4"
          >
            $ help
          </button>
        </div>
      </div>

    </div>
  );
};
