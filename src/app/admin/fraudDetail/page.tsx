"use client";
import { useFraudDetailList } from "@/queries/useFraudDetailQuery";
import { FraudParam } from "@/shares/types/param";
import { Space } from "antd";
import { useState } from "react";
import { FraudFilter } from "./fraud-filter";
import FraudTable from "./fraud-table";

export default function FraudPage() {
    const [params, setParams] = useState<FraudParam>({
        page: 1,
        limit: 10,
        studentCode: "",
        examSessionId: undefined
    });

    const { data, isLoading } = useFraudDetailList(params);
    
    const handleSearch = (val: string) => {
        setParams(p => ({ ...p, studentCode: val, page: 1 }));
    };

    const handleFilterChange = (key: keyof FraudParam, value: any) => {
        setParams(p => ({ ...p, [key]: value, page: 1 }));
    };

    return (
        <>
            <div className="mb-6"></div>
            <Space direction="vertical" className="w-full" size="large">
                <div className="flex justify-between">
                    <FraudFilter
                        params={params}
                        onSearch={handleSearch}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                <FraudTable
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
