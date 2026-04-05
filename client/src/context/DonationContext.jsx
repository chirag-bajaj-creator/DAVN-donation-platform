import { createContext, useState, useCallback } from 'react';
import { donationService } from '../services';

export const DonationContext = createContext();

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDonations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await donationService.getHistory();
      setDonations(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch donations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDonation = useCallback(async (donationData) => {
    try {
      setIsLoading(true);
      setError(null);
      const donation = await donationService.create(donationData);
      setCurrentDonation(donation);
      setDonations((prev) => [...prev, donation]);
      return donation;
    } catch (err) {
      setError(err.message || 'Failed to create donation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDonation = useCallback(async (id, donationData) => {
    try {
      setIsLoading(true);
      setError(null);
      const donation = await donationService.update(id, donationData);
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? donation : d))
      );
      return donation;
    } catch (err) {
      setError(err.message || 'Failed to update donation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteDonation = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      await donationService.delete(id);
      setDonations((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete donation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    donations,
    currentDonation,
    isLoading,
    error,
    fetchDonations,
    createDonation,
    updateDonation,
    deleteDonation,
    setCurrentDonation,
  };

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
};
