import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Checkbox, Form, Input, FormInstance } from "antd";
import ReactQuill from "react-quill";  // Importer l'éditeur React Quill
import "react-quill/dist/quill.snow.css";  // Importer le style de l'éditeur
import 'highlight.js/styles/androidstudio.css';  // Importation du style de Highlight.js
import hljs from 'highlight.js';  // Importer Highlight.js pour la coloration syntaxique
import styles from "./FormCard.module.css";
import { CardType } from "../types";

// Définir les options du module de Quill
const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        [{ 'align': [] }],
        ['code-block'],  // Ajouter le bouton 'code-block' à la toolbar
    ],
    syntax: {
        highlight: (text: string) => hljs.highlightAuto(text).value,  // Utiliser Highlight.js pour la coloration syntaxique
    },
};

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
    }, [initialData, form]);  // Exécuter cet effet lorsque initialData change

    // Fonction pour gérer la mise à jour de la réponse formatée
    const handleEditorChange = (value: string) => {
        form.setFieldsValue({ card: { answer: value } });
    };

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
                <ReactQuill
                    value={form.getFieldValue(["card", "answer"])}  // Récupérer la valeur depuis le formulaire
                    onChange={handleEditorChange}  // Mettre à jour la valeur dans le formulaire
                    theme="snow"  // Choisir un thème pour l'éditeur
                    placeholder="Écrivez la réponse ici..."
                    modules={modules}
                />
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
