import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export const register = async (
  data: RegisterData
): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(
    `${API_URL}/auth/register`,
    data
  );
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/auth/login`,
    data
  );
  return response.data;
};
