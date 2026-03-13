"use client";
import { ExamSessionSortBy, SortOrder } from "@/constants/sort.enum";
import { useExamSessionList } from "@/queries/useExamSessionQuery";
import { ExamSessionParam } from "@/types/param";
import { FileExcelOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { ExamSessionBulkModal } from "./examSession-bulk-modal";
import { ExamSessionCreateModal } from "./examSession-create-modal";
import { ExamSessionFilter } from "./examSession-filter";
import ExamSessionTable from "./examSession-table";


export default function ExamSessionPage() {
    const [openModal, setOpenModal] = useState(false);
    const [openBulk, setOpenBulk] = useState(false);
    const [params, setParams] = useState<ExamSessionParam>({
        page: 1,
        limit: 10,
        sortBy: ExamSessionSortBy.DATE,
        sortOrder: SortOrder.DESC
    });

    const { data, isLoading } = useExamSessionList(params);
    console.log(data)

    const handleFilterChange = (key: keyof ExamSessionParam, value: any) => {
        setParams(p => ({ ...p, [key]: value, page: 1 }));
    };

    return (
        <div className="p-4">
            <div className="flex items-start mb-5 gap-10">
                <ExamSessionFilter
                    params={params}
                    onSearch={(val) => handleFilterChange("examSessionCode", val)}
                    onFilterChange={handleFilterChange}
                />
                <div className="flex gap-5">
                    <Button
                        type="primary"
                        icon={<FileExcelOutlined />}
                        onClick={() => setOpenBulk(true)}
                        className="bg-primary"
                    >
                        Nhập Excel
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="bg-primary"
                        onClick={() => setOpenModal(true)}
                    >
                        Tạo ca thi mới
                    </Button>
                </div>

            </div>



            <ExamSessionTable
                data={data?.data ?? []}
                loading={isLoading}
                pagination={{
                    current: params.page,
                    pageSize: params.limit,
                    total: data?.meta?.total,
                    onChange: (page: number, limit: number) => setParams(p => ({ ...p, page, limit }))
                }}
            />


            <ExamSessionCreateModal open={openModal} onCancel={() => setOpenModal(false)} />
            <ExamSessionBulkModal open={openBulk} onCancel={() => setOpenBulk(false)} />
        </div>
    );
}