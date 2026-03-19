"use client";

import { InfoItem } from "@/components/common/info-item";
import { useUploadFileCloudinary } from "@/queries/useCloudinaryQuery";
import { useGetProfile, useUpdateProfile } from "@/queries/useProfileQuery";
import { handleError } from "@/shares/utils/error";
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
} from '@ant-design/icons';
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
} from 'antd';
import dayjs from "dayjs";
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function TeacherProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    const { data: profileRes, isLoading: isFetching } = useGetProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
    const { mutateAsync: uploadCloudinary, isPending: isUploading } = useUploadFileCloudinary();

    const profile = profileRes?.data;

    useEffect(() => {
        if (profile) {
            form.setFieldsValue({
                ...profile,
                dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
            });
        }
    }, [profile, isEditing, form]);

    const handleUploadAvatar = async (file: File) => {
        try {
            const res = await uploadCloudinary(file);
            const imageUrl = res.data?.data?.url;
            if (imageUrl) {
                updateProfile({ avatar: imageUrl }, {
                    onSuccess: () => message.success("Cập nhật ảnh đại diện thành công"),
                });
            }
        } catch (error) {
            message.error("Upload ảnh thất bại");
        }
        return false;
    };

    const onFinish = (values: any) => {
        const payload = { ...values, dateOfBirth: values.dateOfBirth?.toISOString() };
        updateProfile(payload, {
            onSuccess: () => {
                message.success("Cập nhật thành công");
                setIsEditing(false);
            },
            onError: (err) => handleError(err, message)
        });
    };

    if (isFetching) return (
        <div className="flex h-screen items-center justify-center bg-[#F0F2F5]">
            <LoadingOutlined className="text-3xl text-[var(--color-primary)]" spin />
        </div>
    );

    return (
        <>
            <div className="relative">
                <div className="h-56 bg-gradient-to-r from-[var(--color-navy-deep)] to-[var(--color-navy-main)]" />

                <div className="max-w-5xl mx-auto px-6">
                    <div className="relative -mt-32 flex flex-col md:flex-row items-end gap-6 pb-6 border-b">
                        <div className="relative inline-block">
                            <Avatar
                                size={160}
                                src={profile?.avatar}
                                className="border-4 border-white shadow-xl bg-slate-200"
                            >
                                {!profile?.avatar && profile?.fullName?.charAt(0).toUpperCase()}
                            </Avatar>
                            {isEditing && (
                                <Upload showUploadList={false} beforeUpload={handleUploadAvatar}>
                                    <Button
                                        type="primary" shape="circle" icon={isUploading ? <LoadingOutlined /> : <CameraOutlined />}
                                        className="absolute bottom-2 right-2 bg-[var(--color-accent)] border-2 border-white"
                                    />
                                </Upload>
                            )}
                        </div>

                        <div className="flex-1 mb-2 text-center md:text-left">
                            <Title level={2} className="!text-white !mb-1 drop-shadow-sm">{profile?.fullName}</Title>
                            <Text className="text-blue-400  font-bold opacity-80"><SafetyCertificateOutlined /> Giảng viên hệ thống</Text>
                        </div>

                        <div className="mb-2">
                            {!isEditing ? (
                                <Button
                                    icon={<EditOutlined />} onClick={() => setIsEditing(true)}
                                    className="rounded-full h-10 px-6 font-semibold bg-white border-none shadow-md hover:text-[var(--color-accent)]"
                                >
                                    Chỉnh sửa hồ sơ
                                </Button>
                            ) : (
                                <Button
                                    icon={<CloseOutlined />} onClick={() => setIsEditing(false)}
                                    danger className="rounded-full h-10 px-6 shadow-md"
                                >
                                    Hủy
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Phần Form / Info Card */}
                    <div className="py-10">
                        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                            {isEditing ? (
                                <Form form={form} layout="vertical" onFinish={onFinish} className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                                        <Form.Item name="fullName" label={<Text strong>Họ và tên</Text>} rules={[{ required: true }]}>
                                            <Input size="large" className="rounded-lg" />
                                        </Form.Item>
                                        <Form.Item name="phoneNumber" label={<Text strong>Số điện thoại</Text>}>
                                            <Input size="large" className="rounded-lg" />
                                        </Form.Item>
                                        <Form.Item name="dateOfBirth" label={<Text strong>Ngày sinh</Text>}>
                                            <DatePicker size="large" className="w-full rounded-lg" format="DD/MM/YYYY" />
                                        </Form.Item>
                                        <Form.Item name="gender" label={<Text strong>Giới tính</Text>}>
                                            <Select size="large" className="rounded-lg" options={[
                                                { value: "MALE", label: "Nam" },
                                                { value: "FEMALE", label: "Nữ" },
                                            ]} />
                                        </Form.Item>
                                    </div>
                                    <div className="flex justify-end mt-8 border-t pt-6">
                                        <Button
                                            type="primary" htmlType="submit" size="large" loading={isUpdating} icon={<SaveOutlined />}
                                            className="bg-[var(--color-navy-main)] px-10 rounded-lg h-12 font-bold"
                                        >
                                            Lưu thay đổi
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                                    <InfoItem icon={<UserOutlined className="text-blue-500" />} label="Họ và tên" value={profile?.fullName} />
                                    <InfoItem icon={<PhoneOutlined className="text-green-500" />} label="Số điện thoại" value={profile?.phoneNumber} />
                                    <InfoItem icon={<CalendarOutlined className="text-orange-500" />} label="Ngày sinh" value={profile?.dateOfBirth ? dayjs(profile?.dateOfBirth).format("DD/MM/YYYY") : "---"} />
                                    <InfoItem icon={<UserOutlined className="text-purple-500" />} label="Giới tính" value={profile?.gender === "MALE" ? "Nam" : "Nữ"} />
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

