import apiClient from "./apiClient";

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: number;
  breed: string;
}

export const fetchBreeds = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get("/dogs/breeds");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchDogs = async (params: {
  breeds?: string[];
  zipCodes?: number[];
  ageMin?: number | string;
  ageMax?: number | string;
  size?: number;
  from?: number;
  sort?: string;
}): Promise<{
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}> => {
  try {
    const response = await apiClient.get("/dogs/search", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDogsByIds = async (ids: string[]): Promise<Dog[]> => {
  try {
    const response = await apiClient.post("/dogs", ids);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMatch = async (
  dogIds: string[]
): Promise<{ match: string }> => {
  try {
    const response = await apiClient.post("/dogs/match", dogIds);
    return response.data;
  } catch (error) {
    throw error;
  }
};
