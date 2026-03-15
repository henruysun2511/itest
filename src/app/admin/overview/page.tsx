"use client";

import { InfoItem } from "@/components/common/info-item";
import { useUploadFileCloudinary } from "@/queries/useCloudinaryQuery";
import { useGetProfile, useUpdateProfile } from "@/queries/useProfileQuery";
import { handleError } from "@/utils/error";
import {
  CalendarOutlined,
  CameraOutlined,
  CloseOutlined,
  EditOutlined,
  LoadingOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Typography,
  Upload,
  message
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

export default function AdminOverviewPage() {

  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { data: profileRes, isLoading: isFetching } = useGetProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutateAsync: uploadCloudinary } = useUploadFileCloudinary();

  const profile = profileRes?.data;

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        ...profile,
        dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null
      });
    }
  }, [profile]);

  const handleUploadAvatar = async (file: File) => {
    setUploadingAvatar(true);

    try {
      const res = await uploadCloudinary(file);
      const url = res.data?.data?.url;

      if (url) {
        form.setFieldValue("avatar", url);
        message.success("Upload avatar thành công");
      }
    } catch (error) {
      message.error("Upload avatar thất bại");
    }
    setUploadingAvatar(false);
    return false;
  };

  const handleCancle = () => {
    if (!profile) return;

    form.setFieldsValue({
      ...profile,
      dateOfBirth: profile.dateOfBirth
        ? dayjs(profile.dateOfBirth)
        : null
    });
  };

  const onFinish = (values: any) => {

    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.toISOString()
        : null
    };

    updateProfile(payload, {
      onSuccess: () => {
        message.success("Cập nhật thông tin thành công");
        setIsEditing(false);
      },
      onError: (error: any) => handleError(error, message)
    });
  };

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingOutlined className="text-3xl text-[var(--color-primary)]" spin />
      </div>
    );
  }

  const avatar = form.getFieldValue("avatar") || profile?.avatar;

  return (

    <div className="p-6 w-full">

      {/* HEADER */}

      <div className="relative mb-12">

        <div className="h-40 w-full rounded-3xl bg-gradient-to-r from-[var(--color-navy-deep)] to-[var(--color-navy-main)] shadow-lg"></div>

        <div className="absolute -bottom-8 left-8 flex items-end gap-6">

          <div className="relative group">

            <Avatar
              size={140}
              src={avatar}
              className="border-4 border-white shadow-xl bg-[var(--color-primary)] flex items-center justify-center text-5xl font-bold"
            >
              {!avatar && profile?.fullName?.charAt(0).toUpperCase()}
            </Avatar>

            {isEditing && (

              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={handleUploadAvatar}
              >

                <Button
                  type="primary"
                  shape="circle"
                  icon={uploadingAvatar ? <LoadingOutlined /> : <CameraOutlined />}
                  className="absolute bottom-2 right-2 shadow-lg border-2 border-white bg-[var(--color-accent)]"
                  size="large"
                />

              </Upload>

            )}

          </div>

          <div className="mb-4">

            <Title level={2} className="!mb-1 !text-white">
              {profile?.fullName}
            </Title>

            <div className="mt-1 flex items-center gap-2 text-[var(--color-accent-soft)]">
              <SafetyCertificateOutlined />
              <Text className="text-[var(--color-accent-soft)] font-bold">
                Administrator
              </Text>
            </div>

          </div>

        </div>

        <div className="absolute bottom-[-40px] right-4">

          {!isEditing ? (

            <Button
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
              className="rounded-full h-11 px-6 shadow-md border-[var(--color-primary)] text-[var(--color-primary)]"
            >
              Chỉnh sửa hồ sơ
            </Button>

          ) : (

            <Button
              icon={<CloseOutlined />}
              onClick={() => {
                handleCancle();
                setIsEditing(false);
              }}
              className="rounded-full h-11 px-6 shadow-md"
              danger
            >
              Hủy
            </Button>
          )}
        </div>
      </div>

      {/* FORM */}
      <Card className="shadow-xl border-0 rounded-3xl overflow-hidden mt-16">
        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item name="avatar" hidden>
              <input />
            </Form.Item>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <Form.Item
                name="fullName"
                label={<Text strong>Họ và tên</Text>}
                rules={[{ required: true }]}
              >
                <Input size="large" placeholder="Nhập họ tên" />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                label={<Text strong>Số điện thoại</Text>}
              >
                <Input size="large" placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                label={<Text strong>Ngày sinh</Text>}
              >
                <DatePicker
                  size="large"
                  className="w-full"
                  format="DD/MM/YYYY"
                />
              </Form.Item>

              <Form.Item
                name="gender"
                label={<Text strong>Giới tính</Text>}
              >
                <Select
                  size="large"
                  options={[
                    { value: "MALE", label: "Nam" },
                    { value: "FEMALE", label: "Nữ" },
                    { value: "OTHER", label: "Khác" }
                  ]}
                />
              </Form.Item>
            </div>

            <div className="flex justify-end mt-8 border-t pt-6">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
                loading={isUpdating}
              >
                Lưu cập nhật
              </Button>
            </div>
          </Form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <InfoItem
              icon={<UserOutlined className="text-blue-500" />}
              label="Họ và tên"
              value={profile?.fullName}
            />

            <InfoItem
              icon={<PhoneOutlined className="text-green-500" />}
              label="Số điện thoại"
              value={profile?.phoneNumber}
            />

            <InfoItem
              icon={<CalendarOutlined className="text-orange-500" />}
              label="Ngày sinh"
              value={
                profile?.dateOfBirth
                  ? dayjs(profile.dateOfBirth).format("DD/MM/YYYY")
                  : "---"
              }
            />

            <InfoItem
              icon={<UserOutlined className="text-purple-500" />}
              label="Giới tính"
              value={
                profile?.gender === "MALE"
                  ? "Nam"
                  : profile?.gender === "FEMALE"
                    ? "Nữ"
                    : "Khác"
              }
            />
          </div>
        )}
      </Card>

    </div>
  );
}

