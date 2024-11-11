import React, { forwardRef } from "react";
import { Checkbox, Form, Input, Select, FormInstance } from "antd";
import styles from "./FormCard.module.css";

type FormCardProps = {
    onSubmit: (values: any) => void;
    decks: { id: number; name: string }[]; // Typage des decks en un tableau avec `id` et `name`
}

export const FormCard = forwardRef<FormInstance, FormCardProps>(({ onSubmit, decks }, ref) => {
    const validateMessages = {
        required: "La ${label} est obligatoire!",
    };

    return (
        <Form
            className={styles.form}
            name="form-card"
            onFinish={onSubmit}
            style={{ maxWidth: 600 }}
            validateMessages={validateMessages}
            ref={ref}
        >
            <Form.Item label="Privé" name={["card", "visibility"]} valuePropName="checked">
                <Checkbox />
            </Form.Item>
            <Form.Item name={["card", "deckId"]} label="Deck" rules={[{ required: true }]}>
                <Select placeholder="Sélectionnez un deck">
                    {decks.map(deck => (
                        <Select.Option key={deck.id} value={deck.id}>
                            {deck.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name={["card", "question"]} label="Question" rules={[{ required: true }]}>
                <Input.TextArea />
            </Form.Item>
            <Form.Item name={["card", "answer"]} label="Réponse" rules={[{ required: true }]}>
                <Input.TextArea />
            </Form.Item>
            <Form.Item name={["card", "additionalAnswer"]} label="Réponse complémentaire">
                <Input.TextArea />
            </Form.Item>
            <Form.Item name={["card", "clue"]} label="Indice">
                <Input.TextArea />
            </Form.Item>
        </Form>
    );
});
