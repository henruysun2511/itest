"use client";
import { BaseSortBy, SortOrder } from "@/constants/sort.enum";
import { useAccountList } from "@/queries/useAccountQuery";
import { AccountParam } from "@/types/param";
import { FileExcelOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useState } from "react";
import { AccountBulkModal } from "./account-bulk-modal";
import { AccountCreateModal } from "./account-create-modal";
import { AccountFilter } from "./account-filter";
import AccountTable from "./account-table";

export default function AccountPage() {
    const [openModal, setOpenModal] = useState(false);
    const [openBulkModal, setOpenBulkModal] = useState(false);
    const [params, setParams] = useState<AccountParam>({
        page: 1,
        limit: 10,
        search: "",
        sortBy: BaseSortBy.CREATED_AT,
        sortOrder: SortOrder.DESC
    });

    const { data, isLoading } = useAccountList(params);
    console.log(data);

    const handleSearch = (val: string) => {
        setParams(p => ({ ...p, search: val, page: 1 }));
    };

    const handleFilterChange = (key: keyof AccountParam, value: any) => {
        setParams(p => ({ ...p, [key]: value, page: 1 }));
    };

    return (
        <>
            <div className="mb-6"></div>
            <Space direction="vertical" className="w-full" size="large">
                <div className="flex justify-between">
                    <AccountFilter
                        params={params}
                        onSearch={handleSearch}
                        onFilterChange={handleFilterChange}
                    />
                    <div className="flex gap-5">
                        <Button
                            type="primary"
                            size="middle"
                            className="bg-primary"
                            icon={<FileExcelOutlined />}
                            onClick={() => setOpenBulkModal(true)}
                        >
                            Thêm hàng loạt từ Excel
                        </Button>
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

                </div>

                <AccountTable
                    data={data?.data ?? []}
                    loading={isLoading}
                    pagination={{
                        current: params.page,
                        pageSize: params.limit,
                        total: data?.meta?.total,
                        onChange: (page: number, pageSize: number) =>
                            setParams((p) => ({ ...p, page, limit: pageSize })),
                    }}
                />

                <AccountBulkModal
                    open={openBulkModal}
                    onCancel={() => setOpenBulkModal(false)}
                />
            </Space>

            <AccountCreateModal open={openModal} onCancel={() => setOpenModal(false)} />
        </>
    );
}