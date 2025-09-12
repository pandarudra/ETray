import { IAuthService } from "../types";

class AuthService implements IAuthService {
  private isLoggedIn: boolean = false;

  async validatePin(pin: string): Promise<boolean> {
    const storedPin = await window.ipcRenderer.getStoredPin();
    if (!storedPin) {
      return false;
    }

    const isValid = storedPin === pin;
    if (isValid) {
      this.isLoggedIn = true;
    }
    return isValid;
  }

  async setPin(pin: string): Promise<void> {
    await window.ipcRenderer.setStoredPin(pin);
  }

  async isPinSet(): Promise<boolean> {
    const storedPin = await window.ipcRenderer.getStoredPin();
    return storedPin !== null;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}

// Export a singleton instance
export const authService = new AuthService();
