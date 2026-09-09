'use client';

import React, { useState } from 'react';
import { api } from '../../lib/api';
import { Sparkles, MessageSquare, X, Send, Bot, User as UserIcon } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello Sarah! I am your AI Team Copilot. Ask me about weekly blockers, completed deliverables, project workload distribution, or requesting an executive summary.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.chatWithAi(text);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, I encountered an issue: ${err.message || 'Unknown error'}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'What are the key blockers this week?',
    'Summarize this week team activity',
    'Which project received the most hours?',
    'Show top team achievements',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-xl hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300 font-semibold text-xs border border-white/20"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>AI Team Assistant</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[540px] bg-surface border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">AI Team Assistant</h4>
                <p className="text-[10px] text-indigo-300">RAG over PostgreSQL Reports</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 border-b border-slate-800/80 bg-slate-900/50 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] bg-slate-800/90 text-slate-300 hover:text-white hover:bg-indigo-950 hover:border-indigo-700 border border-slate-700 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-500/30">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Bot className="w-4 h-4 animate-bounce text-indigo-400" />
                <span>Analyzing reports...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about team tasks, blockers, or workload..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shadow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
