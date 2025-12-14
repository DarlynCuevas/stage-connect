import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { API_BASE_URL } from '../config';
import apiFetch from '@/lib/api';
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  token?: string | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('book_token');
  });
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Helper para mapear la respuesta del backend a nuestro tipo User
  const mapUser = (u: any): User => ({
    id: String(u?.id ?? u?.user_id ?? ''),
    name: u?.name ?? '',
    email: u?.email ?? '',
    role: u?.role ?? 'Artista',
    avatar: u?.avatar,
    nickName: u?.nickName ?? u?.nick_name,
    bio: u?.bio,
    genre: u?.genre,
    country: u?.country,
    city: u?.city,
    basePrice: u?.basePrice ?? u?.base_price,
    banner: u?.banner,
    rating: u?.rating,
    totalShows: u?.totalShows ?? u?.total_shows,
    verified: u?.verified,
    managerId: u?.managerId ?? u?.manager_id,
    socialLinks: u?.socialLinks ?? u?.social_links,
    gallery: u?.gallery,
    priceVariants: u?.priceVariants ?? u?.price_variants,
    createdAt: u?.created_at ? new Date(u.created_at) : u?.createdAt ? new Date(u.createdAt) : new Date(),
    totalReviews: u?.totalReviews ?? u?.total_reviews,
  });

  // Sincronizar user con localStorage cuando cambie
  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  // Cargar datos completos del usuario desde /users/me
  const loadUserFromDB = async (authToken: string) => {
    try {
      const response = await apiFetch('/users/me', { token: authToken });
      // Backend devuelve { message: '...', user: {...} }
      const userData = response?.user || response;
      const mapped = mapUser(userData);
      updateUser(mapped);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Error al cargar usuario desde BD:', err);
      // Limpiar todo si falla
      updateUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('book_token');
      localStorage.removeItem('book_role');
      setToken(null);
      return false;
    }
  };

  // Al iniciar la app, si hay token, cargar usuario desde BD
  useEffect(() => {
    if (token) {
      loadUserFromDB(token);
    }
  }, []);

const login = async (email: string, password: string): Promise<string | null> => {
    const credentials = { email, password };
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (response.ok) {
          // El Backend retorna { access_token: '...', role: 'Artista', user_id: 1 }

          // Guardar el token
          localStorage.setItem('book_token', data.access_token);
          localStorage.setItem('book_role', data.role);
          setToken(data.access_token);

          // Cargar usuario desde BD
          const success = await loadUserFromDB(data.access_token);
          
          if (success) {
            return data.role;
          } else {
            // Si falla cargar desde BD, limpiar y devolver null
            localStorage.removeItem('book_token');
            localStorage.removeItem('book_role');
            setToken(null);
            return null;
          }
        } else {
            // Error de credenciales
            return null;
        }

    } catch (error) {
        // Error de conexión/CORS. El 'catch' de handleSubmit lo capturará
        console.error('Error al contactar con el Backend:', error);
        // Lanzamos el error para que handleSubmit lo maneje.
        throw error; 
    }
};

const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    
    // NOTA: El Backend solo necesita 'email', 'password', y 'role'
    const userData = { name, email, password, role };
    // Puedes incluir 'name' si lo vas a guardar en una tabla 'profiles' más adelante.

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            // Registro exitoso (código 201 Created)
            
            // Opcional: Iniciar sesión inmediatamente después del registro
            // await login(email, password); 
            return true;
        } else {
            const errorData = await response.json();
            // Esto capturará errores como "El email ya está registrado" del Backend
            console.error('Error de registro del Backend:', errorData.message);
            throw new Error(errorData.message || "Fallo el registro.");
        }

    } catch (error) {
        // Error de conexión, CORS, o error lanzado arriba
        throw error;
    }
};
    
  

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('book_token');
    localStorage.removeItem('book_role');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated,
      token,
      setUser: updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
