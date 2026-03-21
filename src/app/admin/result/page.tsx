"use client";

import { useResultList } from "@/queries/useResultQuery";
import { ResultParam } from "../../../shares/types/param";
import { Space } from "antd";
import { useState } from "react";
import { ResultDetailModal } from "./result-detail-modal";
import { ResultFilter } from "./result-filter";
import ResultTable from "./result-table";

import { Result } from "../../../shares/types/object";

export default function ResultPage() {
    const [params, setParams] = useState<ResultParam>({
        page: 1,
        limit: 10,
        studentCode: "",
        examSessionId: undefined,
        minTotalScore: undefined,
        maxTotalScore: undefined
    });

    const [selectedResultId, setSelectedResultId] = useState<string>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading } = useResultList(params);
    console.log(data)

    const handleSearch = (val: string) => {
        setParams(p => ({ ...p, studentCode: val, page: 1 }));
    };

    // Sửa lỗi TS bằng Generic K
    const handleFilterChange = <K extends keyof ResultParam>(key: K, value: ResultParam[K]) => {
        setParams(p => ({ ...p, [key]: value, page: 1 }));
    };

    const handleOpenDetail = (id: string) => {
        setSelectedResultId(id);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="mb-6"></div>
            <Space direction="vertical" className="w-full" size="large">
                <div className="flex justify-between items-center">
                    <ResultFilter
                        params={params}
                        onSearch={handleSearch}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                <ResultTable
                    data={data?.data ?? []}
                    loading={isLoading}
                    onViewDetail={handleOpenDetail}
                    pagination={{
                        current: params.page,
                        pageSize: params.limit,
                        total: data?.meta?.total,
                        showSizeChanger: true,
                        onChange: (page: number, pageSize: number) =>
                            setParams((p) => ({ ...p, page, limit: pageSize })),
                    }}
                />
            </Space>

            <ResultDetailModal
                open={isModalOpen}
                resultId={selectedResultId}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedResultId(undefined);
                }}
            />
        </>
    );
}