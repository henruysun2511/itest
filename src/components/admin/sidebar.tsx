import { useToast } from "@/hooks/useToast"; // Giả định bạn có hook toast
import { useLogout } from "@/queries/useAuthQuery";
import { handleError } from "@/shares/utils/error";
import { LogoutOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import Sider from "antd/es/layout/Sider";
import AdminMenu from './menu';

export default function AdminSidebar({ collapsed }: { collapsed: boolean }) {
    const toast = useToast();
    const { mutate: logoutMutation, isPending } = useLogout();

    const handleLogout = () => {
        Modal.confirm({
            title: 'Xác nhận đăng ký đăng xuất toàn cục',
            icon: <LogoutOutlined className="text-red-500" />,
            content: 'Hệ thống sẽ đăng xuất tài khoản của bạn khỏi tất cả các thiết bị hiện đang đăng nhập. Bạn có chắc chắn muốn tiếp tục?',
            okText: 'Đăng xuất tất cả',
            cancelText: 'Hủy bỏ',
            okButtonProps: { 
                danger: true, 
                loading: isPending 
            },
            onOk: () => {
                return new Promise((resolve, reject) => {
                    logoutMutation(undefined, {
                        onSuccess: () => {
                            toast.success("Đã đăng xuất khỏi tất cả các thiết bị");
                            resolve(true);
                        },
                        onError: (err: any) => {
                            handleError(err, toast);
                            reject();
                        }
                    });
                });
            },
        });
    };

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
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-[var(--color-accent)] rounded-lg flex items-center justify-center font-black text-[var(--color-navy-deep)] shadow-lg shadow-orange-500/20">i</div>
                        {!collapsed && (
                            <span className="text-white font-bold text-xl tracking-tighter">iTEST ADMIN</span>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <AdminMenu />
                </div>

                <div className="p-4 shrink-0">
                    <button
                        onClick={handleLogout}
                        disabled={isPending}
                        className="
                            w-full h-9 cursor-pointer
                            bg-red-500 text-white
                            rounded-lg
                            flex items-center justify-center gap-2
                            font-medium
                            hover:bg-red-600
                            transition-all
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        <LogoutOutlined />
                        {!collapsed && 'Đăng xuất'}
                    </button>
                </div>
            </div>
        </Sider>
    );
}