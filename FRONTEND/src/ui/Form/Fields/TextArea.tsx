import React from "react";
import { Input } from "antd";

interface TextareaProps {
  placeholder: string;
}

export const Textarea: React.FC<TextareaProps> = ({ placeholder }) => (
  <Input.TextArea placeholder={placeholder} />
);
