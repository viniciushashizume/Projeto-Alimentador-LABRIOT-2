import axios from 'axios';

export interface FeederData {
  tempo: string;
  distance: number;
}
const API_URL = 'http://192.168.100.110:5000/data'; // IP do arduino

export const getLatestFeederData = async (): Promise<FeederData> => {
  try {
    const response = await axios.get<FeederData>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do alimentador:", error);
    throw error;
  }
};