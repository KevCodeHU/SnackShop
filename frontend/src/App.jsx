import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import Login from './components/Login.jsx';
import Products from './components/Products.jsx';
import Cart from './components/Cart.jsx';
import Orders from './components/Orders.jsx';
import AdminProducts from './components/AdminProducts.jsx';
import { Container, Box, Typography } from '@mui/material';

function AppContent() {
  const { user } = useAuth();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4"  gutterBottom sx={{ textAlign: 'center' }}>SnackShop</Typography>
      <Login />

      {user && !user.isAdmin && (
        <>
          <Box sx={{ mt: 4 }}>
            <Products />
          </Box>

          <Box sx={{ mt: 4 }}>
            <Cart />
          </Box>
        </>
      )}


      {user?.isAdmin && (
        <>
          <Box sx={{ mt: 4 }}>
            <AdminProducts />
          </Box>
          <Box sx={{ mt: 4 }}>
            <Orders />
          </Box>
        </>
      )}
    </Container>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
