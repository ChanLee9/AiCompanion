import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Trash2, Edit3, X, Check } from 'lucide-react';
import { useAppStore, Memory as MemoryType } from '../store';
import { format } from 'date-fns';

export const MemoryScreen = () => {
  const { memories, deleteMemory, editMemory } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleEditStart = (memory: MemoryType) => {
    setEditingId(memory.id);
    setEditContent(memory.content);
  };

  const handleEditSave = (id: string) => {
    if (editContent.trim()) {
      editMemory(id, editContent.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f4f6]">
      {/* Header */}
      <div className="h-16 shrink-0 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between z-10 sticky top-0 shadow-sm">
        <h1 className="text-lg font-semibold text-neutral-800 flex items-center space-x-2">
          <Brain className="w-5 h-5 text-indigo-500" />
          <span>记忆中心</span>
        </h1>
        <span className="text-sm font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
          {memories.length} 条记忆
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {memories.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-neutral-400 space-y-4">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-sm">目前还没有记住特别的事哦<br/>多跟我聊聊吧</p>
          </div>
        ) : (
          <AnimatePresence>
            {memories.map((memory) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    {editingId === memory.id ? (
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full text-sm text-neutral-700 p-2 border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-indigo-50/50 resize-none"
                        rows={2}
                        autoFocus
                      />
                    ) : (
                      <p className="text-neutral-800 font-medium leading-relaxed">
                        {memory.content}
                      </p>
                    )}
                  </div>
                  <div className="ml-3 flex space-x-1 shrink-0">
                    {editingId === memory.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(memory.id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 text-neutral-400 hover:bg-neutral-50 rounded-full transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(memory)}
                          className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => deleteMemory(memory.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-50 text-[11px] text-neutral-400">
                  <div className="truncate pr-4 flex-1">
                    来源："{memory.sourceText.length > 15 ? memory.sourceText.substring(0, 15) + '...' : memory.sourceText}"
                  </div>
                  <div className="shrink-0">{format(memory.createdAt, 'yyyy-MM-dd')}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        <div className="h-6" />
      </div>
    </div>
  );
};
