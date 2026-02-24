import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TestMode, ParsedData } from '../types';

interface AppContextType {
  testMode: TestMode | null;
  setTestMode: (mode: TestMode | null) => void;
  currentUserlist: ParsedData | null;
  setCurrentUserlist: (data: ParsedData | null) => void;
  priorUserlist: ParsedData | null;
  setPriorUserlist: (data: ParsedData | null) => void;
  engagementList: ParsedData | null;
  setEngagementList: (data: ParsedData | null) => void;
  terminationList: ParsedData | null;
  setTerminationList: (data: ParsedData | null) => void;
  reset: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [testMode, setTestMode] = useState<TestMode | null>(null);
  const [currentUserlist, setCurrentUserlist] = useState<ParsedData | null>(null);
  const [priorUserlist, setPriorUserlist] = useState<ParsedData | null>(null);
  const [engagementList, setEngagementList] = useState<ParsedData | null>(null);
  const [terminationList, setTerminationList] = useState<ParsedData | null>(null);

  const reset = () => {
    setTestMode(null);
    setCurrentUserlist(null);
    setPriorUserlist(null);
    setEngagementList(null);
    setTerminationList(null);
  };

  return (
    <AppContext.Provider
      value={{
        testMode,
        setTestMode,
        currentUserlist,
        setCurrentUserlist,
        priorUserlist,
        setPriorUserlist,
        engagementList,
        setEngagementList,
        terminationList,
        setTerminationList,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};



