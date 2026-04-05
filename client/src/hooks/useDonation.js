import { useState, useCallback } from 'react';
import { donationService } from '../services';

export default function useDonation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitDonation = useCallback(async (donationData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await donationService.create(donationData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await donationService.getHistory();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { submitDonation, getHistory, isLoading, error };
}
