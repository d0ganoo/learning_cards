import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Typography, FormInstance, Card, Table, Pagination, notification, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
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
import { DeckType } from "../types";
import { CardType } from "./types";

export const CardManager: React.FC = () => {
  useDocumentTitle("Learning card - Carte Management");

  const { post, deletion: deleteRequest, put } = useClient();
  const { user } = useUser();
  const { decks, isLoading: isDeckLoading, error: deckError, refetch: deckRefetch } = useDecks();
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<null | DeckType>(null);
  const [editingCard, setEditingCard] = useState<null | CardType>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const formCardRef = useRef<FormInstance>(null);
  const formDeckRef = useRef<FormInstance>(null);
  const { data: cards = [], isLoading: isCardLoading, error: cardError, refetch: cardRefetch } = useGetFlashCardsByDeckId(selectedDeck?.id || null);

  const [currentDeckPage, setCurrentDeckPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 14;
  const deckPageSize = 14;

  const paginatedDecks = decks.slice(
    (currentDeckPage - 1) * deckPageSize,
    currentDeckPage * deckPageSize
  );

  // Création de carte
  const { mutate: createCard } = useMutation(
    async (newCard: any) => {
      await post('flashcards', newCard);
    },
    {
      onSuccess: () => {
        cardRefetch();
        messageApi.open({
          type: 'success',
          content: 'La carte a été crée avec succès.',
        });
      },
    }
  );

  // Suppression de carte avec modal de confirmation
  const { mutate: deleteCard } = useMutation(
    async (cardId: number) => {
      await deleteRequest(`flashcards/${cardId}`);
    },
    {
      onSuccess: () => {
        cardRefetch();
        messageApi.open({
          type: 'success',
          content: 'La carte a été supprimée avec succès.',
        });
      },
    }
  );

  const confirmDeleteCard = (cardId: number) => {
    Modal.confirm({
      title: "Confirmation de suppression",
      icon: <ExclamationCircleOutlined />,
      content: "Êtes-vous sûr de vouloir supprimer cette carte ? Cette action est irréversible.",
      okText: "Oui",
      cancelText: "Non",
      onOk: () => deleteCard(cardId),
    });
  };

  // Mise à jour de carte
  const { mutate: updateCard } = useMutation(
    async (updatedCard: any) => {
      await put(`flashcards/${updatedCard.id}`, updatedCard);
    },
    {
      onSuccess: () => {
        setEditingCard(null);
        cardRefetch();
      },
    }
  );

  const handleCardCancel = () => {
    setIsCardModalOpen(false);
    formCardRef.current && formCardRef.current.resetFields();
    setEditingCard(null);
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
      deckId: selectedDeck?.id,
      ownerId: user?.id,
    };

    if (editingCard) {
      updateCard({ ...card, id: editingCard?.id });
    } else {
      createCard(card);
    }

    setIsCardModalOpen(false);
  };

  const handleDeckCancel = () => {
    setIsDeckModalOpen(false);
    formDeckRef.current && formDeckRef.current.resetFields();
  };

  const handleDeckClick = (deck: DeckType) => {
    setSelectedDeck(deck);
    setCurrentPage(1);
  };

  const handleEditCard = (card: CardType) => {
    setEditingCard(card);
    setIsCardModalOpen(true);
    formCardRef.current && formCardRef.current.setFieldsValue({ card });
  };

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
      dataIndex: 'additionalAnswer',
      key: 'additionalAnswer',
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
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 400,
      render: (_: any, record: any) => (
        <div style={{ float: 'right' }}>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => confirmDeleteCard(record.id)}
            style={{ marginRight: '8px' }}
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEditCard(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <Content className={styles.root}>
      <Title>Carte Management</Title>
      {contextHolder}
      <Modal
        title="Créer un Deck"
        open={isDeckModalOpen}
        onOk={() => formDeckRef.current?.submit()}
        onCancel={handleDeckCancel}
        okText="Enregistrer"
        cancelText="Annuler"
      >
        <FormDeck ref={formDeckRef} onSubmit={(values) => {
          const deck = { name: values.deck.name, ownerId: user?.id };
          post('decks', deck).then(deckRefetch);
          setIsDeckModalOpen(false);
        }} />
      </Modal>

      <Modal
        title={editingCard ? `Modifier la carte - Deck ${selectedDeck?.name}` : `Créer une carte - Deck: ${selectedDeck?.name}`}
        open={isCardModalOpen}
        onOk={handleCardOk}
        onCancel={handleCardCancel}
        okText="Enregistrer"
        cancelText="Annuler"
        destroyOnClose={true}
      >
        <FormCard ref={formCardRef} onSubmit={handleCardSubmit} initialData={editingCard} />
      </Modal>

      {isDeckLoading ? (
        <Typography.Text>Loading...</Typography.Text>
      ) : deckError ? (
        <Typography.Text type="danger">Erreur lors du chargement des decks</Typography.Text>
      ) : (
        <React.Fragment>
          <div className={styles.headerBlock}>
            <Typography.Title level={4}>Decks :</Typography.Title>
            <Button onClick={() => setIsDeckModalOpen(true)}>
              <PlusOutlined /> Créer un Deck
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {paginatedDecks.map((deck: any) => (
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

          <Pagination
            current={currentDeckPage}
            pageSize={deckPageSize}
            total={decks.length}
            onChange={(page) => setCurrentDeckPage(page)}
            style={{ textAlign: 'center', marginTop: '16px' }}
          />

          {selectedDeck?.id && (
            <div style={{ marginTop: '20px' }}>
              <div className={styles.headerBlock}>
                <Typography.Title level={4}>Cartes du deck : {selectedDeck?.name}</Typography.Title>
                <Button onClick={() => setIsCardModalOpen(true)}>
                  <PlusOutlined /> Créer une carte
                </Button>
              </div>

              {isCardLoading ? (
                <Typography.Text>Loading...</Typography.Text>
              ) : cardError ? (
                <Typography.Text type="danger">Erreur lors du chargement des cartes</Typography.Text>
              ) : (
                <Table
                  dataSource={cards}
                  columns={columns}
                  rowKey="id"
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    onChange: (page) => setCurrentPage(page),
                  }}
                  scroll={{ x: '100%' }}
                  size="small"
                />
              )}
            </div>
          )}
        </React.Fragment>
      )}
    </Content>
  );
};
