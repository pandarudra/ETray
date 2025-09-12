import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { usePinStatus } from "../hooks/usePinStatus";
import toast from "react-hot-toast";

export const Auth = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const { isPinSet, isLoading } = usePinStatus();

  const handleSetPin = async () => {
    if (pin.length === 0) {
      toast.error("PIN cannot be empty");
      return;
    }

    if (pin.length < 4) {
      toast.error("PIN must be at least 4 digits");
      return;
    }
    await authService.setPin(pin);
    // The pin status will be updated automatically on next render
    setPin("");
    window.location.reload(); // Refresh to update PIN status
  };

  const handleLogin = async () => {
    if (pin.length === 0) {
      toast.error("PIN cannot be empty");
      return;
    }
    const isValid = await authService.validatePin(pin);
    if (isValid) {
      toast.success("Successfully authenticated!");
      navigate("/manager");
    } else {
      toast.error("Invalid PIN");
    }
    setPin("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isPinSet ? "Welcome Back" : "Set Up PIN"}
        </h2>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <button
            onClick={isPinSet ? handleLogin : handleSetPin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isPinSet ? "Unlock" : "Set PIN"}
          </button>
          <p className="text-sm text-gray-500 text-center mt-4">
            {isPinSet
              ? "Enter your PIN to unlock the application"
              : "Create a PIN to secure your application"}
          </p>
        </div>
      </div>
    </div>
  );
};
