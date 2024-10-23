import React, { useRef, useState } from "react";
import { Button, Modal, Typography, FormInstance } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./CardManager.module.css";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { FormCard } from "./Form/FormCard";
import { useClient } from "../../contexts/Client/Client";

export const CardManager: React.FC = () => {
  const { post } = useClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<FormInstance>(null); // Ref to access form instance

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (formRef.current) {
      formRef.current.resetFields();
    }
  };

  const handleOk = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const handleSubmit = (values: any) => {
    console.log("Form Values:", values); // Process form data here
    const card = values.card;

    post(`flashcards`, {
      question: card.question,
      answer: card.answer,
      indice: card.clue,
      additionalAnswer: card.additionalAnswer,
      visibility: card.visibility ? "private" : "public"
    }, () => {
      console.log('La carte a été enregistrée')
    },
      () => {
        console.log('La carte n\'a pas été enregistrée')
      }
    )

    formRef.current && formRef.current.resetFields();
    setIsModalOpen(false); // Close the modal after successful submission
  };

  useDocumentTitle("Learning card - carte management");

  return (
    <Content className={styles.root}>
      <Title>Carte management</Title>
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
    </Content>
  );
};
