import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";

interface Props {
  onUploadSuccess: (media: any) => void;
  uploadMutation: any;
}

export default function MediaUploader({
  onUploadSuccess,
  uploadMutation,
}: Props) {

  const handleUpload = async (file: File) => {
    try {
      const res = await uploadMutation.mutateAsync(file);
      const data = res.data.data; 

      onUploadSuccess({
        url: data.url,
        publicId: data.public_id,
        resourceType: data.resource_type
      });

      message.success("Upload thành công");
    } catch (error) {
      message.error("Upload thất bại");
    }
    return false;
  };

  return (
    <Upload beforeUpload={handleUpload} showUploadList={false}>
      <Button
        icon={<UploadOutlined />}
        loading={uploadMutation.isPending}
      >
        Thêm file (Ảnh/Audio)
      </Button>
    </Upload>
  );
}