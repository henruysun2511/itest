import { LogoutOutlined } from "@ant-design/icons";
import { Image } from "antd";
import Sider from "antd/es/layout/Sider";
import AdminMenu from '../menu/menu';

export default function AdminSidebar({ collapsed }: { collapsed: boolean }) {
    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={230}
            collapsedWidth={75}
            className="h-screen bg-primary"
        >
            <div className="flex flex-col h-full">
                {/* ===== LOGO ===== */}
                <div className="flex items-center justify-center gap-3 h-20 px-2 shrink-0">
                    <Image
                        preview={false}
                        src="/logo.png"
                        width={collapsed ? 48 : 60}
                        className="transition-all duration-300"
                    />

                    {!collapsed && (
                        <div className="text-light text-xs font-semibold leading-tight text-center">
                            HỌC VIỆN<br />NGÂN HÀNG
                        </div>
                    )}
                </div>

                {/* ===== MENU (SCROLL ĐƯỢC) ===== */}
                <div className="flex-1 overflow-y-auto px-0">
                    <AdminMenu />
                </div>

                {/* ===== LOGOUT (CỐ ĐỊNH DƯỚI) ===== */}
                <div className="p-4 shrink-0">
                    <button
                        className="
          w-full h-8 cursor-pointer
          bg-red-500 text-white
          rounded-lg
          flex items-center justify-center gap-2
          font-medium
          hover:bg-red-200 hover:text-red-600
          transition
        "
                    >
                        <LogoutOutlined />
                        {!collapsed && 'Đăng xuất'}
                    </button>
                </div>
            </div>
        </Sider>
    )
}