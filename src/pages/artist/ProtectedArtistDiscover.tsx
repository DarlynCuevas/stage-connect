import { useAuth } from "@/contexts/AuthContext";

import { useParams, Navigate } from "react-router-dom";
import ArtistDiscover from "./ArtistDiscover";

export default function ProtectedArtistDiscover() {
  const { user, isAuthenticated } = useAuth();
  const { id } = useParams();
  if (!isAuthenticated || !user || user.role !== "Artista" || String(user.id) !== String(id)) {
    return <Navigate to="/login" replace />;
  }
  return <ArtistDiscover />;
}