import React from "react";

import { Upload, message, Typography } from "antd";
import {
  DeleteOutlined,
  FilePdfOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";

// import { ClientContext } from '../../contexts';
import {
  MediaUploaderProps,
  MediaUploaderState,
  UploadedMediaType,
  UploadedMediaApiResponseType,
} from "./types";

import styles from "./MediaUploader.module.css";

const { Text } = Typography;
const { Dragger } = Upload;

// La taille maximale acceptée est 10 MB (10000000 Bytes)
const VALID_SIZE = 10000000;

const VALID_FORMAT_LIST = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
];
const DOCUMENT_TYPE = "application/pdf";

export class MediaUploader extends React.Component<
  MediaUploaderProps,
  MediaUploaderState
> {
  constructor(props: MediaUploaderProps) {
    super(props);
    this.state = {
      mediaList: props.defaultValue || [],
      clientContext: undefined,
    };

    this.beforeUpload = this.beforeUpload.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.getMediaViewer = this.getMediaViewer.bind(this);
  }

  beforeUpload(file: RcFile) {
    const isFormatValid = VALID_FORMAT_LIST.includes(file.type);
    const isSizeValid = file.size < VALID_SIZE;
    if (!isFormatValid) {
      message.error(
        "Les formats acceptés sont les suivants : .jpg , .jpeg , .png , .gif , .pdf"
      );
    }
    if (!isSizeValid) {
      message.error(
        "Veuillez importer une photo ou un document inférieur à 10 Mo"
      );
    }
    return isFormatValid && isSizeValid;
  }

  getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleUpload(file: any) {
    // const { onUpload, directory } = this.props;
    // const { clientContext } = this.state;
    // if (clientContext) {
    //   const { upload, get } = clientContext;
    //   this.getBase64(file, (imageUrl: any) => {
    //     const media = {
    //       name: file.name,
    //       file: imageUrl,
    //     };
    //     upload(
    //       directory ? { directory: { id: directory.id }, ...media } : media,
    //       (mediaId: string) => {
    //         get(`/medias/${mediaId}`, (media: UploadedMediaApiResponseType) => {
    //           media.data &&
    //             this.setState(
    //               {
    //                 mediaList: [
    //                   {
    //                     id: media.data.id,
    //                     url: media.data.url.original,
    //                     name: media.data.name,
    //                     type: media.data.mime,
    //                   },
    //                   ...this.state.mediaList,
    //                 ],
    //               },
    //               () => onUpload(this.state.mediaList)
    //             );
    //         });
    //       },
    //       () =>
    //         message.success('Une erreur est survenue lors du de téléchargement')
    //     );
    //   });
    // }
  }

  handleRemove(mediaId: string) {
    const { clientContext } = this.state;
    const { onUpload } = this.props;

    if (clientContext) {
      const { deletion } = clientContext;
      deletion(
        `/medias/${mediaId}`,
        {},
        () => {
          const filteredMedia = this.state.mediaList.filter((media) => {
            if (media.uid) {
              return media.uid !== mediaId;
            } else {
              return media.id !== mediaId;
            }
          });

          this.setState(
            {
              mediaList: filteredMedia,
            },
            () => onUpload(filteredMedia)
          );
        },
        () => {
          message.error(
            "Une erreur est survenue lors de suppression de la photo ou du document"
          );
        }
      );
    }
  }

  getMediaViewer(media: UploadedMediaType) {
    return (
      <div
        key={media.url}
        className={styles.mediaContainer}
        data-testid="media-uploader-view"
      >
        {media.type === DOCUMENT_TYPE ? (
          <FilePdfOutlined className={styles.document} />
        ) : (
          <img src={media.url} alt={media.name} className={styles.image} />
        )}
        <DeleteOutlined
          id="remove_icon"
          className={styles.removeIcon}
          onClick={() => this.handleRemove(media.uid || media.id)}
        />
      </div>
    );
  }

  renderDragger() {
    return (
      <Dragger
        action={"https://www.mocky.io/v2/5cc8019d300000980a055e76"}
        multiple={true}
        name="file"
        // data={this.handleUpload}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">
          Glisser et déposer un document de mon ordinateur
        </p>
      </Dragger>
    );
  }

  renderUploader() {
    const { placeholder, children, limit, defaultValue, pictureListType } =
      this.props;
    const { mediaList } = this.state;

    return (
      <div>
        {placeholder && pictureListType === "picture-card" && (
          <Text strong={true}>{placeholder}</Text>
        )}
        <div className={!limit ? styles.uploadeContainer : undefined}>
          {mediaList.map((media: UploadedMediaType) =>
            this.getMediaViewer(media)
          )}
          {(!limit || (limit && mediaList.length < limit)) && (
            <div>
              <Upload
                id="media_uploader"
                data-testid="media-uploader"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType={pictureListType}
                fileList={this.props.canRemove ? [] : defaultValue}
                beforeUpload={this.beforeUpload}
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: false,
                }}
                // data={this.handleUpload}
                multiple={true}
              >
                {children}
              </Upload>
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { clientContext } = this.state;
    const { isDragger } = this.props;

    return <>{isDragger ? this.renderDragger() : this.renderUploader()}</>;
  }
}
