import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext.jsx';
import {
    Box,
    Typography,
    TextField,
    Button,
    List,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

function AdminProducts() {
    const {
        products,
        getProducts,
        addProduct,
        updateProduct,
        deleteProduct
    } = useData();

    const [nev, setNev] = useState('');
    const [ar, setAr] = useState('');
    const [keszlet, setKeszlet] = useState('');

    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editNev, setEditNev] = useState('');
    const [editAr, setEditAr] = useState('');
    const [editKeszlet, setEditKeszlet] = useState('');

    const handleAdd = async () => {
        if (!nev || !ar || !keszlet) {
            alert('Tölts ki minden mezőt!');
            return;
        }

        const result = await addProduct({
            nev,
            ar: Number(ar),
            keszlet: Number(keszlet)
        });

        if (!result.success) {
            alert(`${result.error}\n${result.message}`);
        } else {
            setNev('');
            setAr('');
            setKeszlet('');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Biztos törlöd a terméket?')) return;
        const result = await deleteProduct(id);
        if (!result.success) alert(`${result.error}\n${result.message}`);
    };

    const handleEdit = (product) => {
        setEditId(product.id);
        setEditNev(product.nev);
        setEditAr(product.ar);
        setEditKeszlet(product.keszlet);
        setEditOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editNev || !editAr || !editKeszlet) {
            alert('Tölts ki minden mezőt!');
            return;
        }

        const result = await updateProduct(editId, {
            nev: editNev,
            ar: Number(editAr),
            keszlet: Number(editKeszlet)
        });

        if (!result.success) {
            alert(`${result.error}\n${result.message}`);
        } else {
            setEditOpen(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Termékek kezelése (Admin)</Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4, mt: 2 }}>
                <TextField label="Név" value={nev} onChange={(e) => setNev(e.target.value)} fullWidth />
                <TextField
                    label="Ár"
                    type="number"
                    value={ar}
                    onChange={(e) => setAr(e.target.value)}
                    sx={{ width: 100 }}
                    inputProps={{ min: 0 }}
                />
                <TextField
                    label="db"
                    type="number"
                    value={keszlet}
                    onChange={(e) => setKeszlet(e.target.value)}
                    sx={{ width: 100 }}
                    inputProps={{ min: 0 }}
                />
                <Button variant="contained" onClick={handleAdd}>
                    <AddIcon />
                </Button>
            </Box>

            <List>
                {products.map((p) => (
                    <Box
                        key={p.id}
                        sx={{
                            mb: 3,
                            border: '1px solid #ddd',
                            p: 2,
                            borderRadius: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Typography>
                            <strong>{p.nev}</strong> - {p.ar} Ft - Készlet: {p.keszlet}
                        </Typography>
                        <Box>
                            <IconButton edge="end" onClick={() => handleEdit(p)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleDelete(p.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>
                ))}
            </List>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Termék módosítása</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField label="Név" value={editNev} onChange={(e) => setEditNev(e.target.value)} />
                    <TextField label="Ár" type="number" value={editAr} onChange={(e) => setEditAr(e.target.value)} />
                    <TextField label="Készlet" type="number" value={editKeszlet} onChange={(e) => setEditKeszlet(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Mégse</Button>
                    <Button variant="contained" onClick={handleSaveEdit}>Mentés</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AdminProducts;
