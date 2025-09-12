export interface IAuthService {
  validatePin(pin: string): Promise<boolean>;
  setPin(pin: string): Promise<void>;
  isAuthenticated(): boolean;
  isPinSet(): Promise<boolean>;
}
