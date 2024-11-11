import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Select, message } from 'antd';
import { useQuery, useMutation } from 'react-query';
import { useClient } from '../../contexts/Client/Client';
import { useUser } from '../../contexts/User/User';
import { useDecks } from '../../contexts/UserDecks/Deck';
import { DeckType, FlashcardType } from '../types';

const { Search } = Input;
const { Option } = Select;

export const Explorer: React.FC = () => {
    const { get, post } = useClient();
    const { user } = useUser();
    const { decks } = useDecks();
    const [filteredCards, setFilteredCards] = useState<FlashcardType[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedDeck, setSelectedDeck] = useState<number | null>(null);

    // Requête pour récupérer les cartes publiques filtrées (excluant celles dupliquées par l'utilisateur)
    const { data: publicCards = [], isLoading, refetch } = useQuery<FlashcardType[]>('publicCards', async () => {
        const response = await get(`users/${user?.id}/public/flashcards`);
        return response;
    });

    // Requête pour récupérer les cartes publiques filtrées selon la recherche
    const { data: searchedCards = [], isLoading: isSearching } = useQuery<FlashcardType[]>(
        ['searchCards', searchTerm],
        async () => {
            if (searchTerm) {
                const response = await get(`users/${user?.id}/public/flashcards/search?searchTerm=${searchTerm}`);
                return response;
            }
            return [];
        },
        {
            enabled: !!searchTerm, // N'exécute la requête que si un terme de recherche est fourni
        }
    );

    // Mutation pour ajouter une carte à un deck
    const { mutate: addCardToDeck, isLoading: isAdding } = useMutation(
        (cardId: number) => post(`users/${user?.id}/decks/${selectedDeck}/add-flashcard`, { cardId }),
        {
            onSuccess: () => {
                message.success('Carte ajoutée au deck avec succès');
                refetch(); // Rafraîchir la liste des cartes après l'ajout de la carte au deck
            },
            onError: () => {
                message.error("Erreur lors de l'ajout de la carte au deck");
            },
        }
    );

    // Filtrer les cartes en fonction du terme de recherche
    useEffect(() => {
        if (searchTerm) {
            setFilteredCards(searchedCards);
        } else {
            setFilteredCards(publicCards);
        }
    }, [searchTerm, publicCards, searchedCards]);

    // Gère la recherche
    const handleSearch = (value: string) => setSearchTerm(value);

    // Gère la sélection du deck
    const handleDeckChange = (deckId: number) => setSelectedDeck(deckId);

    // Gère l'ajout de la carte au deck
    const handleAddCard = (cardId: number) => {
        if (selectedDeck) {
            addCardToDeck(cardId); // Ajouter la carte au deck
        } else {
            message.warning('Veuillez sélectionner un deck');
        }
    };

    // Configuration des colonnes du tableau
    const columns = [
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
        },
        {
            title: 'Réponse',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: (
                <div>
                    <Select
                        placeholder="Sélectionner un deck"
                        onChange={handleDeckChange}
                        style={{ width: '200px', marginLeft: '10px' }}
                    >
                        {decks.map((deck: DeckType) => (
                            <Option key={deck.id} value={deck.id}>
                                {deck.name}
                            </Option>
                        ))}
                    </Select>
                </div>
            ),
            key: 'actions',
            render: (_: any, record: FlashcardType) => (
                <Button
                    onClick={() => handleAddCard(record.id)}
                    loading={isAdding}
                    disabled={!selectedDeck}
                >
                    Ajouter la carte au deck
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Cartes publiques</h2>

            {/* Barre de recherche */}
            <Search
                placeholder="Rechercher une carte"
                enterButton
                onSearch={handleSearch}
                style={{ marginBottom: '20px', width: '300px' }}
            />

            {/* Tableau avec pagination */}
            <Table
                columns={columns}
                dataSource={filteredCards}
                rowKey="id"
                loading={isLoading || isSearching}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};
