import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, HelpCircle, CheckCircle2, ShieldCheck, Flame, Gauge, Activity } from 'lucide-react';

interface PlainEnglishAssistantProps {
  machineTemperature?: number;
  machinePressure?: number;
  machineVibration?: number;
  flaggedCount?: number;
  totalBatches?: number;
  roleTitle?: string;
}

export const PlainEnglishAssistant: React.FC<PlainEnglishAssistantProps> = ({
  machineTemperature = 210.5,
  machinePressure = 4.82,
  machineVibration = 1.18,
  flaggedCount = 0,
  totalBatches = 24,
  roleTitle = 'Trained Operator',
}) => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: `Hello ${roleTitle}! I am your Plain-Language Machine Assistant. Ask me anything about machine safety, today's readings, or find machine problems.`,
      time: 'Just now',
    },
  ]);

  const quickQuestions = [
    'Is my machine safe?',
    'What are the safe limits?',
    'Any machine problems predicted?',
    'How do I check the safety guard?',
  ];

  const generateAnswer = (userQuery: string): string => {
    const q = userQuery.toLowerCase().trim();

    if (q.includes('safe') || q.includes('is it safe') || q.includes('ready')) {
      const isTempSafe = machineTemperature >= 195 && machineTemperature <= 235;
      const isPressSafe = machinePressure >= 4.0 && machinePressure <= 5.8;
      const isVibSafe = machineVibration <= 2.2;

      if (isTempSafe && isPressSafe && isVibSafe) {
        return `✅ Yes, your machine is SAFE and READY to run! Heat is at ${machineTemperature}°C (safe range is 195–235°C), hydraulic pressure is ${machinePressure} bar (safe range is 4.0–5.8 bar), and vibration is smooth at ${machineVibration} mm/s. The safety guard is working normally.`;
      } else {
        const warnings = [];
        if (!isTempSafe) warnings.push(`heat is ${machineTemperature}°C (safe range 195–235°C)`);
        if (!isPressSafe) warnings.push(`pressure is ${machinePressure} bar (safe range 4.0–5.8 bar)`);
        if (!isVibSafe) warnings.push(`vibration is ${machineVibration} mm/s (should be under 2.2 mm/s)`);
        return `⚠️ Needs Attention: Please check your machine before continuing — ${warnings.join(', ')}. If any reading stays outside limits, stop the machine and notify a quality officer.`;
      }
    }

    if (q.includes('limit') || q.includes('temperature') || q.includes('heat') || q.includes('pressure') || q.includes('vibration')) {
      return `📊 Safe Limits & Warnings Guide:\n• Heat: Normal 195°C to 235°C (warning above 235°C, emergency stop above 248°C)\n• Pressure: Normal 4.0 to 5.8 bar (warning below 4.0 or above 5.8 bar)\n• Vibration: Normal under 2.2 mm/s (warning above 2.2 mm/s)\n• Machine Speed: Normal 1300 to 1650 RPM.`;
    }

    if (q.includes('problem') || q.includes('defect') || q.includes('ai4i') || q.includes('predict') || q.includes('machine problem')) {
      if (flaggedCount > 0) {
        return `🔍 Find Machine Problems: The AI4I system has flagged ${flaggedCount} item(s) that need inspection. You can view all details in the "Find Machine Problems" tab to see root causes like Heat Dissipation, Tool Wear, or Power strain.`;
      }
      return `🟢 No machine defects detected! All ${totalBatches} batches produced on this shift have passed with 0 defects predicted. The AI4I model reports healthy machine operation.`;
    }

    if (q.includes('guard') || q.includes('safety guard') || q.includes('setup') || q.includes('checklist')) {
      return `🛡️ Safety Guard Check: The safety shield interlock is currently green and active. Before starting production, ensure spindle bearings are lubricated, fluid levels are adequate, and emergency stop is tested.`;
    }

    if (q.includes('how to log') || q.includes('reading') || q.includes('enter')) {
      return `📝 To enter machine readings: Move the sliders to match your machine's gauges, then tap "Log Machine Readings". The system instantly checks if the batch is safe or needs attention.`;
    }

    return `I heard your request: "${userQuery}". Machine status is currently Ready. Heat is ${machineTemperature}°C, pressure is ${machinePressure} bar, and safety guard is active. If you need immediate assistance, speak with your shift quality officer or check the "Find Machine Problems" console.`;
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || query).trim();
    if (!text) return;

    const userMessage = { sender: 'user' as const, text, time: 'Just now' };
    const answer = generateAnswer(text);
    const botMessage = { sender: 'assistant' as const, text: answer, time: 'Just now' };

    setConversation((prev) => [...prev, userMessage, botMessage]);
    setQuery('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Natural Language Interface (NLI)</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Ask Machine in Plain English
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Type or tap any question to get an instant, plain-language answer about machine quality &amp; safety.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plain English NLP</span>
          </span>
        </div>
      </div>

      {/* Quick Questions Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400">Quick questions:</span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Conversation Thread */}
      <div className="max-h-60 overflow-y-auto space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs">
        {conversation.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs font-medium'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Type a question, e.g. "Is my machine safe?" or "What are the safe limits?"'
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-2xs"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Ask</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
