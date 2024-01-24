import React, { useEffect } from "react";
import { Button } from "antd";
import { Store } from "antd/es/form/interface";

import { fields, formStructure } from "./FormStructure";
import { FormView as FormViewUi } from "../../../ui/Form/FormView";
import { useClient } from "../../../contexts/Client/Client";

type LoginFormViewProps = {
  disabled: boolean;
};

export const LoginFormView: React.FC<LoginFormViewProps> = ({ disabled }) => {
  const { login } = useClient();
  const initialValues = {
    email: "",
    password: "",
  };

  const submitForm = ({ email, password }: Store) => {

      login(
        `login`,
        { username: email, password},
        (res)=> {console.log(res)},
        ()=> console.log("error")
      );
  }


  const footer = (
    <Button
      id="connexion"
      htmlType="submit"
      type="primary"
      size="large"
      disabled={disabled}
      block
    >
      Connexion
    </Button>
  );

  const formProps = {
    formStructure,
    fields,
    initialValues,
    footer,
    onSubmit: submitForm,
  };

  return (
    <>
      <FormViewUi {...formProps} />
    </>
  );
};

export const LoginForm: React.FC = () => {
  return LoginFormView({
    disabled: false,
  });
};
