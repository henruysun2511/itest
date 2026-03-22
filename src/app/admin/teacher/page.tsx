"use client";
import { useTeacherList } from "@/queries/useTeacherQuery";
import { Space, Typography } from "antd";
import TeacherTable from "./teacher-table";

const { Title } = Typography;

export default function TeacherPage() {
    const { data, isLoading } = useTeacherList();

    return (
        <div className="p-6">
            <Space orientation="vertical" size="large" className="w-full">
                <TeacherTable
                    data={data?.data ?? []}
                    loading={isLoading}
                    pagination={false} // Teacher list is currently not paginated in the query/service
                />
            </Space>
        </div>
    );
}
