"use client";
import { PersonalInfoTab } from "@/components/common/personal-info-tab";
import { SecurityTab } from "@/components/common/security-tab";
import { useToast } from "@/hooks/useToast";
import { useChangePassword } from "@/queries/useAccountQuery";
import { useLogoutDevices } from "@/queries/useAuthQuery";
import { useUploadAvatarCloudinary } from "@/queries/useCloudinaryQuery";
import { useGetProfile, useUpdateProfile } from "@/queries/useProfileQuery";
import { handleError } from "@/shares/utils/error";
import { getRoleBadge } from "@/shares/utils/mappingLabel";
import { useAuthStore } from "@/stores/useAuthStore";
import { CameraOutlined, LoadingOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Modal, Tabs, Typography, Upload, message } from 'antd';
import { useState } from 'react';


const { Title, Text } = Typography;

export default function TeacherProfilePage() {
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const roleName = useAuthStore((state) => state.user?.roleName);
    const roleInfo = getRoleBadge(roleName || '');


    const { data: profileRes, isLoading: isFetching } = useGetProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
    const { mutateAsync: uploadCloudinary, isPending: isUploading } = useUploadAvatarCloudinary();
    const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
    const { mutate: logoutAllDevices, isPending: isLoggingOut } = useLogoutDevices();

    const profile = profileRes?.data;

    const handleUploadAvatar = async (file: File) => {
        try {
            const res = await uploadCloudinary(file);
            const uploadData = res.data?.data || res.data;

            const imageUrl = uploadData?.url;
            const publicId = uploadData?.public_id || "";

            if (imageUrl) {
                const payload = {
                    fullName: profile?.fullName,
                    dateOfBirth: profile?.dateOfBirth,
                    gender: profile?.gender,
                    avatar: imageUrl,
                    publicId: publicId
                };

                updateProfile(payload, {
                    onSuccess: () => toast.success("Cập nhật ảnh đại diện thành công"),
                    onError: (error: any) => handleError(error, toast)
                });
            }
        } catch (error) {
            message.error("Upload ảnh thất bại");
        }
        return false;
    };

    const handleUpdateProfile = (values: any) => {
        const payload = {
            fullName: values.fullName,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.startOf('day').toISOString() : profile?.dateOfBirth,
            gender: values.gender,
            avatar: profile?.avatar || "",
        };

        updateProfile(payload, {
            onSuccess: () => {
                toast.success("Cập nhật thành công");
                setIsEditing(false);
            },
            onError: (err) => handleError(err, toast)
        });
    };

    const handleChangePassword = (values: any) => {
        changePassword(values, {
            onSuccess: () => {
                Modal.confirm({
                    title: 'Đổi mật khẩu thành công!',
                    content: 'Bạn có muốn đăng xuất khỏi tất cả các thiết bị khác để bảo mật tài khoản không?',
                    okText: 'Đăng xuất tất cả',
                    cancelText: 'Bỏ qua',
                    okButtonProps: { danger: true, loading: isLoggingOut },
                    onOk: () => logoutAllDevices()
                });
            },
            onError: (err) => handleError(err, toast)
        });
    };

    if (isFetching) return (
        <div className="flex h-screen items-center justify-center bg-[#F0F2F5]">
            <LoadingOutlined className="text-3xl text-[var(--color-primary)]" spin />
        </div>
    );

    const tabItems = [
        {
            key: '1',
            label: <span><UserOutlined /> Thông tin cá nhân</span>,
            children: (
                <PersonalInfoTab
                    profile={profile}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    onUpdate={handleUpdateProfile}
                    isUpdating={isUpdating}
                />
            )
        },
        {
            key: '2',
            label: <span><SafetyCertificateOutlined /> Bảo mật</span>,
            children: (
                <SecurityTab
                    onFinish={handleChangePassword}
                    isPending={isChangingPassword}
                />
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[#F0F2F5]">
            <div className="h-64 bg-[var(--color-navy-deep)] relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            </div>

            <div className="max-w-5xl mx-auto px-6 relative -mt-45 pb-20">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 px-4">
                    <div className="relative group">
                        <Avatar size={160} src={profile?.avatar || undefined} className="...">
                            {(!profile?.avatar || profile?.avatar === "") && profile?.fullName?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Upload showUploadList={false} beforeUpload={handleUploadAvatar}>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                {isUploading ? <LoadingOutlined className="text-white text-2xl" /> : <CameraOutlined className="text-white text-2xl" />}
                            </div>
                        </Upload>
                    </div>

                    <div className="flex-1 text-center md:text-left pb-2">
                        <Title level={1} className="!text-white !text-4xl !mb-4 drop-shadow-md">{profile?.fullName}</Title>
                        <span className="bg-[var(--color-accent)] text-[var(--color-navy-deep)] px-3 py-1 rounded-full text-xs font-black uppercase">
                            {roleInfo.label || "Giảng viên"}
                        </span>
                    </div>

                </div>

                <Tabs defaultActiveKey="1" items={tabItems} className="profile-tabs custom-tabs-style" type="card" />
            </div>
        </div >
    );
}