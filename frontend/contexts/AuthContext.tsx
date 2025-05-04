import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null; loading: boolean | null};
    onRegister?: (username : string,  password: string, email: string) => Promise<any>;
    onLogin?: (username : string, password: string, email: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'jwt_token';

/* While testing on an expo app replace localhost with your computer's IP
    for example: http://192.168.100.129:8080 */
const API_URL = 'http://localhost:8080'; 
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{ 
        token: string | null; 
        authenticated: boolean | null; 
        loading: boolean | null;
    }>({ 
        token: null, 
        authenticated: null,
        loading: true
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);

            if (token) {
                setAuthState({ 
                    token: token, 
                    authenticated: true,
                    loading: false
                });
                {/* TODO: Change requests to match our API calls */}
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            } else {
                setAuthState({ 
                    token: null, 
                    authenticated: false,
                    loading: false
                });
            }
        }
        loadToken();
    }, []);

    const register = async (username : string, password: string, email: string) => {
        try {
            return await axios.post(`${API_URL}/user/register`, { username, password, email });
        } catch (e) {
            return {error: true, msg: (e as any).response.data.msg};
        }
    };

    const login = async (username : string, password: string, email: string) => {
        try {
            const result = await axios.post(`${API_URL}/user/login`, { username, password, email });

            setAuthState({
                token: result.data.token,
                authenticated: true,
                loading: false,
            });
            
            {/* TODO: Change requests to match our API calls */}
            axios.defaults.headers.common["Authorization"] = `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

            return result;
        } catch (e) {
            return {error: true, msg: (e as any).response.data.msg};
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            {/* TODO: Change requests to match our API calls */}
            delete axios.defaults.headers.common["Authorization"];
            setAuthState({ 
                token: null, 
                authenticated: false,
                loading: false
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