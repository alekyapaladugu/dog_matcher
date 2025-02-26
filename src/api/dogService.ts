import apiClient from "./apiClient";

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export const fetchBreeds = async (): Promise<string[]> => {
  const response = await apiClient.get("/dogs/breeds");
  return response.data;
};

export const searchDogs = async (params: {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}): Promise<{
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}> => {
  const response = await apiClient.get("/dogs/search", { params });
  return response.data;
};

export const fetchDogsByIds = async (ids: string[]): Promise<Dog[]> => {
  const response = await apiClient.post("/dogs", ids);
  return response.data;
};

export const getMatch = async (
  dogIds: string[]
): Promise<{ match: string }> => {
  const response = await apiClient.post("/dogs/match", dogIds);
  return response.data;
};
