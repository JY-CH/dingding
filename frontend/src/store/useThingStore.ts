import { create } from 'zustand';

import { ThingItem } from '../types';

interface ThingState {
  things: ThingItem[];
  isLoading: boolean;
  error: string | null;
  // 액션
  addThing: (thing: Omit<ThingItem, 'id' | 'createdAt'>) => void;
  removeThing: (id: string) => void;
  updateThing: (id: string, updates: Partial<ThingItem>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useThingStore = create<ThingState>((set) => ({
  things: [],
  isLoading: false,
  error: null,
  
  // 새 아이템 추가
  addThing: (thing) => set((state) => ({ 
    things: [
      ...state.things, 
      { 
        ...thing, 
        id: crypto.randomUUID(), 
        createdAt: new Date() 
      }
    ] 
  })),
  
  // 아이템 제거
  removeThing: (id) => set((state) => ({ 
    things: state.things.filter(thing => thing.id !== id) 
  })),
  
  // 아이템 업데이트
  updateThing: (id, updates) => set((state) => ({
    things: state.things.map(thing => 
      thing.id === id ? { ...thing, ...updates } : thing
    )
  })),
  
  // 로딩 상태 설정
  setLoading: (loading) => set({ isLoading: loading }),
  
  // 에러 상태 설정
  setError: (error) => set({ error })
}));