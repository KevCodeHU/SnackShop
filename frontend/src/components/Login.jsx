import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { TextField, Button, Box, Typography } from '@mui/material';

function Login() {
    const { user, login, register, logout } = useAuth();
    const [mode, setMode] = useState('login');
    const [felhasznaloNev, setFelhasznaloNev] = useState('');
    const [email, setEmail] = useState('');
    const [jelszo, setJelszo] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setMessage(null);
            setFelhasznaloNev('');
            setEmail('');
            setJelszo('');
        }
    }, [user]);

    useEffect(() => {
        if (message?.type === 'success') {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSubmit = async () => {
        let result;
        if (mode === 'login') {
            result = await login(felhasznaloNev, jelszo);
        } else {
            result = await register(felhasznaloNev, email, jelszo);
        }
        setMessage(result.success ? { type: 'success', text: result.message || 'Siker!' }
            : { type: 'error', text: result.message });
    };

    if (user) {
        console.log(user)
        return (
            <Box>
                <Typography>Bejelentkezve: {user.felhasznaloNev} {user.isAdmin ? '(Admin)' : ''}</Typography>
                <Button variant="outlined" color="error" onClick={logout}>Kijelentkezés</Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '30vh',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {mode === 'login' ? 'Bejelentkezés' : 'Regisztráció'}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    maxWidth: 300,
                }}
            >
                <TextField
                    label="felhasználónév / email"
                    value={felhasznaloNev}
                    onChange={e => setFelhasznaloNev(e.target.value)}
                    required
                />
                {mode === 'register' && (
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                )}
                <TextField
                    label="Jelszó"
                    type="password"
                    value={jelszo}
                    onChange={e => setJelszo(e.target.value)}
                    required
                />
                <Button variant="contained" onClick={handleSubmit}>
                    {mode === 'login' ? 'Bejelentkezés' : 'Regisztráció'}
                </Button>
                <Button variant="text" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                    {mode === 'login' ? 'Regisztrálok' : 'Bejelentkezek'}
                </Button>
                {message && (
                    <Typography color={message.type === 'error' ? 'error' : 'success.main'}>
                        {message.text}
                    </Typography>
                )}
            </Box>
        </Box>
    );

}

export default Login;
