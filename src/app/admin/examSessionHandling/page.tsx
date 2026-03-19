"use client";

import { useExamSessionHandlingList } from "@/queries/useExamSessionHandlingQuery";
import { ExamSessionHandling } from "@/shares/types/object";
import { ExamSessionHandlingParam } from "@/shares/types/param";
import { Space } from "antd";
import { useState } from "react";
import { ExamHandlingFilter } from "./examSesionHandling-filter";
import ExamHandlingDetailModal from "./examSessionHandling-detail-modal";
import ExamHandlingTable from "./examSessionHandling-table";


export default function ExamHandlingPage() {
    const [params, setParams] = useState<ExamSessionHandlingParam>({
        page: 1,
        limit: 10,
        studentCode: "",
        examSessionId: undefined
    });
    const [selectedRecord, setSelectedRecord] = useState<ExamSessionHandling | null>(null);


    const { data, isLoading } = useExamSessionHandlingList(params);
    
    const handleSearch = (val: string) => {
        setParams(p => ({ ...p, studentCode: val, page: 1 }));
    };

    const handleFilterChange = (key: keyof ExamSessionHandlingParam, value: any) => {
        setParams(p => ({ ...p, [key]: value, page: 1 }));
    };

    return (
        <>
            <div className="mb-6"></div>
            <Space direction="vertical" className="w-full" size="large">
                <div className="flex justify-between">
                    <ExamHandlingFilter
                        params={params}
                        onSearch={handleSearch}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                <ExamHandlingTable
                    data={data?.data ?? []}
                    loading={isLoading}
                    onViewDetail={(record) => setSelectedRecord(record)}
                    pagination={{
                        current: params.page,
                        pageSize: params.limit,
                        total: data?.meta?.total,
                        onChange: (page: number, pageSize: number) =>
                            setParams((p) => ({ ...p, page, limit: pageSize })),
                    }}
                />
            </Space>
            <ExamHandlingDetailModal 
                open={!!selectedRecord} 
                onClose={() => setSelectedRecord(null)} 
                data={selectedRecord} 
            />
        </>
    );
}
