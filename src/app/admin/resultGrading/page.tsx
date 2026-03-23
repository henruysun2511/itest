"use client";

import { useResultGradingListByTeacher } from "@/queries/useResultGradingQuery";
import { ResultGrading } from "@/shares/types/object";
import { ResultGradingParam } from "@/shares/types/param";
import { Space, Typography } from "antd";
import { useState } from "react";
import ResultGradingAssignModal from "./resultGrading-assign-modal";
import ResultGradingFilter from "./resultGrading-filter";
import ResultGradingTable from "./resultGrading-table";
import ResultGradingReassignModal from "./resultGrading-reassign-modal";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

export default function ResultGradingPage() {
    const [params, setParams] = useState<ResultGradingParam>({
        page: 1,
        limit: 10,
        search: "",
        examSessionCode: "",
        status: undefined,
        sortOrder: undefined
    });

    const [selectedRecord, setSelectedRecord] = useState<ResultGrading | null>(null);

    const { data: res, isLoading } = useResultGradingListByTeacher(params);
    
    const data = res?.data ?? [];
    const meta = res?.meta;

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const handleSearch = (val: string) => {
        setParams(p => ({ ...p, search: val, page: 1 }));
    };

    const handleFilterChange = (key: keyof ResultGradingParam, value: any) => {
        setParams(p => ({ ...p, [key]: value, page: 1 }));
    };

    return (
        <div className="">
            <Space orientation="vertical" className="w-full bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-100" size="large">
                <div className="flex justify-between items-start">
                    <ResultGradingFilter
                        params={params}
                        onSearch={handleSearch}
                        onFilterChange={handleFilterChange}
                    />
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => setCreateModalOpen(true)}
                        size="large"
                    >
                        Phân công chấm thi
                    </Button>
                </div>

                <ResultGradingTable
                    data={data}
                    loading={isLoading}
                    onReassign={(record) => setSelectedRecord(record)}
                    pagination={{
                        current: params.page,
                        pageSize: params.limit,
                        total: meta?.total || 0,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                        showTotal: (total: number) => `Tổng cộng ${total} mục`,
                        onChange: (page: number, pageSize: number) =>
                            setParams((p) => ({ ...p, page, limit: pageSize })),
                    }}
                />
            </Space>
            
            <ResultGradingReassignModal 
                open={!!selectedRecord} 
                onClose={() => setSelectedRecord(null)} 
                data={selectedRecord} 
            />

            <ResultGradingAssignModal 
                open={createModalOpen} 
                onClose={() => setCreateModalOpen(false)} 
            />
        </div>
    );
}
