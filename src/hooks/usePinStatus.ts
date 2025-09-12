import { useState, useEffect } from "react";
import { authService } from "../services/authService";

interface PinStatus {
  isPinSet: boolean;
  isLoading: boolean;
}

export const usePinStatus = (): PinStatus => {
  const [isPinSet, setIsPinSet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPinStatus = async () => {
      try {
        const hasPin = await authService.isPinSet();
        setIsPinSet(hasPin);
      } catch (error) {
        console.error("Error checking PIN status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPinStatus();
  }, []);

  return {
    isPinSet,
    isLoading,
  };
};
