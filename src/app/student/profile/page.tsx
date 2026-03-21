"use client";
import { useChangePassword } from "@/queries/useAccountQuery";
import { useLogoutDevices } from "@/queries/useAuthQuery";
import { useUploadAvatarCloudinary } from "@/queries/useCloudinaryQuery";
import { useGetProfile, useUpdateProfile } from "@/queries/useProfileQuery";
import { handleError } from "@/shares/utils/error";
import { getRoleBadge } from "@/shares/utils/mappingLabel";
import { useAuthStore } from "@/stores/useAuthStore";
import { CameraOutlined, HistoryOutlined, LoadingOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Modal, Tabs, Typography, Upload, message } from 'antd';
import { useState } from 'react';
import { PersonalInfoTab } from '../../../components/common/personal-info-tab';
import { SecurityTab } from '../../../components/common/security-tab';
import { ExamResultTab } from './exam-result-tab';

const { Title } = Typography;

export default function StudentProfilePage() {
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

    const handleUpdateProfile = (values: any) => {
        const payload = { ...values, dateOfBirth: values.dateOfBirth?.toISOString() };
        updateProfile(payload, {
            onSuccess: () => {
                message.success("Cập nhật thành công");
                setIsEditing(false);
            },
            onError: (err) => handleError(err, message)
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
            onError: (err) => handleError(err, message)
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
            children: <PersonalInfoTab profile={profile} isEditing={isEditing} setIsEditing={setIsEditing} onUpdate={handleUpdateProfile} isUpdating={isUpdating} />
        },
        {
            key: '2',
            label: <span><HistoryOutlined /> Kết quả thi</span>,
            children: <ExamResultTab />
        },
        {
            key: '3',
            label: <span><SafetyCertificateOutlined /> Bảo mật</span>,
            children: <SecurityTab onFinish={handleChangePassword} isPending={isChangingPassword} />
        }
    ];

    return (
        <div className="min-h-screen bg-[#F0F2F5]">
            <div className="h-64 bg-[var(--color-navy-deep)]  relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            </div>

            <div className="max-w-5xl mx-auto px-6 relative -mt-45 pb-20">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 px-4">
                    <div className="relative group">
                        <Avatar
                            size={160}
                            src={profile?.avatar}
                            className={`border-4 border-white shadow-2xl bg-white transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`}
                        >
                            {/* Hiển thị chữ cái đầu nếu không có avatar và không đang loading */}
                            {!profile?.avatar && !isUploading && profile?.fullName?.charAt(0).toUpperCase()}
                        </Avatar>

                        {/* Lớp phủ Loading / Camera */}
                        <Upload showUploadList={false} beforeUpload={handleUploadAvatar} disabled={isUploading}>
                            <div className={`absolute inset-0 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer
            ${isUploading
                                    ? 'bg-black/20 opacity-100' // Luôn hiện khi đang upload
                                    : 'bg-black/40 opacity-0 group-hover:opacity-100' // Chỉ hiện khi hover lúc bình thường
                                }`}
                            >
                                {isUploading ? (
                                    <>
                                        <LoadingOutlined className="text-white text-3xl mb-2" />
                                        <span className="text-white text-[10px] font-bold uppercase tracking-wider">Đang tải...</span>
                                    </>
                                ) : (
                                    <>
                                        <CameraOutlined className="text-white text-3xl" />
                                        <span className="text-white text-[10px] font-bold uppercase tracking-wider mt-1">Đổi ảnh</span>
                                    </>
                                )}
                            </div>
                        </Upload>
                    </div>

                    <div className="flex-1 text-center md:text-left pb-2">
                        <Title level={1} className="!text-white !text-4xl !mb-4 drop-shadow-md">{profile?.fullName}</Title>
                        <span className="bg-[var(--color-accent)] text-[var(--color-navy-deep)] px-3 py-1 rounded-full text-xs font-black uppercase">
                            {roleInfo.label || "Sinh viên"}
                        </span>
                    </div>
                    <span className="text-white/60 text-[11px] italic bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                        ⚠️ Ảnh chân dung: Không kính, mũ, khẩu trang
                    </span>
                </div>

                <Tabs defaultActiveKey="2" items={tabItems} className="profile-tabs custom-tabs-style" type="card" />
            </div>
        </div>
    );
}