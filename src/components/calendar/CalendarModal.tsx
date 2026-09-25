import React, { useState } from 'react';
import { Calendar, X, ExternalLink, Download, Clock, Check } from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const { user } = useCyberStore();
  const [selectedTime, setSelectedTime] = useState('19:00');
  const [eventSaved, setEventSaved] = useState(false);

  if (!isOpen) return null;

  // Criar link para Google Calendar
  const buildGoogleCalendarUrl = () => {
    const title = encodeURIComponent('CYBERQUIZ - Prática Diária de Cybersecurity');
    const details = encodeURIComponent('Sessão de 20 minutos de prática deliberada: Rastreamento de pacotes de rede, segurança e privilégios em Linux, investigação CTF e repetição espaçada.');
    const location = encodeURIComponent('https://cyberquiz.academy');
    
    const today = new Date();
    const [hours, minutes] = selectedTime.split(':').map(Number);
    today.setHours(hours, minutes, 0, 0);

    const startIso = today.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const end = new Date(today.getTime() + 25 * 60 * 1000);
    const endIso = end.toISOString().replace(/-|:|\.\d\d\d/g, '');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startIso}/${endIso}&recur=RRULE:FREQ=DAILY`;
  };

  // Gerar e baixar arquivo .ics para Outlook / Apple Calendar
  const downloadIcsFile = () => {
    const today = new Date();
    const [hours, minutes] = selectedTime.split(':').map(Number);
    today.setHours(hours, minutes, 0, 0);
    const startIso = today.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const end = new Date(today.getTime() + 25 * 60 * 1000);
    const endIso = end.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CYBERQUIZ//Treinamento de Cybersecurity//PT
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:CYBERQUIZ - Hábito Diário de Cybersecurity
DESCRIPTION:Sessão prática de 20 minutos na plataforma CyberQuiz.
LOCATION:https://cyberquiz.academy
STATUS:CONFIRMED
RRULE:FREQ=DAILY
DTSTART:${startIso}
DTEND:${endIso}
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Hora do seu treinamento diário de cybersecurity!
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cyberquiz-estudo-diario.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setEventSaved(true);
    setTimeout(() => setEventSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md border border-neutral-800 bg-[#0B0E14] rounded-lg p-6 space-y-6 dark:border-neutral-800 light:border-neutral-300 light:bg-white shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 dark:border-neutral-800 light:border-neutral-200">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sky-400" />
            <h2 className="font-mono text-xs font-semibold text-white dark:text-white light:text-neutral-950 uppercase tracking-wider">
              SINCRONIZAÇÃO COM CALENDÁRIO EXTERNO
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-400 light:text-neutral-600 leading-relaxed">
          Garanta sua sequência de estudos agendando sessões diárias de 20 minutos de prática deliberada diretamente em seu calendário pessoal.
        </p>

        {/* Preferência de Horário */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-neutral-500 block">
            Horário Diário Preferido:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="px-3 py-2 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-neutral-600 dark:border-neutral-800 light:bg-neutral-50 light:border-neutral-300 light:text-neutral-900"
            />
            <span className="text-xs text-neutral-500 font-mono">20 min / dia</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3 pt-2">
          <a
            href={buildGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-100/10 hover:bg-neutral-100/20 border border-neutral-700/80 rounded transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 light:bg-neutral-900 light:text-white"
          >
            <span>Sincronizar com Google Agenda</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={downloadIcsFile}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded transition-colors dark:border-neutral-800 light:border-neutral-300 light:text-neutral-800"
          >
            {eventSaved ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5" />}
            <span>{eventSaved ? 'Arquivo .ICS Baixado' : 'Baixar .ICS (Outlook & Apple)'}</span>
          </button>
        </div>

        <div className="text-[11px] text-neutral-500 font-mono text-center">
          Inclui alarme com 15 minutos de antecedência.
        </div>

      </div>
    </div>
  );
};
