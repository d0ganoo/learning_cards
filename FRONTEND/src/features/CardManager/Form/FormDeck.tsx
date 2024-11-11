import React, { forwardRef } from "react";
import { Form, Input, FormInstance } from "antd";
import styles from "./FormCard.module.css";

type FormDeckProps = {
    onSubmit: (values: any) => void;
}

export const FormDeck = forwardRef<FormInstance, FormDeckProps>(({ onSubmit }, ref) => {
    const validateMessages = {
        required: "La ${label} est obliatoire!",
    };

    return (
        <Form
            className={styles.form}
            name="form-deck"
            onFinish={onSubmit}
            style={{ maxWidth: 600 }}
            validateMessages={validateMessages}
            ref={ref}
        >
            <Form.Item name={["deck", "name"]} label="Nom du deck" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
        </Form>
    );
});
