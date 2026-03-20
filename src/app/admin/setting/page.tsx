"use client";
import { SecurityTab } from '@/components/common/security-tab';
import { useChangePassword } from '@/queries/useAccountQuery';
import { useLogoutDevices } from '@/queries/useAuthQuery';
import { handleError } from '@/shares/utils/error';
import { SafetyCertificateOutlined, SettingOutlined } from '@ant-design/icons';
import { message, Modal, Tabs, Typography } from 'antd';
import SystemConfigTab from './system-config-tab';


const { Title, Text } = Typography;

export default function SettingsPage() {
    const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
    const { mutate: logoutAllDevices, isPending: isLoggingOut } = useLogoutDevices();

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

    const tabItems = [
        {
            key: 'system',
            label: <span className="flex items-center gap-2"><SettingOutlined /> Cấu hình hệ thống</span>,
            children: <SystemConfigTab />
        },
        {
            key: 'security',
            label: <span className="flex items-center gap-2"><SafetyCertificateOutlined /> Bảo mật</span>,
            children: <SecurityTab onFinish={handleChangePassword} isPending={isChangingPassword}/>
        }
    ];

    return (
        <Tabs
            defaultActiveKey="system"
            items={tabItems}
            type="card"
            className="custom-tabs-style shadow-sm"
        />
    );
}