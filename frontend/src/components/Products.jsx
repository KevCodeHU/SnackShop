import { useData } from '../context/DataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Box, Typography, Button } from '@mui/material';

function Products() {
    const { products, cart, setCart } = useData();
    const { user } = useAuth();

    if (!user) return null;

    const addToCart = (product) => {
        const exists = cart.find(item => item.termekId === product.id);
        const menny = exists ? exists.mennyiseg + 1 : 1;
        if (menny > product.keszlet) return;

        const newCart = exists
            ? cart.map(item =>
                item.termekId === product.id
                    ? { ...item, mennyiseg: menny }
                    : item
            )
            : [...cart, {
                termekId: product.id,
                nev: product.nev,
                ar: product.ar,
                mennyiseg: 1
            }];
        setCart(newCart);
    };

    return (
        <Box>
            <Typography variant="h6">Elérhető snackek</Typography>
            {products.map(p => (
                <Box key={p.id} sx={{ border: '1px solid #ccc', p: 2, mb: 1 }}>
                    <Typography><strong>{p.nev}</strong></Typography>
                    <Typography>Ár: {p.ar} Ft | Készlet: {p.keszlet}</Typography>
                    <Button onClick={() => addToCart(p)} disabled={p.keszlet === 0}>Kosárba</Button>
                </Box>
            ))}
        </Box>
    );
}

export default Products;
