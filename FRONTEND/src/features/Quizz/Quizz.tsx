import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Button, Typography, Progress, List } from 'antd';
import { LeftOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useDecks } from '../../contexts/UserDecks/Deck';
import { useGetFlashCardsByDeckId } from '../../hooks/useGetFlashCardsByDeckId';
import { useClient } from '../../contexts/Client/Client';
import { useUser } from '../../contexts/User/User';
import { useMutation, useQuery } from 'react-query';
import styles from "./Quizz.module.css";

type DeckType = { id: number; name: string };

export const Quizz: React.FC = () => {
    const { decks, isLoading: isDeckLoading, error: deckError } = useDecks();
    const { post, put, get } = useClient();
    const { user } = useUser();

    const [currentDeckIndex, setCurrentDeckIndex] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [trainingSessionId, setTrainingSessionId] = useState<number | null>(null);
    const [trainingStartTime, setTrainingStartTime] = useState<Date | null>(null);
    const [isSessionCompleted, setIsSessionCompleted] = useState(false);

    const selectedDeck = useMemo(() => currentDeckIndex !== null ? decks[currentDeckIndex] : null, [currentDeckIndex, decks]);

    // Ne récupère les cartes que lorsque selectedDeck.id est défini
    const { data: cards = [], isLoading: isCardLoading, error: cardError } = useGetFlashCardsByDeckId(selectedDeck?.id);

    // Query pour récupérer la durée de session seulement lorsqu'il y a des decks
    const { data: sessionDurations, refetch } = useQuery(
        'sessionDurations',
        async () => {
            const durations: Record<number, number> = {};
            await Promise.all(
                decks.map(async (deck: any) => {
                    const response = await get(`training-sessions/${deck.id}`);
                    if (response) durations[deck.id] = response.duration;
                })
            );
            return durations;
        },
        { enabled: decks.length > 0, refetchOnWindowFocus: false }
    );

    // Formatage dynamique des durées
    const formatDuration = (seconds: number) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        
        let result = '';
        if (days > 0) result += `${days}j `;
        if (hours > 0) result += `${hours}h `;
        if (minutes > 0) result += `${minutes}min`;
        
        // Afficher les secondes uniquement si aucune autre unité n'est présente
        if (!days && !hours && !minutes) result = `${remainingSeconds}s`;
        
        return result.trim();
    };

    // Fonction asynchrone pour démarrer une session d'entraînement avec mutation
    const startTrainingSession = useMutation(async (deckId: number) => {
        const response = await post('training-sessions/start', { deckId, userId: user?.id });
        return response.data;
    }, {
        onSuccess: (session) => {
            setTrainingSessionId(session.id);
            setTrainingStartTime(new Date(Date.now() - session.duration * 1000));
        }
    });

    const endTrainingSession = useMutation(async () => {
        const duration = trainingStartTime ? Math.floor((Date.now() - trainingStartTime.getTime()) / 1000) : 0;
        if (trainingSessionId) await put(`training-sessions/${trainingSessionId}`, { duration });
        return duration;
    }, {
        onSuccess: () => {
            resetTrainingSession();
            setCurrentDeckIndex(null);
        }
    });

    // Gestion de l'état des sessions de quiz
    useEffect(() => {
        if (selectedDeck && !trainingStartTime) startTrainingSession.mutate(selectedDeck.id);
        return () => {
            if (selectedDeck && trainingStartTime) endTrainingSession.mutate();
        };
    }, [selectedDeck, trainingStartTime]);

    const handleStatusChange = async (cardId: number, status: string) => {
        if (trainingSessionId && user) {
            await put(`flashcards/${cardId}/knowledge-status`, { knowledgeStatus: status, userId: user.id, trainingSessionId });
            if (currentQuestionIndex === cards.length - 1) {
                setIsSessionCompleted(true);
            } else {
                moveToNextCard();
            }
        }
    };

    const moveToNextCard = useCallback(() => {
        if (currentQuestionIndex < cards.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setShowAnswer(false);
        }
    }, [currentQuestionIndex, cards.length]);

    const moveToPreviousCard = useCallback(() => {
        setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
        setShowAnswer(false);
        setIsSessionCompleted(false);
    }, [cards.length]);

    const resetTrainingSession = () => {
        setTrainingSessionId(null);
        setTrainingStartTime(null);
        setIsSessionCompleted(false);
        refetch();  // Recharge les durées des sessions
    };

    const renderLoadingOrError = (message: string, isError = false) => (
        <div className={styles.container}>
            <Card style={{ width: 400, textAlign: 'center' }}>
                <Typography.Text type={isError ? "danger" : undefined}>{message}</Typography.Text>
            </Card>
        </div>
    );

    // Conditions de rendu pour éviter d'exécuter inutilement les fonctions
    if (isDeckLoading) return renderLoadingOrError("Chargement des decks...");
    if (deckError) return renderLoadingOrError("Erreur lors du chargement des decks", true);
    if (isCardLoading) return renderLoadingOrError("Chargement des cartes...");
    if (cardError) return renderLoadingOrError("Erreur lors du chargement des cartes", true);

    if (!selectedDeck) {
        return (
            <div className={styles.container}>
                <Card style={{ width: 400, textAlign: 'center', maxHeight: 600 }}>
                    <Typography.Title style={{ margin: '0 0 1em 0' }} level={4}>Sélectionnez un Deck</Typography.Title>
                    <List
                        bordered
                        dataSource={decks}
                        style={{ maxHeight: 300, overflowY: 'auto' }}
                        renderItem={(deck: DeckType, index) => (
                            <List.Item onClick={() => {
                                setCurrentDeckIndex(index);
                                setCurrentQuestionIndex(0);
                                setShowAnswer(false);
                            }} style={{ display: 'flex', justifyContent: 'flex-start', cursor: 'pointer' }}>
                                {deck.name}
                                {sessionDurations && sessionDurations[deck.id] != null && (
                                    <Typography.Text italic style={{ fontSize: '12px', color: 'lightGrey', marginLeft: '10px' }}>
                                        ({formatDuration(sessionDurations[deck.id])} d'entraînement) 
                                    </Typography.Text>
                                )}
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        );
    }

    const currentCard = cards[currentQuestionIndex];
    if (!currentCard) return renderLoadingOrError("Aucune carte disponible.");

    return (
        <div className={styles.container}>
            <Card style={{ width: 520, textAlign: 'center', padding: '48px' }}>
                <Typography.Title level={4} style={{ marginTop: '0px' }}>
                    {isSessionCompleted ? 'Félicitations!' : `Question ${currentQuestionIndex + 1}/${cards.length}`}
                </Typography.Title>
                {!isSessionCompleted && <Progress percent={parseFloat((((currentQuestionIndex + 1) / cards.length) * 100).toFixed(0))} status="active" />}
                {!isSessionCompleted && <Typography.Paragraph>{currentCard.question}</Typography.Paragraph>}
                {showAnswer && !isSessionCompleted && <Typography.Paragraph strong style={{ color: 'green' }}>{currentCard.answer}</Typography.Paragraph>}

                {isSessionCompleted ? (
                    <Typography.Paragraph style={{ color: 'green', fontWeight: 'bold' }}>
                        Vous avez terminé votre session d'entraînement !
                    </Typography.Paragraph>
                ) : (
                    <Button onClick={() => setShowAnswer((prev) => !prev)} type="primary" style={{ marginTop: '20px' }}>
                        {showAnswer ? 'Masquer la réponse' : 'Voir la réponse'}
                    </Button>
                )}

                {/* Navigation et gestion du statut des cartes */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '8px' }}>
                    <Button onClick={moveToPreviousCard} icon={<LeftOutlined />} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} disabled={currentQuestionIndex === 0} />
                    {!isSessionCompleted && (
                        <>
                            <Button onClick={() => handleStatusChange(currentCard.id, 'unknown')} icon={<CloseOutlined />} style={{ backgroundColor: 'red', color: 'white' }} />
                            <Button onClick={() => handleStatusChange(currentCard.id, 'known')} icon={<CheckOutlined />} style={{ backgroundColor: 'green', color: 'white' }} />
                        </>
                    )}
                </div>

                <Button onClick={() => endTrainingSession.mutate()} type="dashed" style={{ width: '100%', marginTop: '20px' }}>
                    Retour aux decks
                </Button>
            </Card>
        </div>
    );
};
