export interface FormViewProps {
  formStructure: FormStructure;
  fields: FormFields;
  footer: React.ReactNode;
  initialValues?: any;
  hasError?: boolean;
  errorMessage?: string;
  onSubmit: (body: any) => void;
}

export type FormField = {
  id: string;
  name: string;
  type: string;
  picker?: "time" | "date" | "week" | "month" | "quarter" | "year" | undefined;
  placeholder: string;
  limit?: number;
  rules?: any[];
  options?: Associative | {};
  icon?: string;
  rows?: number;
  isDisabled?: boolean;
  pictureListType?: "picture-card" | "picture";
  canRemove?: boolean;
  isAssociation?: boolean;
};

export type FormFields = {
  [key: string]: FormField;
};

export type FormFieldStructure = {
  type: "title" | "field" | "group" | "list" | "collapseList";
  name: string;
  header?: string;
  items?: FormFieldStructure[];
  itemPattern?: FormFieldStructure;
};

export type FormStructure = Array<FormFieldStructure>;
