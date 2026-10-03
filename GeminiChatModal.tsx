import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Calculator,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  Bike,
  ShieldCheck,
} from 'lucide-react';
import { HeroVehicle } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export type AssistantRole = 'general' | 'fast' | 'finance';

interface RoleOption {
  id: AssistantRole;
  label: string;
  modelName: string;
  modelBadge: string;
  icon: typeof Bot;
  description: string;
  accentColor: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'general',
    label: 'Showroom Advisor',
    modelName: 'gemini-3.5-flash',
    modelBadge: 'General • gemini-3.5-flash',
    icon: Bike,
    description: 'Vehicle recommendations, features, comparisons, and price inquiries.',
    accentColor: 'text-[#D6181F] border-[#D6181F]/30 bg-[#D6181F]/10',
  },
  {
    id: 'fast',
    label: 'Quick Specs',
    modelName: 'gemini-3.1-flash-lite',
    modelBadge: 'Fast • gemini-3.1-flash-lite',
    icon: Zap,
    description: 'Instant technical data, power, torque, tyre sizes, and dimensions.',
    accentColor: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  },
  {
    id: 'finance',
    label: 'EMI & Loan Strategist',
    modelName: 'gemini-3.5-flash',
    modelBadge: 'Complex • gemini-3.5-flash',
    icon: Calculator,
    description: 'Financing options, monthly installments, down payments, and schemes.',
    accentColor: 'text-[#00FF88] border-[#00FF88]/30 bg-[#00FF88]/10',
  },
];

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicle?: HeroVehicle | null;
}

