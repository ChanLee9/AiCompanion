import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isMemoryTrigger?: boolean;
  memorySourceId?: string;
  memoryText?: string;
};

export type Memory = {
  id: string;
  content: string;
  sourceText: string;
  createdAt: Date;
};

type AppState = {
  isOnboarded: boolean;
  userProfile: {
    name: string;
    interests: string[];
    recentConcern: string;
  };
  messages: Message[];
  memories: Memory[];
  sessions: any[]; // Mock for sessions list
  completeOnboarding: (name: string, interests: string[], recentConcern: string) => void;
  sendMessage: (text: string) => void;
  deleteMemory: (id: string) => void;
  editMemory: (id: string, newContent: string) => void;
  resetApp: () => void;
};

const defaultState: AppState = {
  isOnboarded: false,
  userProfile: { name: '', interests: [], recentConcern: '' },
  messages: [],
  memories: [],
  sessions: [
    { id: '1', date: new Date(Date.now() - 86400000 * 2), preview: '你好啊，我是小伴...' },
    { id: '2', date: new Date(Date.now() - 86400000 * 5), preview: '这几天比较忙...' },
  ],
  completeOnboarding: () => {},
  sendMessage: () => {},
  deleteMemory: () => {},
  editMemory: () => {},
  resetApp: () => {},
};

const AppContext = createContext<AppState>(defaultState);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: '', interests: [], recentConcern: '' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);

  const completeOnboarding = (name: string, interests: string[], recentConcern: string) => {
    setUserProfile({ name, interests, recentConcern });
    setIsOnboarded(true);

    const initialMemories: Memory[] = [];
    if (interests.length > 0) {
      initialMemories.push({
        id: Date.now().toString() + '1',
        content: `喜欢${interests.join('、')}`,
        sourceText: '你在初次认识时告诉我的',
        createdAt: new Date(),
      });
    }
    if (recentConcern) {
      initialMemories.push({
        id: Date.now().toString() + '2',
        content: `最近在在意：${recentConcern}`,
        sourceText: '你在初次认识时告诉我的',
        createdAt: new Date(),
      });
    }
    setMemories(initialMemories);

    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `很高兴认识你，${name}！我记住了你喜欢${interests.join('、')}，最近也在操心“${recentConcern}”的事情。随时找我聊天哦，我会一直在。`,
        timestamp: new Date(),
      },
    ]);
  };

  const simulateAIResponse = (userText: string, currentMemories: Memory[]) => {
    setTimeout(() => {
      let aiResponseText = '嗯嗯，我在这听着呢。还有什么想分享的吗？';
      let usedMemory: Memory | undefined;

      // Simple mock logic for memory extraction
      if (userText.includes('我喜欢') || userText.includes('我想')) {
        const newTopic = userText.split(/(我喜欢|我想)/)[2];
        if (newTopic && newTopic.trim().length > 1) {
          const newMemory = {
            id: Date.now().toString(),
            content: `喜欢/想：${newTopic.trim()}`,
            sourceText: userText,
            createdAt: new Date(),
          };
          setMemories((prev) => [...prev, newMemory]);
          aiResponseText = `我记下了，你提到喜欢/想 ${newTopic.trim()}。这个听起来很棒呢！`;
        }
      } 
      // Mock logic for memory triggering
      else if (currentMemories.length > 0 && Math.random() > 0.5) {
        // Randomly pick a memory to reference to show "I remember you"
        usedMemory = currentMemories[Math.floor(Math.random() * currentMemories.length)];
        if (usedMemory.content.includes('在意')) {
           aiResponseText = `对了，之前看你提到${usedMemory.content.replace('最近在在意：', '')}，现在情况有好点吗？如果不开心可以随时和我说哦。`;
        } else {
           aiResponseText = `哈哈，之前听你说过你${usedMemory.content.replace('喜欢', '喜欢')}，刚才突然就想起来了。今天过得怎么样？`;
        }
      }

      const aiMsg: Message = {
        id: Date.now().toString() + 'ai',
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date(),
      };

      if (usedMemory) {
        aiMsg.isMemoryTrigger = true;
        aiMsg.memorySourceId = usedMemory.id;
        aiMsg.memoryText = usedMemory.content;
      }

      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    simulateAIResponse(text, memories);
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const editMemory = (id: string, newContent: string) => {
    setMemories((prev) => prev.map((m) => m.id === id ? { ...m, content: newContent } : m));
  };

  const resetApp = () => {
    setIsOnboarded(false);
    setUserProfile({ name: '', interests: [], recentConcern: '' });
    setMessages([]);
    setMemories([]);
  };

  return (
    <AppContext.Provider
      value={{
        isOnboarded,
        userProfile,
        messages,
        memories,
        sessions: defaultState.sessions,
        completeOnboarding,
        sendMessage,
        deleteMemory,
        editMemory,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => useContext(AppContext);
