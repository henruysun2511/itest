"use client";
import { useResultList } from "@/queries/useResultQuery";
import { ResultParam } from "@/types/param";
import { Space } from "antd";
import { useState } from "react";
import { ResultFilter } from "./result-filter";
import ResultTable from "./result-table";

export default function ResultPage() {
    const [params, setParams] = useState<ResultParam>({
        page: 1,
        limit: 10,
        studentCode: "",
        examSessionId: undefined,
        minTotalScore: undefined,
        maxTotalScore: undefined
    });

    const { data, isLoading } = useResultList(params);
    
    const handleSearch = (val: string) => {
        setParams(p => ({ ...p, studentCode: val, page: 1 }));
    };

    const handleFilterChange = (key: keyof ResultParam, value: any) => {
        setParams(p => ({ ...p, [key]: value, page: 1 }));
    };

    return (
        <>
            <div className="mb-6"></div>
            <Space direction="vertical" className="w-full" size="large">
                <div className="flex justify-between">
                    <ResultFilter
                        params={params}
                        onSearch={handleSearch}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                <ResultTable
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
            </Space>
        </>
    );
}
