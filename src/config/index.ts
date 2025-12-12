// Archivo: src/config/index.ts (Frontend)

// ----------------------------------------------------------------------
// CONFIGURACIÓN PROFESIONAL DE ENTORNO
// ----------------------------------------------------------------------

// 1. URL base para todas las peticiones al Backend (NestJS)
// Usamos el puerto 4000 del Backend con el prefijo 'api'.
// Si cambias el puerto de NestJS, solo lo cambias aquí.
// Permitir override por variable de entorno en tiempo de ejecución (Vite)
// VITE_API_BASE_URL puede definir el puerto/host.
// Detectar si estamos en local
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export const API_BASE_URL: string =
	(import.meta as any).env?.VITE_API_BASE_URL ||
	(isLocalhost
		? 'http://localhost:4000/api' // Puerto correcto para backend local
		: 'https://stage-connect-back-6unq.onrender.com/api');

// 2. Otros parámetros de entorno pueden ir aquí (ej: claves de Stripe, etc.)

// ----------------------------------------------------------------------