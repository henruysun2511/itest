"use client";

import { useExamSetList } from "@/queries/useExamSetQuery";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { useState } from "react";
import { ExamSetCreateModal } from "./examSet-create-modal";
import ExamSetTable from "./examSet-table";

export default function ExamSetPage() {
  const [params, setParams] = useState({
    page: 1,
    size: 10,
    search: "",
  });

  const { data, isLoading } = useExamSetList();
  console.log(data)

  const [openModal, setOpenModal] = useState(false);

  console.log("data examSet:", data);

  return (
    <>
      <div className="mb-6"></div>

      <Space direction="vertical" className="w-full" size="large">
        <div className="flex justify-between">
          <Input.Search
            placeholder="Tìm kiếm tên bộ đề..."
            allowClear
            size="large"
            style={{ width: 500 }}
            onSearch={(val) =>
              setParams((p) => ({ ...p, search: val, page: 1 }))
            }
          />

          <Button
            type="primary"
            size="middle"
            icon={<PlusOutlined />}
            className="bg-primary"
            onClick={() => setOpenModal(true)}
          >
            Thêm bộ đề
          </Button>
        </div>

        <ExamSetTable
          data={data?.data ?? []}
          loading={isLoading}
          pagination={{
            current: params.page,
            pageSize: params.size,
            total: data?.meta?.totalElements, //  backend trả gì
            onChange: (page: number, pageSize: number) =>
              setParams((p) => ({ ...p, page, size: pageSize })),
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