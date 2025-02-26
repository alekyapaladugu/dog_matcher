import apiClient from "./apiClient";

export interface LoginCredentials {
  name: string;
  email: string;
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<void> => {
  await apiClient.post("/auth/login", credentials);
};

export const logoutUser = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
