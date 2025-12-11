import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { API_BASE_URL } from '../config';
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  token?: string | null;
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

          // Guardar el token y el rol
            localStorage.setItem('book_token', data.access_token);
            localStorage.setItem('book_role', data.role);
            setToken(data.access_token);

          // Construir y guardar un objeto `user` mínimo para el frontend
          const currentUser: User = {
            id: String(data.user_id ?? data.id ?? ''),
            name: data.name ?? '',
            email,
            role: data.role,
            createdAt: new Date(),
          };

          setUser(currentUser);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));

          // Marcar autenticado
          setIsAuthenticated(true);

          // Devolver el rol para compatibilidad con la UI de login
          return data.role;
        } else {
            // Error de credenciales (el backend falló la verificación)
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
