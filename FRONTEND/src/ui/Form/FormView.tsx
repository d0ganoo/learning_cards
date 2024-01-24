import React from "react";

import { Row, Col, Space, Button, Form, Collapse } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import styles from "./FormView.module.css";

import {
  Input,
  PasswordInput,
  Textarea,
  Radio,
  Switch,
  DatePicker,
  MediaUploader,
} from "./Fields";

import {
  FormViewProps,
  FormField,
  FormFieldStructure,
  FormFields,
} from "./types";
import { UploadedMediaType } from "../MediaUploader/types";

const { Panel } = Collapse;

export const FormView: React.FC<FormViewProps> = ({
  formStructure,
  initialValues = {},
  fields,
  footer,
  hasError,
  errorMessage,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  if (hasError) {
    form.resetFields();
  }

  const submitHandler = () => {
    onSubmit(form.getFieldsValue());
  };

  const buildField = (
    {
      name,
      picker,
      type,
      placeholder,
      options,
      rules,
      icon,
      isDisabled,
      limit,
      pictureListType,
      canRemove,
    }: FormField,
    index?: number
  ) => {
    var field;

    switch (type) {
      case "text":
      case "email":
      case "tel":
        /* for field with type list, to specify a numbering for each item in the list */
        const indexedPlaceholder =
          index !== undefined ? `${placeholder} ${index + 3}` : placeholder;
        field = Input({
          type,
          placeholder:
            name === "customer" ? initialValues[name] : indexedPlaceholder,
          icon,
          isDisabled,
        });
        break;
      case "password":
        field = PasswordInput({ placeholder });
        break;
      case "radio":
        field = Radio({
          placeholder,
          options,
          defaultValue: Boolean(form.getFieldValue(name)),
        });
        break;
      case "textArea":
        field = Textarea({ placeholder });
        break;
      case "switch":
        field =
          initialValues.email === undefined || initialValues.phone === undefined
            ? Switch({
                placeholder,
                name,
                onHandleChange: (checked: any) =>
                  form.setFieldsValue({ [name]: checked }),
              })
            : null;
        break;
      case "mediaUploader":
        field = MediaUploader({
          name,
          defaultValue: initialValues[name] || [],
          placeholder,
          limit,
          pictureListType: pictureListType || "picture-card",
          onUpload: (mediaList: Array<UploadedMediaType>) => {
            form.setFieldsValue({ [name]: mediaList });
          },
          canRemove,
        });
        break;
      case "date":
        field = DatePicker({
          placeholder,
          name,
          picker,
          defaultValue: form.getFieldValue(name) || initialValues[name],
          onChange: (value) => form.setFieldsValue({ [name]: value }),
        });
        break;

      default:
        break;
    }
    return (
      <Form.Item
        name={index !== undefined ? index : name}
        key={index !== undefined ? index : name}
        rules={rules}
        validateTrigger={type === "email" ? "onInvalid" : "onChange"}
      >
        {field}
      </Form.Item>
    );
  };

  const buildCollapseFieldList = (listField: FormFieldStructure) => {
    return (
      listField.items && (
        <Collapse defaultActiveKey={["1"]}>
          <Panel
            id="ciblage"
            showArrow={false}
            header={listField.header}
            key="2"
          >
            <Row>
              {listField.items.map((field: any) => (
                <Col span={24}>{buildField(fields[field.name])}</Col>
              ))}
            </Row>
          </Panel>
        </Collapse>
      )
    );
  };

  const buildFieldsGroup = (field: FormFieldStructure) =>
    field.items && (
      <>
        <Row key={`${field.name}`} gutter={8}>
          {field.items.map((item: FormFieldStructure) => (
            <Col
              key={`${field.name}-${item.name}`}
              span={field.items ? 24 / field.items.length : 24}
            >
              {buildField(fields[item.name])}
            </Col>
          ))}
        </Row>
        {field.items.map((item: FormFieldStructure) => {
          if (item.name === "email" && errorMessage !== "") {
            return (
              <Row
                className={styles.fadein}
                style={{
                  color: "rgb(207, 19, 34)",
                  fontSize: "14px",
                  textAlign: "center",
                  display: "block",
                  marginBottom: "15px",
                }}
              >
                {errorMessage}
              </Row>
            );
          }
        })}
      </>
    );

  const buildFieldList = (
    mainFields: FormFields,
    listField: FormFieldStructure
  ) => (
    <Form.List name={listField.name}>
      {(fields: any, { add, remove }) => (
        <>
          {fields.map((field: any, index: any) => (
            <Form.Item
              required={false}
              key={field.key}
              style={{ marginBottom: "0" }}
            >
              {listField.itemPattern &&
                buildField(mainFields[listField.itemPattern.name], index)}
              {fields.length >= 1 ? (
                <MinusCircleOutlined
                  style={{
                    color: "red",
                    fontSize: "24px",
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                  }}
                  onClick={() => {
                    remove(field.name);
                  }}
                />
              ) : null}
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              id="add_an_anwser"
              type="link"
              style={{ padding: "0" }}
              onClick={() => {
                add();
              }}
            >
              Ajouter une réponse
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );

  return (
    <Form form={form} onFinish={submitHandler} initialValues={initialValues}>
      <Space
        direction="vertical"
        size="small"
        style={{
          width: "100%",
        }}
      >
        {formStructure.map((field: any) => {
          if (field.type === "group") {
            return buildFieldsGroup(field);
          }
          if (field.type === "list") {
            return buildFieldList(fields, field);
          }
          if (field.type === "collapseList") {
            return buildCollapseFieldList(field);
          }
          return buildField(fields[field.name]);
        })}
        <Form.Item>{footer}</Form.Item>
      </Space>
    </Form>
  );
};