export const GeminiChatModal: React.FC<GeminiChatModalProps> = ({
  isOpen,
  onClose,
  initialVehicle,
}) => {
  const [selectedRole, setSelectedRole] = useState<AssistantRole>('general');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Namaste! Welcome to **Shri Ram Hero** AI Customer Assistance. 🏍️\n\nI am your digital dealership advisor powered by Gemini AI. I can assist you with:\n• **Hero Two-Wheeler Selection**: Splendor+, Glamour, Xtreme 125R, Karizma XMR, Mavrick 440, and VIDA EVs\n• **Technical Specs & Real-World Mileage**\n• **On-Road Pricing & EMI Calculator Schemes**\n• **Dealership Inquiries & Availability**\n\nHow may I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Insert context prompt if opened with a specific vehicle
  useEffect(() => {
    if (isOpen && initialVehicle) {
      const vehicleContextMsg: ChatMessage = {
        id: `context-${Date.now()}`,
        role: 'model',
        content: `I see you are viewing the **${initialVehicle.name}** (${initialVehicle.price})!\nWould you like me to breakdown its **engine performance**, **real-world ${initialVehicle.specs.mileage} efficiency**, **available colors**, or calculate an **EMI scheme**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash',
      };
      setMessages((prev) => {
        // avoid duplicating context message
        if (prev.some((m) => m.content.includes(initialVehicle.name))) return prev;
        return [...prev, vehicleContextMsg];
      });
    }
  }, [isOpen, initialVehicle]);

  const activeRoleOption = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare payload with conversation history
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          model: activeRoleOption.modelName,
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const modelReply: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply || 'I received your inquiry and our showroom specialists are ready to assist.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model || activeRoleOption.modelName,
      };

      setMessages((prev) => [...prev, modelReply]);
    } catch (err) {
      console.error('Failed to get Gemini response:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `I encountered a momentary connection issue. You can still check vehicle specs in the showroom or contact Shri Ram Hero (Dehra Mod, Nadbai, Bharatpur, Raj.) directly at Agency No. **8890992086** for instant quotes and free accessories details!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'offline-mode',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: `Conversation restarted. How may I assist you with Hero MotoCorp vehicles today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: activeRoleOption.modelName,
      },
    ]);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestedQueries = [
    'Real-world mileage of Splendor+ XTEC',
    'Compare Xtreme 125R vs Glamour XTEC',
    'Calculate EMI for Mavrick 440 with ₹30k down',
    'What are the features of VIDA V1 Pro?',
  ];

  if (!isOpen) return null;

  return (
    <div
      id="gemini-chat-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl h-[88vh] max-h-[750px] bg-[#111111] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#181818] via-[#141414] to-[#1a1414] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6181F] to-black border border-[#D6181F]/50 flex items-center justify-center text-white shadow-md shadow-[#D6181F]/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00FF88] rounded-full border-2 border-[#111]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Rajdhani']">
                  Shri Ram Hero AI Assistant
                </h3>
                <span className="text-[10px] bg-[#D6181F]/20 text-[#D6181F] font-bold px-1.5 py-0.5 rounded border border-[#D6181F]/30 uppercase">
                  Gemini
                </span>
              </div>
              <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <span>Multi-turn consultation</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-300 font-mono text-[10px]">{activeRoleOption.modelBadge}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              title="Reset conversation"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 border border-white/5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px] font-semibold uppercase">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/5"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role / Persona Selector Bar */}
        <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-1">
            Assistant Mode:
          </span>
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? role.accentColor + ' shadow-sm'
                    : 'border-white/5 bg-[#181818] text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>

        {/* Message Thread (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0d0d0d] scroll-smooth">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F] shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#D6181F] text-white rounded-br-xs shadow-md shadow-[#D6181F]/20'
                      : 'bg-[#181818] text-gray-200 border border-white/10 rounded-bl-xs shadow-md'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-wrap font-sans text-xs space-y-1">
                    {message.content.split('\n').map((line, lIdx) => {
                      if (line.startsWith('• ') || line.startsWith('- ')) {
                        return (
                          <div key={lIdx} className="flex items-start gap-1.5 ml-1">
                            <span className="text-[#00FF88] font-bold">•</span>
                            <span>{line.replace(/^[•-]\s*/, '')}</span>
                          </div>
                        );
                      }
                      return (
                        <p key={lIdx} className={line.trim() === '' ? 'h-2' : ''}>
                          {line}
                        </p>
                      );
                    })}
                  </div>

                  {/* Message Footer: Timestamp & Action */}
                  <div
                    className={`mt-2 pt-1.5 flex items-center justify-between border-t text-[10px] ${
                      isUser
                        ? 'border-white/20 text-white/75'
                        : 'border-white/5 text-gray-500'
                    }`}
                  >
                    <span className="font-mono">{message.timestamp}</span>

                    {!isUser && (
                      <div className="flex items-center gap-2">
                        {message.modelUsed && (
                          <span className="font-mono text-[9px] text-gray-400">
                            {message.modelUsed}
                          </span>
                        )}
                        <button
                          onClick={() => handleCopyText(message.id, message.content)}
                          title="Copy response"
                          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-3 h-3 text-[#00FF88]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading / Thinking Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-[#D6181F]/20 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F] shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="bg-[#181818] border border-white/10 rounded-2xl rounded-bl-xs px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#D6181F] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#D6181F] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#D6181F] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px] font-medium text-gray-400">
                  {activeRoleOption.label} is analyzing Shri Ram Hero catalog...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 bg-[#141414] border-t border-white/5 overflow-x-auto flex gap-2 shrink-0 no-scrollbar">
          {suggestedQueries.map((query, qIdx) => (
            <button
              key={qIdx}
              onClick={() => handleSendMessage(query)}
              disabled={isLoading}
              className="text-[11px] whitespace-nowrap bg-[#1f1f1f] hover:bg-[#282828] text-gray-300 hover:text-white px-2.5 py-1 rounded-full border border-white/10 transition-colors cursor-pointer shrink-0"
            >
              {query}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[#181818] border-t border-white/10 flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask ${activeRoleOption.label} anything (e.g. Splendor mileage, Xtreme EMI)...`}
            disabled={isLoading}
            className="flex-1 bg-[#101010] border border-white/10 focus:border-[#D6181F] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-[#D6181F] hover:bg-[#b5141a] disabled:opacity-40 disabled:hover:bg-[#D6181F] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-md shadow-[#D6181F]/20"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
