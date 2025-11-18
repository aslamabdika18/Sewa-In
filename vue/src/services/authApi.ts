import apiClient from "./apiClient";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/auth/register",
    payload
  );
  return response.data;
}

export async function login(
  payload: LoginPayload
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/auth/login",
    payload
  );
  return response.data;
}

export async function fetchMe(): Promise<User> {
  const response = await apiClient.get<{ user: User }>("/auth/me");
  return response.data.user;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}
