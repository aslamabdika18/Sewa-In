import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse
} from "axios";

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const apiBaseUrl: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

export function isAxiosError<T>(
  error: unknown
): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

// Interceptor: JANGAN spam console untuk 401,
// cukup lempar kembali ke caller (store) untuk diputuskan.
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError<ApiErrorResponse>) => {
    return Promise.reject(error);
  }
);

export default apiClient;
