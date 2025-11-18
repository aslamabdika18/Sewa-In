import { defineStore } from "pinia";
import {
    register,
    login,
    fetchMe,
    logout,
    type User,
    type RegisterPayload,
    type LoginPayload,
    type AuthResponse
} from "@/services/authApi";
import {
    isAxiosError,
    type ApiErrorResponse
} from "@/services/apiClient";

export interface AuthState {
    user: User | null;
    loading: boolean;
    errorMessage: string | null;
    isInitialized: boolean; // supaya /me cuma dipanggil 1x
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        loading: false,
        errorMessage: null,
        isInitialized: false
    }),

    actions: {
        async registerUser(payload: RegisterPayload): Promise<void> {
            this.loading = true;
            this.errorMessage = null;

            try {
                const data: AuthResponse = await register(payload);
                this.user = data.user;
            } catch (error: unknown) {
                if (isAxiosError<ApiErrorResponse>(error)) {
                    this.errorMessage =
                        error.response?.data.message ?? "Register gagal";
                } else {
                    this.errorMessage = "Terjadi kesalahan tidak dikenal";
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async loginUser(payload: LoginPayload): Promise<void> {
            this.loading = true;
            this.errorMessage = null;

            try {
                const data: AuthResponse = await login(payload);
                this.user = data.user;
            } catch (error: unknown) {
                if (isAxiosError<ApiErrorResponse>(error)) {
                    this.errorMessage =
                        error.response?.data.message ?? "Login gagal";
                } else {
                    this.errorMessage = "Terjadi kesalahan tidak dikenal";
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async loadCurrentUser(): Promise<void> {
            // ❗ supaya tidak panggil /me setiap route change
            if (this.isInitialized) {
                return;
            }

            this.loading = true;
            this.errorMessage = null;

            try {
                const user: User = await fetchMe();
                this.user = user;
            } catch (error: unknown) {
                // ✅ Di sini kita "telan" 401 / network error
                if (isAxiosError<ApiErrorResponse>(error)) {
                    const status = error.response?.status;

                    if (!error.response) {
                        // network error (server down) → treat as guest
                        this.user = null;
                        this.errorMessage = null;
                    } else if (status === 401) {
                        // belum login → normal, bukan error
                        this.user = null;
                        this.errorMessage = null;
                    } else {
                        // error HTTP lain → boleh disimpan, tapi JANGAN throw
                        this.errorMessage =
                            error.response.data.message ??
                            "Gagal memeriksa sesi login.";
                    }
                } else {
                    this.user = null;
                }
                // ⛔ JANGAN throw di sini
            } finally {
                this.loading = false;
                this.isInitialized = true;
            }
        },

        async logoutUser(): Promise<void> {
            this.loading = true;
            this.errorMessage = null;

            try {
                await logout();
                this.user = null;
            } catch (error: unknown) {
                if (isAxiosError<ApiErrorResponse>(error)) {
                    this.errorMessage =
                        error.response?.data.message ?? "Logout gagal";
                } else {
                    this.errorMessage = "Terjadi kesalahan tidak dikenal";
                }
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
