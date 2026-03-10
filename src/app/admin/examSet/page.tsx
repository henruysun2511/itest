"use client";

import { ExamSetSortBy, SortOrder } from "@/constants/sort.enum";
import { useExamSetList } from "@/queries/useExamSetQuery";
import { ExamSetParam } from "@/types/param";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useState } from "react";
import { ExamSetCreateModal } from "./examSet-create-modal";
import { ExamSetFilter } from "./examSet-filter";
import ExamSetTable from "./examSet-table";

export default function ExamSetPage() {
  const [params, setParams] = useState<ExamSetParam>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: ExamSetSortBy.CREATED_AT,
    sortOrder: SortOrder.DESC,
  });

  // Giả sử useExamSetList của bạn có nhận params
  const { data, isLoading } = useExamSetList(params);
  const [openModal, setOpenModal] = useState(false);

  const handleSearch = (val: string) => {
    setParams((p) => ({ ...p, search: val, page: 1 }));
  };

  const handleSort = (sortBy: ExamSetSortBy, sortOrder: SortOrder) => {
    setParams((p) => ({ ...p, sortBy, sortOrder, page: 1 }));
  };

  return (
    <>

      <Space direction="vertical" className="w-full" size="large">
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className="bg-primary"
              onClick={() => setOpenModal(true)}
            >
              Thêm bộ đề
            </Button>
          </div>

          {/* Sử dụng Component Filter mới */}
          <ExamSetFilter
            params={params}
            onSearch={handleSearch}
            onSortChange={handleSort}
          />
        </div>

        <ExamSetTable
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

      <ExamSetCreateModal
        open={openModal}
        onCancel={() => setOpenModal(false)}
      />
    </>
  );
}