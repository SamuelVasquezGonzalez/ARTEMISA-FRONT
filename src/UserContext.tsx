import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { ConfigT } from "./Screens/Login/Login";

interface AuthState {
    role: string | null;
    _id?: string | null
}

interface AuthContextType {
    authState: AuthState;
    setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [authState, setAuthState] = useState<AuthState>({
        role: null,
        _id: null
    });


    useEffect(() => {
        const tryGetLocalStorage: string | null = localStorage.getItem("s");
    
        if (tryGetLocalStorage && typeof tryGetLocalStorage === "string") {
            try {
                const parsedStorage: ConfigT = JSON.parse(tryGetLocalStorage);
    
                if (parsedStorage && typeof parsedStorage === "object" && "role" in parsedStorage) {
                    setAuthState({
                        role: parsedStorage.role || null,
                        _id: parsedStorage._id || null
                    });
                }
            } catch (error) {
                console.error("Error parsing localStorage data", error);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authState, setAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};

// Crear un hook para acceder fácilmente al contexto
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};
