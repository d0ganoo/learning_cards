import React, { useRef, useState } from "react";
import { Button, Modal, Typography, FormInstance } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./CardManager.module.css";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { FormCard } from "./Form/FormCard";
import { useClient } from "../../contexts/Client/Client";
import { useUser } from "../../contexts/User/User";  // Assurez-vous que ce chemin est correct
import { useQuery, useMutation } from 'react-query';

export const CardManager: React.FC = () => {
  useDocumentTitle("Learning card - Carte Management");

  const { post, get } = useClient();
  const { user } = useUser();  // Récupère l'utilisateur du contexte
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<FormInstance>(null);

  console.log("user", user)

  // Fetch cards using react-query's useQuery
  const { data: cards, isLoading, error, refetch } = useQuery(
    'flashcards',
    async () => {
      const response = await get('flashcards');
      return response;
    },
    {
      onError: () => console.log('Erreur lors de la récupération des cartes'),
    }
  );

  // Mutation to post a new card
  const { mutate: createCard } = useMutation(
    async (newCard: any) => {
      await post('flashcards', newCard);
    },
    {
      onSuccess: () => {
        console.log('La carte a été enregistrée');
        refetch(); // Rafraîchit la liste des cartes après un enregistrement réussi
      },
      onError: () => {
        console.log('La carte n\'a pas été enregistrée');
      },
    }
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    formRef.current && formRef.current.resetFields();
  };

  const handleOk = () => {
    formRef.current && formRef.current.submit();
  };

  const handleSubmit = (values: any) => {
    const card = {
      question: values.card.question,
      answer: values.card.answer,
      indice: values.card.clue,
      additionalAnswer: values.card.additionalAnswer,
      visibility: values.card.visibility ? "private" : "public",
      ownerId: user?.id,  // Ajoute l'ID du propriétaire depuis le contexte user
    };
    createCard(card);
    setIsModalOpen(false);
  };

  return (
    <Content className={styles.root}>
      <Title>Carte Management</Title>
      <Button className={styles.button} onClick={showModal}>
        <PlusOutlined /> Créer une carte
      </Button>
      
      <Modal
        className={styles.root}
        title="Créer une carte"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Enregistrer"
        cancelText="Annuler"
      >
        <FormCard ref={formRef} onSubmit={handleSubmit} />
      </Modal>

      {isLoading ? (
        <Typography.Text>Loading cards...</Typography.Text>
      ) : error ? (
        <Typography.Text type="danger">Erreur lors du chargement des cartes</Typography.Text>
      ) : (
        <div>
          {cards?.map((card: any) => (
            <div key={card.id}>
              <Typography.Title level={5}>{card.question}</Typography.Title>
              <Typography.Paragraph>{card.answer}</Typography.Paragraph>
            </div>
          ))}
        </div>
      )}
    </Content>
  );
};
