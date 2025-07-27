import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, TextField } from '@mui/material';

function Cart() {
    const { user } = useAuth();
    const { cart, setCart, postOrder, products } = useData();

    if (!user) return null;
    if (user.isAdmin == 1) return null;

    const handleQuantity = (idx, value) => {
        const updated = [...cart];
        let newQuantity = Math.max(1, parseInt(value) || 1);

        const product = products.find(p => p.id === updated[idx].termekId);
        if (product && newQuantity > product.keszlet) {
            alert(`Nem rendelhető több, mint a készleten lévő mennyiség (${product.keszlet})!`);
            newQuantity = product.keszlet;
        }

        updated[idx].mennyiseg = newQuantity;
        setCart(updated);
    };

    const removeItem = (idx) => {
        const updated = cart.filter((_, i) => i !== idx);
        setCart(updated);
    };

    const handleOrder = async () => {
        const res = await postOrder();
        if (res.success) {
            alert('Sikeres rendelés!');
        } else {
            alert('Hiba: ' + res.message);
        }
    };

    const total = cart.reduce((sum, item) => sum + item.mennyiseg * item.ar, 0);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Kosaram</Typography>

            {!cart.length ? (
                <Typography>Nincs tétel a kosárban.</Typography>
            ) : (
                cart.map((item, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            display: 'flex',
                            gap: 2,
                            mb: 1,
                            alignItems: 'center',
                            border: '1px solid #ccc',
                            p: 1,
                            borderRadius: '8px'
                        }}
                    >
                        <Typography sx={{ width: 120 }}>{item.nev}</Typography>
                        <TextField
                            type="number"
                            value={item.mennyiseg}
                            onChange={(e) => handleQuantity(idx, e.target.value)}
                            size="small"
                            inputProps={{ min: 1 }}
                            sx={{ width: 80 }}
                        />
                        <Typography>Egységár: {item.ar} Ft</Typography>
                        <Typography>Össz: {item.ar * item.mennyiseg} Ft</Typography>
                        <Button color="error" onClick={() => removeItem(idx)}>
                            Törlés
                        </Button>
                    </Box>
                ))
            )}

            {cart.length > 0 && (
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Typography variant="subtitle1">Végösszeg: {total} Ft</Typography>
                    <Button variant="contained" onClick={handleOrder} sx={{ mt: 1 }}>
                        Rendelés leadása
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default Cart;
