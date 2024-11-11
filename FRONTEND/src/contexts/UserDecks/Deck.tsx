import React, { createContext, useContext } from "react";
import { useQuery } from "react-query";
import { useClient } from "../Client/Client"; // Ajustez le chemin selon votre structure de projet
import { useUser } from "../User/User"; // Ajustez également ce chemin si nécessaire

interface Props {
    children: React.ReactNode;
}

type DeckContextType = {
    decks: any;
    isLoading: boolean;
    error: unknown;
    refetch: () => void;
} | null;

// Création du contexte avec le type initialisé à null
const DeckContext = createContext<DeckContextType>(null);

// Hook personnalisé pour utiliser le contexte des decks
export const useDecks = () => {
    const context = useContext(DeckContext);
    if (!context) {
        throw new Error("useDecks must be used within a DeckProvider");
    }
    return context;
};

// Composant fournisseur pour le contexte des decks
export const DeckProvider: React.FC<Props> = ({ children }) => {
    const { get } = useClient();
    const { user } = useUser();

    // Utilisation de react-query pour récupérer les decks de l'utilisateur connecté
    const { data: decks, isLoading, error, refetch } = useQuery(
        "decks",
        async () => {
            const response = await get(`users/${user?.id}/decks`);
            return response;
        },
        {
            enabled: !!user, // N'exécute la requête que si l'utilisateur est connecté
            onError: () => console.log("Erreur lors de la récupération des decks."),
        }
    );

    return (
        <DeckContext.Provider value={{ decks, isLoading, error, refetch }}>
            {children}
        </DeckContext.Provider>
    );
};
