import React, { createContext, useState, useCallback } from 'react';

export const NeedyContext = createContext();

export const NeedyProvider = ({ children }) => {
  const [needy, setNeedy] = useState(null);
  const [needyList, setNeedyList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const setCurrentNeedy = useCallback((needyData) => {
    setNeedy(needyData);
  }, []);

  const setNeedyListData = useCallback((list) => {
    setNeedyList(list);
  }, []);

  const clearNeedy = useCallback(() => {
    setNeedy(null);
    setError(null);
  }, []);

  const setNeedyError = useCallback((err) => {
    setError(err);
  }, []);

  const setNeedyLoading = useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  const value = {
    needy,
    needyList,
    isLoading,
    error,
    setCurrentNeedy,
    setNeedyListData,
    clearNeedy,
    setNeedyError,
    setNeedyLoading,
  };

  return (
    <NeedyContext.Provider value={value}>
      {children}
    </NeedyContext.Provider>
  );
};
