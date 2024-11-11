import { useQuery } from 'react-query';
import { useClient } from '../contexts/Client/Client';
import { useUser } from '../contexts/User/User';

type FlashcardType = {
    id: number;
    question: string;
    answer: string;
};

export const useGetFlashCardsByDeckId = (deckId: number | null) => {
    const { get } = useClient()
    const { user } = useUser();

    const fetchFlashcards = async () => {
        if (!deckId || !user) return [];
        const response = await get(`users/${user.id}/decks/${deckId}/flashcards`);
        return response;
    };

    const { data = [], isLoading, error, refetch } = useQuery<FlashcardType[]>(
        ['flashcards', deckId],
        fetchFlashcards,
        {
            enabled: !!deckId,
            onError: () => console.log('Erreur lors de la récupération des cartes'),
        }
    );

    return {
        data,
        isLoading,
        error,
        refetch
    };
};
