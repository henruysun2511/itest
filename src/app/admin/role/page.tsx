"use client";

import { Button, Input, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import RoleTable from "./role-table";
import { RoleCreateModal } from "./role-create-modal";
import { useRoleListPagination } from "@/queries/useRoleQuery";

export default function RolePage() {
  const [params, setParams] = useState({ page: 1, pageSize: 10, search: "" });
  const { data, isLoading, isError, error } = useRoleListPagination(params);
  const [openModal, setOpenModal] = useState(false);
  console.log("dataaaaaaaaaaaa:", data);
  return (
    <>
      <div className="mb-6"></div>
      <Space direction="vertical" className="w-full" size="large">
        <div className="flex justify-between">
          <Input.Search
            placeholder="Tìm kiếm roleName..."
            allowClear
            size="large"
            style={{ width: 500 }}
            onSearch={(val) =>
              setParams((p) => ({ ...p, search: val, page: 1 }))
            }
          />
          <Button
            type="primary"
            size="middle"
            icon={<PlusOutlined />}
            className="bg-primary"
            onClick={() => setOpenModal(true)}
          >
            Thêm vai trò
          </Button>
        </div>

        <RoleTable
          data={data?.data ?? []}
          loading={isLoading}
          pagination={{
            current: data?.meta?.page,
            pageSize: data?.meta?.size,
            // total: data?.meta?.totalElements,
            onChange: (page: number) => setParams((p) => ({ ...p, page })),
          }}
        />
      </Space>
      <RoleCreateModal open={openModal} onCancel={() => setOpenModal(false)} />
    </>
  );
}
