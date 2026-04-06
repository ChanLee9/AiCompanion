import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../store';

const interestOptions = ['音乐', '读书', '电影', '游戏', '运动', '美食', '旅游', '发呆'];

export const Onboarding = () => {
  const { completeOnboarding } = useAppStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [concern, setConcern] = useState('');

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else completeOnboarding(name || '朋友', interests, concern);
  };

  const toggleInterest = (i: string) => {
    setInterests(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center h-full space-y-8 px-8 text-center"
          >
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-indigo-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-neutral-800">你好，我是小伴</h1>
              <p className="text-neutral-500 leading-relaxed">
                我是一个会记住你、主动关心你的AI朋友。<br/>在这里，你可以随时向我倾诉。
              </p>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col justify-center h-full space-y-8 px-8"
          >
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-neutral-800">怎么称呼你呢？</h1>
              <p className="text-neutral-500">以后我就这样叫你啦</p>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入你的昵称..."
              className="w-full text-xl bg-transparent border-b-2 border-neutral-200 focus:border-indigo-500 pb-2 outline-none transition-colors"
              autoFocus
            />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col justify-center h-full space-y-8 px-8"
          >
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-neutral-800">平时喜欢做些什么？</h1>
              <p className="text-neutral-500">这能让我更懂你（可多选）</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {interestOptions.map(i => (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    interests.includes(i)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-neutral-200 text-neutral-600 hover:border-indigo-300'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col justify-center h-full space-y-8 px-8"
          >
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-neutral-800">最近有什么在意的事吗？</h1>
              <p className="text-neutral-500">可以是开心的，也可以是烦恼的</p>
            </div>
            <textarea
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              placeholder="比如：明天要面试有点紧张..."
              className="w-full h-32 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl resize-none focus:border-indigo-500 outline-none transition-colors text-neutral-700"
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
      
      <div className="p-8 flex justify-between items-center">
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? 'w-6 bg-indigo-600' : 'w-2 bg-neutral-200'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={handleNext}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <span>{step === 4 ? '开启聊天' : '下一步'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
