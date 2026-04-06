import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store';
import { clsx } from 'clsx';

export const ProfileScreen = () => {
  const { userProfile, resetApp } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="flex flex-col h-full bg-[#f4f4f6]">
      <div className="h-16 shrink-0 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between z-10 sticky top-0 shadow-sm">
        <h1 className="text-lg font-semibold text-neutral-800 flex items-center space-x-2">
          <User className="w-5 h-5 text-indigo-500" />
          <span>我的设置</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex items-center space-x-4"
        >
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {userProfile.name.charAt(0) || '友'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-1">{userProfile.name || '朋友'}</h2>
            <p className="text-sm text-neutral-500">已和小伴认识数天</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden divide-y divide-neutral-100"
        >
          <div className="flex items-center justify-between p-4 px-5">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Bell size={18} />
              </div>
              <span className="font-medium text-neutral-800">主动问候通知</span>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={clsx(
                "w-12 h-6 rounded-full transition-colors relative",
                notificationsEnabled ? "bg-green-500" : "bg-neutral-200"
              )}
            >
              <div
                className={clsx(
                  "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform",
                  notificationsEnabled ? "translate-x-6" : "translate-x-0"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 px-5 cursor-pointer hover:bg-neutral-50 transition-colors group">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Shield size={18} />
              </div>
              <span className="font-medium text-neutral-800">隐私与安全说明</span>
            </div>
            <ChevronRight size={20} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={resetApp}
            className="w-full bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 px-5 flex items-center justify-center space-x-2 text-red-500 hover:bg-red-50 transition-colors active:scale-[0.98]"
          >
            <LogOut size={18} />
            <span className="font-medium">清除数据并重新开始</span>
          </button>
        </motion.div>

        <div className="mt-8 text-center text-[12px] text-neutral-400">
          AI 伴侣 App v0.1.0 MVP
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
};
