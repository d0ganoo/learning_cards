import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Checkbox, Form, Input, FormInstance } from "antd";
import styles from "./FormCard.module.css";
import { CardType } from "../types";

type FormCardProps = {
    onSubmit: (values: any) => void;
    initialData: CardType | null;
};

export const FormCard = forwardRef<FormInstance, FormCardProps>(({ onSubmit, initialData }, ref) => {
    const [form] = Form.useForm();  // Création de l'instance de formulaire

    // Exposer l'instance du formulaire à l'extérieur via le ref
    useImperativeHandle(ref, () => form);

    const validateMessages = {
        required: "La ${label} est obligatoire!",
    };

    useEffect(() => {
        if (initialData) {
            // Mettre à jour les valeurs du formulaire lorsque initialData change
            form.setFieldsValue({
                card: {
                    visibility: initialData.visibility === "private",
                    question: initialData.question || "",
                    answer: initialData.answer || "",
                    additionalAnswer: initialData.additionalAnswer || "",
                    indice: initialData.indice || "",
                },
            });
        }
    }, [initialData, form]);  // On exécute cet effet lorsque initialData change

    return (
        <Form
            className={styles.form}
            name="form-card"
            onFinish={onSubmit}
            style={{ maxWidth: 600 }}
            validateMessages={validateMessages}
            form={form}  // Utilisation de l'instance du formulaire
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
            <Form.Item name={["card", "indice"]} label="Indice">
                <Input.TextArea />
            </Form.Item>
        </Form>
    );
});
