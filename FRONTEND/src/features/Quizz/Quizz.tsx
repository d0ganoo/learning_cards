import React, { useState } from 'react';
import { Card, Button, Typography, Progress, List } from 'antd';
import { useDecks } from '../../contexts/UserDecks/Deck';
import styles from "./Quizz.module.css";
import { useGetFlashCardsByDeckId } from '../../hooks/useGetFlashCardsByDeckId';

type DeckType = {
    id: number;
    name: string;
};

export const Quizz: React.FC = () => {
    const { decks, isLoading: isDeckLoading, error: deckError } = useDecks();
    const [currentDeckIndex, setCurrentDeckIndex] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    
    const selectedDeck = currentDeckIndex !== null ? decks[currentDeckIndex] : null;
    const { data: cards = [], isLoading: isCardLoading, error: cardError } = useGetFlashCardsByDeckId(selectedDeck?.id || null);

    const decksBackButton = () => (
        <Button
            onClick={() => {
                setCurrentDeckIndex(null);
                setCurrentQuestionIndex(0);
                setShowAnswer(false);
            }}
            style={{ marginTop: '20px', width: '100%' }}
            type="dashed"
        >
            Retour à la liste des decks
        </Button>
    );

    // Fonction pour afficher le message d'état
    const renderLoadingOrError = (message: string, isError: boolean = false, buttondisabled: boolean = false) => (
        <div className={styles.container}>
            <Card style={{ width: 400, textAlign: 'center' }}>
                <Typography.Text type={isError ? "danger" : undefined}>{message}</Typography.Text>
                {buttondisabled && decksBackButton()}
            </Card>
        </div>
    );

    // Gestion des états de chargement et d'erreur
    if (isDeckLoading) return renderLoadingOrError("Chargement des decks...", false, false);
    if (deckError) return renderLoadingOrError("Erreur lors du chargement des decks", true, false);
    if (isCardLoading) return renderLoadingOrError("Chargement des cartes...", false, true);
    if (cardError) return renderLoadingOrError("Erreur lors du chargement des cartes", true, true);

    // Vérification si aucun deck n'est sélectionné
    if (!selectedDeck) {
        return (
            <div className={styles.container}>
                <Card style={{ width: 400, textAlign: 'center', maxHeight: 600 }}>
                    <Typography.Title level={4} style={{ marginTop: '0' }}>Sélectionnez un Deck</Typography.Title>
                    <List
                        bordered
                        dataSource={decks}
                        style={{
                            maxHeight: 300, // Limite la hauteur de la liste
                            overflowY: 'scroll', // Active le défilement vertical
                        }}
                        renderItem={(deck: DeckType, index) => (
                            <List.Item
                                onClick={() => {
                                    setCurrentDeckIndex(index);
                                    setCurrentQuestionIndex(0);
                                    setShowAnswer(false);
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                {deck.name}
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        );
    }

    // Vérification si le deck a des questions
    if (!cards.length) {
        return renderLoadingOrError("Aucune carte disponible dans ce deck.", false, true);
    }

    // Fonction pour passer à la question suivante
    const handleNext = () => {
        setShowAnswer(false);
        setCurrentQuestionIndex((prevIndex) => (prevIndex + 1 < cards.length ? prevIndex + 1 : 0));
    };

    // Fonction pour revenir à la question précédente
    const handlePrevious = () => {
        setShowAnswer(false);
        setCurrentQuestionIndex((prevIndex) => (prevIndex === 0 ? cards.length - 1 : prevIndex - 1));
    };

    // Fonction pour afficher ou masquer la réponse
    const toggleAnswer = () => setShowAnswer((prevShowAnswer) => !prevShowAnswer);

    return (
        <div className={styles.container}>
            <Card style={{ width: 400, textAlign: 'center' }}>
                <Typography.Title level={4}>
                    Question {currentQuestionIndex + 1}/{cards.length}
                </Typography.Title>

                <Progress percent={((currentQuestionIndex + 1) / cards.length) * 100} status="active" />

                <Typography.Paragraph style={{ marginTop: '20px', fontSize: '1.2em' }}>
                    {cards[currentQuestionIndex]?.question}
                </Typography.Paragraph>

                {showAnswer && (
                    <Typography.Paragraph style={{ color: 'green', fontWeight: 'bold', marginTop: '10px' }}>
                        {cards[currentQuestionIndex]?.answer}
                    </Typography.Paragraph>
                )}

                <Button onClick={toggleAnswer} type="primary" style={{ marginTop: '20px' }}>
                    {showAnswer ? 'Masquer la réponse' : 'Voir la réponse'}
                </Button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                        Précédent
                    </Button>
                    <Button onClick={handleNext} disabled={currentQuestionIndex === cards.length - 1}>
                        Suivant
                    </Button>
                </div>

                {decksBackButton()}
            </Card>
        </div>
    );
};
