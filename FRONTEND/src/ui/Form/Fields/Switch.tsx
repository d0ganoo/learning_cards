import React from "react";
import { Switch as AntdSwitch, Space } from "antd";

interface SwitchProps {
  placeholder: string;
  name: string;
  onHandleChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({
  name,
  placeholder,
  onHandleChange,
}) => {
  let defaultChecked = false;
  if (name === "demandPublish") {
    onHandleChange(true);
    defaultChecked = true;
  }
  return (
    <Space>
      <label>{placeholder}</label>
      <AntdSwitch onChange={onHandleChange} defaultChecked={defaultChecked} />
    </Space>
  );
};
