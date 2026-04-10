import { useContext } from 'react';
import { NeedyContext } from '../context/NeedyContext';

export const useNeedy = () => {
  const context = useContext(NeedyContext);

  if (!context) {
    throw new Error('useNeedy must be used within NeedyProvider');
  }

  return context;
};

export default useNeedy;
