import React from "react";
import { Button } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

import { MediaUploader as MediaUploaderView } from "../../../ui/MediaUploader/MediaUploader";
import { UploadedMediaType } from "../../MediaUploader/types";
import { UploadFile } from "antd/lib/upload/interface";

interface MediaUploaderProps {
  name: string;
  placeholder: string;
  pictureListType: "picture-card" | "picture";
  defaultValue: Array<UploadFile>;
  limit?: number;
  onUpload: (mediaList: Array<UploadedMediaType>) => void;
  canRemove?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  name,
  placeholder,
  defaultValue,
  pictureListType,
  limit,
  onUpload,
  canRemove,
}) => {
  const children =
    name === "avatar" ? (
      <Button id="upload_button" icon={<UploadOutlined />}>
        {placeholder}
      </Button>
    ) : (
      <PlusOutlined id="add_icon" />
    );

  const props = {
    limit,
    placeholder,
    pictureListType,
    onUpload,
    defaultValue,
    canRemove,
  };

  return <MediaUploaderView {...props}>{children}</MediaUploaderView>;
};
