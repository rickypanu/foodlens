import axios from 'axios';
import {  Platform} from 'react-native';
// Use 10.0.2.2 for Android Emulator, or your PC IP (e.g., 192.168.1.x) for physical device
const getBaseUrl = () => {
  if (Platform.OS === 'web') return 'http://127.0.0.1:8000';
  if (Platform.OS === 'android') return 'http://10.0.2.2:8000';
  return 'http://192.168.136.55:8000'; // Replace with your physical IP if needed
};
const API_URL = getBaseUrl();

// const API_URL = 'http://10.0.2.2:8000'; 

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});