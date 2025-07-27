import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState([]);

    const getProducts = async () => {

        try {
            const res = await axios.get('/api/products', { withCredentials: true });
            setProducts(res.data);
        } catch { }
    };

    const getOrders = async () => {
        if (!user?.isAdmin) return;
        try {
            const res = await axios.get('/api/orders', { withCredentials: true });
            setOrders(res.data);
        } catch { }
    };

    const postOrder = async () => {
        try {
            const res = await axios.post('/api/order', { items: cart }, { withCredentials: true });
            setCart([]);
            getProducts();
            getOrders();
            return { success: true, rendeles: res.data.rendeles };
        } catch (err) {
            return { success: false, error: err.response?.data?.error, message: err.response?.data?.message };
        }
    };

    useEffect(() => {
        if (user) {
            getProducts();
            getOrders();
        } else {
            setProducts([]);
            setOrders([]);
            setCart([]);
        }
    }, [user]);


    const addToCart = (product) => {
        const exists = cart.find(item => item.termekId === product.id);
        const currentQuantity = exists ? exists.mennyiseg : 0;
        const newQuantity = currentQuantity + 1;

        if (newQuantity > product.keszlet) {
            alert('Nem rendelhető több, mint a készleten lévő mennyiség!');
            return;
        }

        const newCart = exists
            ? cart.map(item =>
                item.termekId === product.id
                    ? { ...item, mennyiseg: newQuantity }
                    : item
            )
            : [...cart, { termekId: product.id, nev: product.nev, ar: product.ar, mennyiseg: 1 }];

        setCart(newCart);
    };

    const addProduct = async (product) => {
        try {
            await axios.post('/api/products', product, { withCredentials: true });
            await getProducts();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Hiba a termék létrehozásakor', message: err.response?.data?.message };
        }
    };

    const updateProduct = async (id, product) => {
        try {
            await axios.put(`/api/products/${id}`, product, { withCredentials: true });
            await getProducts();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Hiba a termék módosításakor', message: err.response?.data?.message };
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`/api/products/${id}`, { withCredentials: true });
            await getProducts();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Hiba a termék törlésekor', message: err.response?.data?.message };
        }
    };

    return (
        <DataContext.Provider value={{
            products,
            orders,
            cart,
            setCart,
            getProducts,
            getOrders,
            postOrder,
            addToCart,
            addProduct,
            updateProduct,
            deleteProduct
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
