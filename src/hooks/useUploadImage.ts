import { API_BASE_URL } from '@/config';

// Hook para subir una imagen usando fetch y API_BASE_URL
export default function useUploadImage(token?: string) {
  return async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data?.url || null;
    } catch (error) {
      // Opcional: manejar el error (por ejemplo, mostrar un toast)
      return null;
    }
  };
}
