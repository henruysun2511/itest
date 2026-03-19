"use client";
import { useLogout } from '@/queries/useAuthQuery';
import { useGetProfile } from '@/queries/useProfileQuery';
import { RoleType } from '@/shares/constants/type.enum';
import { getRoleBadge } from '@/shares/utils/mappingLabel';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, message } from 'antd';
import { useRouter } from 'next/navigation';

interface UserDropdownProps {
    role: RoleType;
}


export default function UserDropdown({ role }: UserDropdownProps) {
    const router = useRouter();

    // 1. Hook lấy profile
    const { data: profile } = useGetProfile();
    const user = profile?.data;

    // 2. Hook xử lý logout
    const { mutate: handleLogout, isPending } = useLogout();

    const roleInfo = getRoleBadge(role || '');

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'profile') {
            const path = role === 'STUDENT' ? '/student/profile' : '/teacher/profile';
            router.push(path);
        }

        if (key === 'logout') {
            handleLogout(undefined, {
                onSuccess: () => {
                    message.success("Đã đăng xuất");
                },
            });
        }
    };

    const userMenuItems = [
        {
            key: 'profile',
            label: 'Thông tin cá nhân',
            icon: <UserOutlined />
        },
        {
            key: 'logout',
            label: isPending ? 'Đang đăng xuất...' : 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            disabled: isPending // Vô hiệu hóa khi đang xử lý
        },
    ];

    return (
        <Dropdown
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            arrow
            disabled={isPending} // Khóa dropdown khi đang logout
        >
            <div className={`flex items-center gap-3 cursor-pointer group px-2 py-1 rounded-lg hover:bg-white/5 transition-all ${isPending ? 'opacity-50' : ''}`}>
                <div className="flex flex-col items-end justify-center text-right">
                    <div className="text-white font-bold leading-tight text-sm group-hover:text-[var(--color-accent)] transition-colors">
                        {user?.fullName || 'Đang tải...'}
                    </div>
                    <span className="text-blue-300 text-[10px] uppercase font-bold tracking-wider leading-none mt-1">
                        {roleInfo.label}
                    </span>
                </div>
                <Avatar
                    size={42}
                    src={user?.avatar}
                    icon={<UserOutlined />}
                    className="bg-white/10 border border-white/20 group-hover:border-[var(--color-accent)] transition-all flex-shrink-0"
                />
            </div>
        </Dropdown>
    );
}