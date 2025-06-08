import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/constants/URLs";

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null; loading: boolean | null, username: string | null };
    onRegister?: (username: string, password: string, email: string) => Promise<any>;
    onLogin?: (username: string, password: string, email: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'jwt_token';
const USERNAME_KEY = 'username';

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
        loading: boolean | null;
        username: string | null;
    }>({
        token: null,
        authenticated: null,
        loading: true,
        username: null,
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const username = await SecureStore.getItemAsync(USERNAME_KEY);

            if (token && username) {
                setAuthState({
                    token: token,
                    authenticated: true,
                    loading: false,
                    username: username,
                });
                {/* TODO: Change requests to match our API calls */ }
                axios.defaults.headers.common["user-token"] = token;
            } else {
                {/* TODO: change authenticated to false (set to true only for testing) */ }
                setAuthState({
                    token: null,
                    authenticated: false,
                    loading: false,
                    username: null,
                });
            }
        }
        loadToken();
    }, []);

    const register = async (username: string, password: string, email: string) => {
        try {
            return await axios.post(`${API_URL}/user/register`, { username, password, email });
        } catch (e) {
            return { error: true, msg: (e as any).response.data.msg };
        }
    };

    const login = async (username: string, password: string, email: string) => {
        try {
            const result = await axios.post(`${API_URL}/user/login`, { username, password, email });

            setAuthState({
                token: result.data.token,
                authenticated: true,
                loading: false,
                username: username,
            });

            axios.defaults.headers.common["user-token"] = result.data.token;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

            return result;
        } catch (e) {
            return { error: true, msg: (e as any).response.data.msg };
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            delete axios.defaults.headers.common["user-token"];
            setAuthState({
                token: null,
                authenticated: false,
                loading: false,
                username: null,
            });
        } catch (e) {
            console.error("Logout error:", e);
        }
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}