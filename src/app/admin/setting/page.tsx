"use client";

import { useUploadFileCloudinary } from "@/queries/useCloudinaryQuery";
import { useGetSettings, useUpdateSettings } from "@/queries/useSettingQuery";
import { handleError } from "@/utils/error";
import {
  CloseOutlined,
  CloudUploadOutlined,
  EditOutlined,
  FileAddOutlined,
  PictureOutlined,
  SaveOutlined,
  SettingOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  message,
  Skeleton,
  Space,
  Typography,
  Upload
} from "antd";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

export default function SettingsPage() {

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const { data: settingRes, isLoading } = useGetSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings();
  const { mutateAsync: uploadCloudinary } = useUploadFileCloudinary();

  const settings = settingRes?.data;

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [settings]);

  const handleFileUpload = async (file: File, fieldName: string) => {
    setUploadingField(fieldName);

    try {
      const res = await uploadCloudinary(file);
      const url = res.data?.data?.url;

      if (url) {
        form.setFieldValue(fieldName, url);
        message.success("Upload thành công");
      }
    } catch (error) {
      message.error("Upload thất bại");
    }
    setUploadingField(null);
    return false;
  };

  const onFinish = (values: any) => {
    updateSettings(values, {
      onSuccess: () => {
        message.success("Lưu cấu hình thành công");
        setIsEditing(false);
      },
      onError: (err) => handleError(err, message)
    });

  };

  const handleCancel = () => {
    form.setFieldsValue(settings);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="p-10">
        <Skeleton active avatar paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-4 md:p-8">
      <div className="w-full mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--color-navy-deep)] rounded-xl flex items-center justify-center shadow-lg">
              <SettingOutlined className="text-2xl text-[var(--color-accent)]" />
            </div>
            <div>
              <Title level={2} className="!mb-0 !text-[var(--color-primary)]">
                Cấu hình hệ thống
              </Title>
              <Text type="secondary">
                Quản lý giao diện và tài nguyên mặc định
              </Text>
            </div>

          </div>

          <Space>
            {!isEditing ? (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
                className="h-11 px-8 rounded-lg font-bold"
              >
                Chỉnh sửa
              </Button>

            ) : (
              <>
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  className="h-11 rounded-lg"
                >
                  Hủy
                </Button>

                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={isUpdating}
                  onClick={() => form.submit()}
                  className="h-11 px-8 rounded-lg bg-green-600 font-bold"
                >
                  Lưu
                </Button>
              </>

            )}
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={!isEditing}
        >
          <Form.Item name="logo" hidden>
            <input />
          </Form.Item>
          <Form.Item name="backgroundImage" hidden>
            <input />
          </Form.Item>
          <Form.Item name="audioTest" hidden>
            <input />
          </Form.Item>
          <div className="grid grid-cols-1 gap-6">

            {/* BRAND */}

            <Card title={<span className="font-bold uppercase text-sm">Hình ảnh thương hiệu</span>}>
              {/* LOGO */}
              <div className="flex flex-col md:flex-row gap-8 py-4">
                <div className="md:w-1/3">
                  <Text strong>Logo hệ thống</Text>
                </div>
                <div className="flex-1 flex items-center gap-6">
                  <div className="w-24 h-24 bg-[var(--color-navy-deep)] rounded-2xl flex items-center justify-center">
                    <Form.Item shouldUpdate noStyle>
                      {({ getFieldValue }) => {

                        const logo = getFieldValue("logo");

                        return logo
                          ? <img src={logo} className="max-h-full object-contain" />
                          : <PictureOutlined className="text-3xl text-white/20" />;

                      }}
                    </Form.Item>
                  </div>

                  {isEditing && (
                    <Upload
                      showUploadList={false}
                      beforeUpload={(file) => handleFileUpload(file, "logo")}
                    >
                      <Button loading={uploadingField === "logo"}>
                        Thay đổi Logo
                      </Button>
                    </Upload>

                  )}
                </div>
              </div>

              <Divider />

              {/* BACKGROUND */}

              <div className="flex flex-col md:flex-row gap-8 py-6">
                <div className="md:w-1/3">
                  <Text strong>Hình nền</Text>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="w-full h-40 border rounded-xl overflow-hidden">
                    <Form.Item shouldUpdate noStyle>
                      {({ getFieldValue }) => {
                        const bg = getFieldValue("backgroundImage");

                        return bg
                          ? <img src={bg} className="w-full h-full object-cover" />
                          : (
                            <div className="flex items-center justify-center h-full">
                              <Text type="secondary">Chưa có ảnh</Text>
                            </div>
                          );
                      }}
                    </Form.Item>
                  </div>

                  {isEditing && (
                    <Upload
                      showUploadList={false}
                      beforeUpload={(file) => handleFileUpload(file, "backgroundImage")}
                    >
                      <Button
                        icon={<CloudUploadOutlined />}
                        loading={uploadingField === "backgroundImage"}
                      >
                        Upload ảnh
                      </Button>
                    </Upload>
                  )}
                </div>
              </div>
            </Card>

            {/* AUDIO */}
            <Card title={<span className="font-bold uppercase text-sm">Audio</span>}>
              <div className="flex flex-col md:flex-row gap-8 py-4">
                <div className="md:w-1/3">
                  <Text strong>Audio Test</Text>
                </div>

                <div className="flex-1 space-y-4">
                  <Form.Item shouldUpdate noStyle>
                    {({ getFieldValue }) => {
                      const audio = getFieldValue("audioTest");
                      return audio
                        ? (
                          <audio
                            controls
                            src={audio}
                            className="w-full"
                            key={audio}
                          />
                        )
                        : (
                          <div className="h-20 flex items-center justify-center border border-dashed rounded-xl">
                            <Text type="secondary">Chưa có audio</Text>
                          </div>
                        );
                    }}
                  </Form.Item>

                  {isEditing && (
                    <Upload
                      accept="audio/*"
                      showUploadList={false}
                      beforeUpload={(file) => handleFileUpload(file, "audioTest")}
                    >
                      <Button
                        icon={<FileAddOutlined />}
                        loading={uploadingField === "audioTest"}
                      >
                        Upload Audio
                      </Button>
                    </Upload>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </Form>
      </div>
    </div>
  );
}