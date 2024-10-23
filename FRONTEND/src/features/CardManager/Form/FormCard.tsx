import React, { forwardRef } from "react";
import { Checkbox, Form, Input, FormInstance } from "antd";
import styles from "./FormCard.module.css";

type FormCardProps = {
    onSubmit: (values: any) => void;
}

export const FormCard = forwardRef<FormInstance, FormCardProps>(({ onSubmit }, ref) => {
    const validateMessages = {
        required: "La ${label} est obliatoire!",
    };

    return (
        <Form
            className={styles.form}
            name="nest-messages"
            onFinish={onSubmit}
            style={{ maxWidth: 600 }}
            validateMessages={validateMessages}
            ref={ref}
        >
            <Form.Item label="Privé" name={["card", "visibility"]} valuePropName="checked">
                <Checkbox />
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
