import React from "react";
import { Radio as AndtRadio, Space, Typography } from "antd";
import { CheckboxOptionType } from "antd/lib/checkbox";

interface RadioProps {
  placeholder: string;
  defaultValue: any;
  options: CheckboxOptionType[];
}

const { Text } = Typography;

export const Radio: React.FC<RadioProps> = ({
  placeholder,
  options,
  defaultValue,
}) => (
  <Space>
    <Text>{placeholder}</Text>
    <AndtRadio.Group options={options} defaultValue={defaultValue} />
  </Space>
);
