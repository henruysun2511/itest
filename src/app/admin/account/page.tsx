"use client";
import { useAccountList } from "@/queries/useAccountQuery";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { useState } from "react";
import { AccountCreateModal } from "./account-create-modal";
import AccountTable from "./account-table";

export default function AccountManagementPage() {
    const [openModal, setOpenModal] = useState(false);
    const [params, setParams] = useState({ page: 1, size: 10, search: "" });

    const { data, isLoading } = useAccountList(params);

    return (
        <>
            <div className="mb-6"></div>
            <Space direction="vertical" className="w-full" size="large">
                <div className="flex justify-between">
                    <Input.Search
                        placeholder="Tìm kiếm username hoặc email..."
                        allowClear
                        size="large"
                        style={{ width: 500 }}
                        onSearch={(val) => setParams(p => ({ ...p, search: val, page: 1 }))}
                    />
                    <Button 
                        type="primary" 
                        size="middle" 
                        icon={<PlusOutlined />} 
                        className="bg-primary"
                        onClick={() => setOpenModal(true)}
                    >
                        Thêm tài khoản
                    </Button>
                </div>

                <AccountTable 
                    data={data?.data ?? []} 
                    loading={isLoading}
                    pagination={{
                        current: data?.meta?.page,
                        pageSize: data?.meta?.size,
                        total: data?.meta?.totalElements,
                        onChange: (page: number) => setParams(p => ({ ...p, page }))
                    }}
                />
            </Space>

            <AccountCreateModal open={openModal} onCancel={() => setOpenModal(false)} />
        </>
    );
}