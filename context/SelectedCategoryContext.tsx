import React, { createContext, useContext, useState } from 'react';

interface SelectedCategoryContextType {
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
}

const SelectedCategoryContext = createContext<SelectedCategoryContextType | undefined>(undefined);

export const SelectedCategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  return (
    <SelectedCategoryContext.Provider value={{ selectedCategoryId, setSelectedCategoryId }}>
      {children}
    </SelectedCategoryContext.Provider>
  );
};

export const useSelectedCategory = () => {
  const context = useContext(SelectedCategoryContext);
  if (!context) {
    throw new Error('useSelectedCategory must be used within SelectedCategoryProvider');
  }
  return context;
};
