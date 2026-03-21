"use client";

import { useRegistrationList, useUpdateAccessState } from "@/queries/useExamRegistrationQuery";
import { ExamRegistrationParam } from "@/shares/types/param";
import { ArrowLeftOutlined, FileExcelOutlined, LockOutlined, UnlockOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Card, message, Space, Spin, Switch, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { RegistrationBulkModal } from "./examRegistration-bulk-modal";
import { RegistrationFilter } from "./examRegistration-filter";
import { RegistrationSingleModal } from "./examRegistration-single-modal";
import RegistrationTable from "./examRegistration-table";

const { Text } = Typography;


function RegistrationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("examSessionId") || "";
  const sessionCode = searchParams.get("code") || "";
  const room = searchParams.get("room") || "";

  const [openBulk, setOpenBulk] = useState(false);
  const [openSingle, setOpenSingle] = useState(false);
  const [params, setParams] = useState<ExamRegistrationParam>({
    page: 1,
    limit: 10
  });

  // Hooks dữ liệu
  const { data, isLoading } = useRegistrationList(sessionId, params);
  console.log(data);
  const { mutate: updateBulkAccess, isPending: isUpdatingBulk } = useUpdateAccessState(sessionId);

  // Tính toán trạng thái Switch tổng dựa trên dữ liệu hiện tại
  const isAllGranted = useMemo(() => {
    if (!data?.data || data.data.length === 0) return false;
    return data.data.every((item: any) => item.isAccessGranted);
  }, [data]);

  // Hàm xử lý cấp/khóa quyền toàn ca thi
  const handleToggleAll = (checked: boolean) => {
    updateBulkAccess(
      {
        examSessionId: sessionId,
        data: { isAccessGranted: checked }
      },
      {
        onSuccess: () => message.success(`Đã ${checked ? "mở" : "khóa"} quyền truy cập toàn ca thi`),
        onError: () => message.error("Thao tác thất bại")
      }
    );
  };

  return (
    <Space direction="vertical" className="w-full" size="large">

      <Card size="small" className="border-l-4 border-l-blue-600 shadow-sm">
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-4">
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} />

            <div className="flex flex-col">
              <Text type="secondary" className="text-xs uppercase font-medium">
                Đang quản lý thí sinh
              </Text>

              <Text strong className="text-lg text-blue-700">
                Ca thi: {sessionCode} {room ? `- Phòng: ${room}` : ""}
              </Text>
            </div>
          </div>

          <Space size="middle">
            {/* Bộ điều khiển quyền truy cập toàn ca */}
            <div className="flex flex-col items-end mr-4 pr-4 border-r border-gray-200">
              <Text style={{ fontSize: '10px' }} strong className="text-gray-400 uppercase">
                Quyền truy cập ca thi
              </Text>
              <Space size="small">
                <Text type={isAllGranted ? "success" : "danger"} className="text-xs font-bold">
                  {isAllGranted ? "MỞ" : "KHÓA"}
                </Text>
                <Switch
                  size="small"
                  checkedChildren={<UnlockOutlined />}
                  unCheckedChildren={<LockOutlined />}
                  checked={isAllGranted}
                  loading={isUpdatingBulk}
                  onChange={handleToggleAll}
                />
              </Space>
            </div>

            <Button
              icon={<UserAddOutlined />}
              onClick={() => setOpenSingle(true)}
            >
              Thêm học sinh
            </Button>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={() => setOpenBulk(true)}
            >
              Đăng ký từ Excel
            </Button>
          </Space>

        </div>
      </Card>

      <RegistrationFilter
        params={params}
        onSearch={(val) =>
          setParams((p) => ({ ...p, search: val, page: 1 }))
        }
        onFilterChange={(k, v) =>
          setParams((p) => ({ ...p, [k]: v, page: 1 }))
        }
      />

      <RegistrationSingleModal
        open={openSingle}
        onCancel={() => setOpenSingle(false)}
        sessionId={sessionId}
      />

      <RegistrationTable
        data={data?.data ?? []}
        loading={isLoading}
        sessionId={sessionId}
        pagination={{
          current: params.page,
          pageSize: params.limit,
          total: data?.meta?.total,
          onChange: (page: number, pageSize: number) =>
            setParams((p) => ({ ...p, page, limit: pageSize })),
        }}
      />

      <RegistrationBulkModal
        open={openBulk}
        onCancel={() => setOpenBulk(false)}
        sessionId={sessionId}
        sessionInfo={{ code: sessionCode, room: room }}
      />

    </Space>
  );
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    }>
      <RegistrationContent />
    </Suspense>
  );
}