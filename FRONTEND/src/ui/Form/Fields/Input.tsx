import React from "react";
import { Input as AntdInput } from "antd";
import {
  BankOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const PREFIX_ICONS: { [key: string]: JSX.Element } = {
  BankOutlined: <BankOutlined />,
  UserOutlined: <UserOutlined />,
  MailOutlined: <MailOutlined />,
  PhoneOutlined: <PhoneOutlined />,
};

interface InputProps {
  type: string;
  placeholder: string;
  icon?: string;
  isDisabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  icon,
  isDisabled,
}) => {
  return (
    <AntdInput
      type={type}
      placeholder={placeholder}
      size="large"
      prefix={icon && PREFIX_ICONS[icon]}
      disabled={isDisabled}
    />
  );
};
