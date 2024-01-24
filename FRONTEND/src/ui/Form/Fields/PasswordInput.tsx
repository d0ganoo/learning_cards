import React from "react";
import { Input } from "antd";
import { LockOutlined } from "@ant-design/icons";

const { Password } = Input;

interface InputProps {
  placeholder: string;
}

export const PasswordInput: React.FC<InputProps> = ({ placeholder }) => {
  return (
    <Password
      placeholder={placeholder}
      size="large"
      prefix={<LockOutlined />}
    />
  );
};
