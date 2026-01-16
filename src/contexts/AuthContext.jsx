import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { setAuthUser } from '../utils/storage';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
            setUser(user);
            setLoading(false);
        });

        // Handle redirect result for mobile/web redirects
        const { getRedirectResult } = import('firebase/auth').then(mod => {
            mod.getRedirectResult(auth)
                .then((result) => {
                    if (result?.user) {
                        console.log("Redirect login success:", result.user);
                    }
                })
                .catch((error) => {
                    if (error.code !== 'auth/no-current-user') {
                        console.error("Redirect login error:", error);
                        // Only alert if it's a real error, not just "no user yet"
                        if (error.code !== 'auth/network-request-failed') {
                            alert("Error al volver del login: " + error.message);
                        }
                    }
                });
        });

        return unsubscribe;
    }, []);

    const loginWithGoogle = async () => {
        try {
            const isCapacitor = window.hasOwnProperty('Capacitor');

            if (isCapacitor) {
                alert("Redirigiendo a Google para inicio de sesión seguro...");
                const { signInWithRedirect } = await import('firebase/auth');
                await signInWithRedirect(auth, googleProvider);
            } else {
                await signInWithPopup(auth, googleProvider);
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Error de Login: " + error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
