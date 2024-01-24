import { VALIDATION_ERROR_MESSAGES } from "../../../constants";
import { FormStructure, FormFields } from "../../../ui/Form/types";

export const fields: FormFields = {
  email: {
    id: "email",
    name: "email",
    type: "text",
    placeholder: "Votre email",
    // rules: [
    //   {
    //     required: true,
    //     message: VALIDATION_ERROR_MESSAGES.required,
    //     type: "email",
    //   },
    // ],
    icon: "MailOutlined",
  },
  password: {
    id: "password",
    name: "password",
    type: "password",
    placeholder: "Mot de passe",
    rules: [{ required: true, message: VALIDATION_ERROR_MESSAGES.required }],
  },
};

export const formStructure: FormStructure = [
  {
    name: "email",
    type: "field",
  },
  {
    name: "password",
    type: "field",
  },
];
