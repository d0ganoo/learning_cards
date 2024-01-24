import { ClientContextType } from "../../contexts/Client/types";
import { DocumentType } from "../../features/Documents/Storage/types";

export type UploadedMediaApiResponseType = {
  data: {
    name: string;
    url: {
      original: string;
    };
    mime: string;
    platform: string;
    directory: string | null;
    uploaded_by: {
      id: string;
    };
    model_type: string;
    id: string;
    updated_at: string;
    created_at: string;
  };
  metadata: any;
  errors: any;
};

export type UploadedMediaType = {
  id: string;
  uid?: string;
  url: string;
  name: string;
  type: string;
};

export type MediaUploaderProps = {
  label?: string;
  onUpload: (mediaIdList: Array<UploadedMediaType>) => void;
  children?: React.ReactNode;
  isDragger?: boolean;
  limit?: number;
  placeholder?: string;
  pictureListType: "picture-card" | "picture";
  defaultValue?: Array<UploadFile>;
  canRemove?: boolean;
  directory?: DocumentType;
};

export type MediaUploaderState = {
  clientContext: ClientContextType | undefined;
  mediaList: Array<UploadedMediaType>;
};
