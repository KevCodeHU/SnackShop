import { useData } from '../context/DataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';

function Orders() {
    const { user } = useAuth();
    const { orders } = useData();

    if (!user?.isAdmin) return null;

    if (!orders.length) return <Typography>Nincsenek rendelések.</Typography>;

    return (
        <Box>
            <Typography variant="h6">Összes rendelés (Admin)</Typography>
            <List>
                {orders.map(r => (
                    <Box key={r.id} sx={{ mb: 3, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
                        <Typography>
                            <strong>{r.felhasznalo.felhasznaloNev}</strong> - {new Date(r.letrehozva).toLocaleString()}
                        </Typography>
                        {r.tetelek.map(t => (
                            <ListItem key={t.id} disableGutters>
                                <ListItemText primary={`${t.termek.nev} × ${t.mennyiseg} = ${t.ossz} Ft`} />
                            </ListItem>
                        ))}
                        <Typography><strong>Összesen:</strong> {r.osszeg} Ft</Typography>
                    </Box>
                ))}
            </List>
        </Box>
    );
}

export default Orders;
