import { useState } from 'react';
import useUploadImage from '@/hooks/useUploadImage';

export function AvatarBannerUploader({ token, onAvatarChange, onBannerChange, initialAvatar, initialBanner }: {
  token: string;
  onAvatarChange: (url: string) => void;
  onBannerChange: (url: string) => void;
  initialAvatar?: string;
  initialBanner?: string;
}) {
  const uploadImage = useUploadImage(token);
  const [avatarPreview, setAvatarPreview] = useState(initialAvatar || '');
  const [bannerPreview, setBannerPreview] = useState(initialBanner || '');
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const url = await uploadImage(file);
    setLoading(false);
    if (url) {
      setAvatarPreview(url);
      onAvatarChange(url);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const url = await uploadImage(file);
    setLoading(false);
    if (url) {
      setBannerPreview(url);
      onBannerChange(url);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block font-medium mb-1">Avatar</label>
        <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={loading} />
        {avatarPreview && <img src={avatarPreview} alt="Avatar preview" className="mt-2 w-24 h-24 rounded-full object-cover" />}
      </div>
      <div>
        <label className="block font-medium mb-1">Banner</label>
        <input type="file" accept="image/*" onChange={handleBannerChange} disabled={loading} />
        {bannerPreview && <img src={bannerPreview} alt="Banner preview" className="mt-2 w-full h-32 object-cover rounded-lg" />}
      </div>
    </div>
  );
}
