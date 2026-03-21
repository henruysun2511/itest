"use client";
import { useExamByExamSet } from "@/queries/useExamQuery";
import { ExamSortBy, SortOrder } from "@/shares/constants/sort.enum";
import { ExamParam } from "@/shares/types/param";
import { useState } from "react";
import { ExamFilter } from "./exam-filter";
import ExamTable from "./exam-table";

export default function ExamList() {
    const [params, setParams] = useState<ExamParam>({
        page: 1,
        limit: 10,
        search: "",
        examSetId: "",
        sortBy: ExamSortBy.CREATED_AT,
        sortOrder: SortOrder.DESC,
    });

    const { data, isLoading } = useExamByExamSet(params.examSetId, {
        page: params.page,
        limit: params.limit,
        search: params.search,
        sortBy: params.sortBy as any,
        sortOrder: params.sortOrder,
        examSetId: params.examSetId, 
    });

    return (
        <div className="pt-6">
            <ExamFilter
                params={params}
                onSearch={(val: string) => setParams(p => ({ ...p, search: val, page: 1 }))}
                onExamSetChange={(id: string) => setParams(p => ({ ...p, examSetId: id, page: 1 }))}
                onSortChange={(sortBy, sortOrder) =>
                    setParams(p => ({ ...p, sortBy, sortOrder }))
                }
            />

            <ExamTable
                data={data?.data || []}
                loading={isLoading}
                pagination={{
                    current: params.page,
                    pageSize: params.limit,
                    total: data?.meta?.total,
                    showSizeChanger: true,
                    onChange: (page: number, pageSize: number) =>
                        setParams((p) => ({ ...p, page, limit: pageSize })),
                }}
            />
        </div>
    );
}