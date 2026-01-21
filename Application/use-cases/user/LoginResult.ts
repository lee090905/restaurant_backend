export interface LoginResult {
  user: {
    id: number;
    username: string;
    role: string;
  };
  token: string;
}
