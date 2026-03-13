"use client";
import { SortOrder } from "@/constants/sort.enum";
import { useStudentList } from "@/queries/useStudentQuery";
import { StudentParam } from "@/types/param";
import { Space, Typography } from "antd";
import { useState } from "react";
import { StudentFilter } from "./student-filter";
import StudentTable from "./student-table";

const { Title } = Typography;

export default function StudentPage() {
    const [params, setParams] = useState<StudentParam>({
        page: 1,
        limit: 10,
        search: "",
        sortOrder: SortOrder.DESC,
    });

    const { data, isLoading } = useStudentList(params);
    console.log(data)

    const handleSearch = (val: string) => {
        setParams(p => ({ ...p, search: val, page: 1 }));
    };

    const handleFilterChange = (key: keyof StudentParam, value: any) => {
        setParams(p => ({ ...p, [key]: value, page: 1 }));
    };

    return (
        <div className="p-6">
            <Space orientation="vertical" size="large" className="w-full">
                <StudentFilter
                    params={params}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                />

                <StudentTable
                    data={data?.data ?? []}
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
            </Space>
        </div>
    );
}