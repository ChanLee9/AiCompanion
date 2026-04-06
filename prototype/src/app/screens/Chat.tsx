import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, BrainCircuit } from 'lucide-react';
import { useAppStore } from '../store';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export const Chat = () => {
  const { messages, sendMessage, userProfile } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Auto clear typing status if last message is from AI
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender === 'user') {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f4f6]">
      {/* Header */}
      <div className="h-16 shrink-0 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm">
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 leading-tight">小伴</h2>
            <p className="text-[11px] text-green-600 font-medium">在线的倾听者</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-neutral-400 text-sm mt-10">
            暂无聊天记录，来打个招呼吧！
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            const showTime = index === 0 || msg.timestamp.getTime() - messages[index - 1].timestamp.getTime() > 5 * 60000;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={clsx('flex flex-col', isUser ? 'items-end' : 'items-start')}
              >
                {showTime && (
                  <div className="text-[11px] text-neutral-400 mb-4 self-center bg-white/50 px-3 py-1 rounded-full">
                    {format(msg.timestamp, 'MM-dd HH:mm')}
                  </div>
                )}
                
                {msg.isMemoryTrigger && (
                  <div className="mb-2 max-w-[80%] flex items-center space-x-1.5 text-xs text-indigo-600 bg-indigo-50/80 px-3 py-1.5 rounded-full border border-indigo-100/50">
                    <BrainCircuit size={12} className="shrink-0" />
                    <span className="truncate">想起了：{msg.memoryText}</span>
                  </div>
                )}
                
                <div className={clsx(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm text-[15px] leading-relaxed break-words",
                  isUser 
                    ? "bg-indigo-600 text-white rounded-tr-sm" 
                    : "bg-white text-neutral-800 rounded-tl-sm border border-neutral-100"
                )}>
                  {msg.text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start"
          >
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-neutral-100 flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-neutral-200 shrink-0">
        <div className="flex items-end space-x-2 bg-neutral-100 p-1.5 rounded-3xl border border-transparent focus-within:border-neutral-300 focus-within:bg-white transition-colors">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="告诉小伴你的想法..."
            className="flex-1 bg-transparent max-h-32 min-h-[40px] px-3 py-2.5 text-[15px] text-neutral-800 outline-none resize-none leading-tight"
            rows={1}
            style={{ 
               height: inputText ? `${Math.min(120, inputText.split('\n').length * 24 + 16)}px` : '40px' 
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-neutral-300 transition-colors shadow-sm"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
