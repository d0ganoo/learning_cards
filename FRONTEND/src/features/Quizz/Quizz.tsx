import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Typography, Progress, List, Modal } from 'antd';
import { LeftOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useDecks } from '../../contexts/UserDecks/Deck';
import { useGetFlashCardsByDeckId } from '../../hooks/useGetFlashCardsByDeckId';
import { useClient } from '../../contexts/Client/Client';
import { useUser } from '../../contexts/User/User';
import { useMutation } from 'react-query';
import styles from "./Quizz.module.css";

type DeckType = { id: number; name: string };

export const Quizz: React.FC = () => {
    const { decks, isLoading: isDeckLoading, error: deckError } = useDecks();
    const { post, put } = useClient();
    const { user } = useUser();

    const [currentDeckIndex, setCurrentDeckIndex] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [trainingSessionId, setTrainingSessionId] = useState<number | null>(null);
    const [trainingStartTime, setTrainingStartTime] = useState<Date | null>(null);
    const [isSessionCompleted, setIsSessionCompleted] = useState(false);  // Flag pour indiquer que la session est terminée

    const selectedDeck = useMemo(() => (currentDeckIndex !== null ? decks[currentDeckIndex] : null), [currentDeckIndex, decks]);
    const { data: cards = [], isLoading: isCardLoading, error: cardError } = useGetFlashCardsByDeckId(selectedDeck?.id);

    // Démarre et arrête la session d'entraînement
    const startTrainingSession = useMutation(async (deckId: number) => {
        const response = await post('training-sessions/start', { deckId, userId: user?.id });
        return response.data;
    }, {
        onSuccess: (session) => {
            setTrainingSessionId(session.id);
            setTrainingStartTime(new Date(Date.now() - session.duration * 1000));
        },
        onError: (error) => console.error('Erreur lors du démarrage de la session', error),
    });

    const endTrainingSession = useMutation(async () => {
        const duration = trainingStartTime ? Math.floor((Date.now() - trainingStartTime.getTime()) / 1000) : 0;
        if (trainingSessionId) await put(`training-sessions/${trainingSessionId}`, { duration });
        return duration;
    }, {
        onSuccess: () => {
            resetTrainingSession();
            setCurrentDeckIndex(null); // Réinitialise le deck sélectionné pour revenir à la liste
        },
        onError: (error) => console.error('Erreur lors de la fin de la session', error),
    });

    // Gère la session de quiz
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
                // Afficher un message de félicitations si c'est la dernière carte
                setIsSessionCompleted(true);  // Marquer la session comme terminée
            } else {
                moveToNextCard();
            }
        }
    };

    const moveToNextCard = () => {
        if (currentQuestionIndex < cards.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setShowAnswer(false);
        }
    };

    const moveToPreviousCard = () => {
        if (isSessionCompleted)
            setCurrentQuestionIndex((prev) => (prev > 0 ? prev : cards.length));
        else
            setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
        setShowAnswer(false);
        setIsSessionCompleted(false);
    };

    const resetTrainingSession = () => {
        setTrainingSessionId(null);
        setTrainingStartTime(null);
        setIsSessionCompleted(false);
    };

    const renderLoadingOrError = (message: string, isError = false) => (
        <div className={styles.container}>
            <Card style={{ width: 400, textAlign: 'center' }}>
                <Typography.Text type={isError ? "danger" : undefined}>{message}</Typography.Text>
            </Card>
        </div>
    );

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
                            }} style={{ cursor: 'pointer' }}>
                                {deck.name}
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
                {!isSessionCompleted && <Progress percent={((currentQuestionIndex + 1) / cards.length) * 100} status="active" />}
                {!isSessionCompleted && <Typography.Paragraph>{currentCard.question}</Typography.Paragraph>}
                {showAnswer && !isSessionCompleted && <Typography.Paragraph strong style={{ color: 'green' }}>{currentCard.answer}</Typography.Paragraph>}

                {isSessionCompleted ? (
                    <React.Fragment>
                        <Typography.Paragraph style={{ color: 'green', fontWeight: 'bold', marginBottom: '0px' }}>
                            Vous avez terminé votre session d'entraînement !
                        </Typography.Paragraph>
                        <Typography.Paragraph style={{ color: 'green', fontWeight: 'bold' }}>
                            Bravo !
                        </Typography.Paragraph>
                    </React.Fragment>
                ) : (
                    <Button onClick={() => setShowAnswer((prev) => !prev)} type="primary" style={{ marginTop: '20px' }}>
                        {showAnswer ? 'Masquer la réponse' : 'Voir la réponse'}
                    </Button>
                )}

                {/* Boutons de navigation et de statut des cartes */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '8px' }}>
                    <Button
                        onClick={moveToPreviousCard}
                        icon={<LeftOutlined />}
                        style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }}
                        disabled={currentQuestionIndex === 0}
                    />
                    {!isSessionCompleted && (
                        <>
                            <Button
                                onClick={() => handleStatusChange(currentCard.id, 'unknown')}
                                icon={<CloseOutlined />}
                                style={{ backgroundColor: 'red', color: 'white' }}
                            />
                            <Button
                                onClick={() => handleStatusChange(currentCard.id, 'known')}
                                icon={<CheckOutlined />}
                                style={{ backgroundColor: 'green', color: 'white' }}
                            />
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
