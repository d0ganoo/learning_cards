import React, { createContext, useContext, useEffect, useState } from "react";
import { useClient } from "../Client/Client";
import { UserContextType, UserDataContextType } from "./types";

export const UserContext = createContext<UserContextType>({
  user: undefined,
  refreshUser: async () => {}, // Changez ici pour être compatible
});

interface Props {
  children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [me, setMe] = useState<UserDataContextType | undefined>(undefined);
  const { status, get } = useClient();

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "authenticated") {
        try {
          const response = await get<{ data: UserDataContextType }>("me");
          setMe(response.data); // Mettez à jour l'état avec les données utilisateur
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur:", error);
          setMe(undefined); // En cas d'erreur, mettez l'utilisateur à undefined
        }
      } else {
        setMe(undefined); // Si non authentifié, réinitialisez l'utilisateur
      }
    };

    fetchUser();
  }, [status, get]);

  const refreshUser = async () => {
    try {
      const response = await get<{ data: UserDataContextType }>("me");
      setMe(response.data); // Mettez à jour avec les données utilisateur
    } catch (error) {
      console.error("Erreur lors du rafraîchissement de l'utilisateur:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user: me, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
