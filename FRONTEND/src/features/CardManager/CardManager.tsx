import React, { useRef, useState } from "react";
import { Button, Modal, Typography, FormInstance, Card, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./CardManager.module.css";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { FormCard } from "./Form/FormCard";
import { useClient } from "../../contexts/Client/Client";
import { useUser } from "../../contexts/User/User";
import { useMutation } from 'react-query';
import { FormDeck } from "./Form/FormDeck";
import { useDecks } from "../../contexts/UserDecks/Deck";
import { useGetFlashCardsByDeckId } from "../../hooks/useGetFlashCardsByDeckId";

type deckType = {
  id: number;
  name: String;
}

export const CardManager: React.FC = () => {
  useDocumentTitle("Learning card - Carte Management");

  const { post, get } = useClient();
  const { user } = useUser();
  const { decks, isLoading: isDeckLoading, error: deckError, refetch: deckRefetch } = useDecks();
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<null | deckType>(null);
  const formCardRef = useRef<FormInstance>(null);
  const formDeckRef = useRef<FormInstance>(null);
  const { data: cards = [], isLoading: isCardLoading, error: cardError, refetch: cardRefetch } = useGetFlashCardsByDeckId(selectedDeck?.id || null);


  const { mutate: createCard } = useMutation(
    async (newCard: any) => {
      await post('flashcards', newCard);
    },
    {
      onSuccess: () => {
        console.log('La carte a été enregistrée');
        cardRefetch();
      },
      onError: () => {
        console.log('La carte n\'a pas été enregistrée');
      },
    }
  );

  const { mutate: createDeck } = useMutation(
    async (newDeck: any) => {
      await post('decks', newDeck);
    },
    {
      onSuccess: () => {
        console.log('Le deck a été enregistrée');
        deckRefetch();
      },
      onError: () => {
        console.log('Le deck n\'a pas été enregistrée');
      },
    }
  );

  // Handle card
  const handleCardCancel = () => {
    setIsCardModalOpen(false);
    formCardRef.current && formCardRef.current.resetFields();
  };

  const handleCardOk = () => {
    formCardRef.current && formCardRef.current.submit();
  };

  const handleCardSubmit = (values: any) => {
    const card = {
      question: values.card.question,
      answer: values.card.answer,
      indice: values.card.clue,
      additionalAnswer: values.card.additionalAnswer,
      visibility: values.card.visibility ? "private" : "public",
      deckId: values.card.deckId,
      ownerId: user?.id,
    };
    createCard(card);
    setIsCardModalOpen(false);
  };


  // Handle deck
  const handleDeckCancel = () => {
    setIsDeckModalOpen(false);
    formDeckRef.current && formDeckRef.current.resetFields();
  };

  const handleDeckOk = () => {
    formDeckRef.current && formDeckRef.current.submit();
  };

  const handleDeckSubmit = (values: any) => {
    const deck = {
      name: values.deck.name,
      ownerId: user?.id,
    };
    createDeck(deck);
    setIsDeckModalOpen(false);
  };

  const handleDeckClick = (deck: deckType) => {
    setSelectedDeck(deck);
  };

  // Colonnes du tableau pour les cartes
  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      width: 400,
    },
    {
      title: 'Réponse',
      dataIndex: 'answer',
      key: 'answer',
      width: 400,
    },
    {
      title: 'Réponse complémentaire',
      dataIndex: 'additionnalAnswer',
      key: 'additionnalAnswer',
      width: 400,
      render: (text: string) => text ? text : <span style={{ color: 'gray', opacity: 0.6 }}>Aucune donnée disponible</span>,
    },
    {
      title: 'Indice',
      dataIndex: 'indice',
      key: 'indice',
      width: 400,
      render: (text: string) => text ? text : <span style={{ color: 'gray', opacity: 0.6 }}>Aucune donnée disponible</span>,
    },
  ];

  return (
    <Content className={styles.root}>
      <Title>Carte Management</Title>
      <div className={styles.buttonsContainer}>
        <Button onClick={() => setIsDeckModalOpen(true)}>
          <PlusOutlined /> Créer un Deck
        </Button>
        <Button onClick={() => setIsCardModalOpen(true)}>
          <PlusOutlined /> Créer une carte
        </Button>
      </div>

      <Modal
        className={styles.root}
        title="Créer un Deck"
        open={isDeckModalOpen}
        onOk={handleDeckOk}
        onCancel={handleDeckCancel}
        okText="Enregistrer"
        cancelText="Annuler"
      >
        <FormDeck ref={formDeckRef} onSubmit={handleDeckSubmit} />
      </Modal>

      <Modal
        className={styles.root}
        title="Créer une carte"
        open={isCardModalOpen}
        onOk={handleCardOk}
        onCancel={handleCardCancel}
        okText="Enregistrer"
        cancelText="Annuler"
      >
        <FormCard ref={formCardRef} onSubmit={handleCardSubmit} decks={decks} />
      </Modal>

      {isDeckLoading ? (
        <Typography.Text>Loading ...</Typography.Text>
      ) : deckError ? (
        <Typography.Text type="danger">Erreur lors du chargement des decks</Typography.Text>
      ) : (
        <React.Fragment>
          <Typography.Title level={4}>Decks:</Typography.Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {decks?.map((deck: any) => (
                <Card
                  key={deck.id}
                  hoverable
                  onClick={() => handleDeckClick(deck)}
                  style={{
                    width: 200,
                    border: selectedDeck?.id === deck.id ? '1px solid #91caff' : '1px solid #d9d9d9',
                    backgroundColor: selectedDeck?.id === deck.id ? '#f5faff' : '#fff',
                    transition: 'background-color 0.3s, border-color 0.3s',
                  }}
                >
                  <Typography.Text>{deck.name}</Typography.Text>
                </Card>
              ))}
            </div>

            {selectedDeck?.id && (
              <div style={{ marginTop: '20px' }}>
                <Typography.Title level={4}>Cartes du deck: {selectedDeck?.name}</Typography.Title>
                {isCardLoading ? (
                  <Typography.Text>Loading...</Typography.Text>
                ) : cardError ? (
                  <Typography.Text type="danger">Erreur lors du chargement des cartes</Typography.Text>
                ) : (
                  <Table
                    dataSource={cards}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: '100%' }}
                  />
                )}
              </div>
            )}
          </div>
        </React.Fragment>
      )}
    </Content>
  );
};
