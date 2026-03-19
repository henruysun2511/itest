"use client";
import { useGetProfile } from '@/queries/useProfileQuery';
import { RoleType } from '@/shares/constants/type.enum';
import { getRoleBadge } from '@/shares/utils/mappingLabel';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown } from 'antd';
import { useRouter } from 'next/navigation';

interface UserDropdownProps {
    role: RoleType;
}



export default function UserDropdown({ role }: UserDropdownProps) {
    const router = useRouter();

    const { data: profile } = useGetProfile();
    const user = profile?.data;
    const roleInfo = getRoleBadge(role || '');


    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'profile') {
            const path = role === 'STUDENT' ? '/student/profile' : '/teacher/profile';
            router.push(path);
        }
        if (key === 'logout') {
            // Thêm logic xóa token/cookie ở đây
            router.push('/login');
        }
    };

    const userMenuItems = [
        { key: 'profile', label: 'Thông tin cá nhân', icon: <UserOutlined /> },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
    ];

    return (
        <Dropdown
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            arrow
        >
            <div className="flex items-center gap-3 cursor-pointer group px-2 py-1 rounded-lg hover:bg-white/5 transition-all">
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
                    src={user?.avatar} // Hiển thị ảnh đại diện nếu có
                    icon={<UserOutlined />}
                    className="bg-white/10 border border-white/20 group-hover:border-[var(--color-accent)] transition-all flex-shrink-0"
                />
            </div>
        </Dropdown>
    );
}