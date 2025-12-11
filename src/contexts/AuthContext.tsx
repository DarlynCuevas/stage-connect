import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { API_BASE_URL } from '../config';
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

 const login = async (email: string, password: string): Promise<boolean> => {
    
    // El Backend ya maneja el retraso y la verificación de la contraseña.
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
            
            // 🔑 Guardar el token y el rol
            localStorage.setItem('book_token', data.access_token);
            localStorage.setItem('book_role', data.role);
            // Si necesitas el objeto de usuario completo, el Backend debería enviarlo
            // Por ahora, solo guardamos lo esencial.
            
            // Si el login es exitoso, devolvemos 'true'
            return true;
        } else {
            // Error de credenciales (el backend falló la verificación)
            // Ya tienes el toast de "Email o contraseña incorrectos" en handleSubmit
            return false;
        }

    } catch (error) {
        // Error de conexión/CORS. El 'catch' de handleSubmit lo capturará
        console.error('Error al contactar con el Backend:', error);
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
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
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
