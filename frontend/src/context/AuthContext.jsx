import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (azonosito, jelszo) => {
        try {
            const res = await axios.post('/api/login', { azonosito, jelszo }, { withCredentials: true });
            if (res.data.authenticated) {
                setUser({ id: res.data.userId, felhasznaloNev: res.data.felhasznaloNev, isAdmin: res.data.isAdmin });
                return { success: true };
            }
            return { success: false, message: 'Hibás felhasználó/jelszó' };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Hiba a bejelentkezéskor' };
        }
    };

    const register = async (felhasznaloNev, email, jelszo) => {
        try {
            const res = await axios.post('/api/register', { felhasznaloNev, email, jelszo });
            return { success: true, message: res.data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Regisztrációs hiba' };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout', {}, { withCredentials: true });
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
