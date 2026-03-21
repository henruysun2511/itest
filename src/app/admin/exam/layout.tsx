"use client";

import { Tabs } from "antd";
import { usePathname, useRouter } from "next/navigation";

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Xác định tab active dựa trên URL hiện tại
  const activeKey = pathname.includes("/create") ? "create" : "list";

  const items = [
    { key: "list", label: "Danh sách đề thi" },
    { key: "create", label: "Tạo đề thi mới" },
  ];

  return (
    <div className="p-6">
      <Tabs
        activeKey={activeKey}
        items={items}
        type="card"
        onChange={(key) => {
          if (key === "list") router.push("/admin/exam/list");
          else router.push("/admin/exam/create");
        }}
      />
      <div className="mt-4">{children}</div>
    </div>
  );
}