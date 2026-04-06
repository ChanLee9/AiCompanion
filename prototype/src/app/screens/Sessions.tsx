import React from 'react';
import { motion } from 'motion/react';
import { Clock, ChevronRight, MessageSquareText } from 'lucide-react';
import { useAppStore } from '../store';
import { format } from 'date-fns';

export const SessionsScreen = () => {
  const { sessions } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-[#f4f4f6]">
      <div className="h-16 shrink-0 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between z-10 sticky top-0 shadow-sm">
        <h1 className="text-lg font-semibold text-neutral-800 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          <span>历史会话</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {sessions.map((session: any, i: number) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex items-center justify-between group hover:border-indigo-200 transition-colors cursor-pointer"
          >
            <div className="flex items-start space-x-4 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                <MessageSquareText className="w-5 h-5 text-neutral-500" />
              </div>
              <div className="flex flex-col justify-center min-w-0 pr-4">
                <h3 className="font-medium text-neutral-800 truncate mb-1 text-[15px]">
                  {format(new Date(session.date), 'MM月dd日')} 的对话
                </h3>
                <p className="text-sm text-neutral-500 truncate leading-relaxed">
                  {session.preview}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-neutral-300 group-hover:text-indigo-500 transition-colors">
              <ChevronRight size={20} />
            </div>
          </motion.div>
        ))}
        
        <div className="mt-8 text-center text-[13px] text-neutral-400">
          已显示最近的会话记录
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
};
