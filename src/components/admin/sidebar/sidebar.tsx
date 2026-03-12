import { LogoutOutlined } from "@ant-design/icons";
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
            className="bg-primary"
        >
            <div className="flex flex-col h-full">
                {/* ===== LOGO ===== */}
                <div className="flex items-center justify-center gap-3 h-20 px-2 shrink-0">
                    {/* <Image
                        preview={false}
                        src="/logo.png"
                        width={collapsed ? 48 : 60}
                        className="transition-all duration-300"
                    /> */}
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-[var(--color-accent)] rounded-lg flex items-center justify-center font-black text-[var(--color-navy-deep)] shadow-lg shadow-orange-500/20">i</div>

                        {!collapsed && (
                            <span className="text-white font-bold text-xl tracking-tighter">iTEST ADMIN</span>
                        )}
                    </div>

                </div>

                <div className="flex-1 overflow-y-auto px-0">
                    <AdminMenu />
                </div>

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