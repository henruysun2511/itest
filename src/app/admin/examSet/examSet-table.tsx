import { ExamSet } from "@/types/object";
import { Button, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useExamSetDelete } from "@/queries/useExamSetQuery";
import { useToast } from "@/hooks/useToast";
import { handleError } from "@/utils/error";
import { useState } from "react";
import { ExamSetUpdateModal } from "./examSet-update-modal";

interface Props {
  data: ExamSet[];
  loading?: boolean;
  pagination?: any;
}

export default function ExamSetTable({
  data,
  loading,
  pagination,
}: Props) {
  const { mutate: deleteExamSet } = useExamSetDelete();
  const toast = useToast();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedExamSet, setSelectedExamSet] =
    useState<ExamSet | null>(null);

  console.log("data examSet table:", data);
  console.log("pagination examSet table:", pagination);

  // handle delete exam set
  const handleDelete = (id: string) => {
    deleteExamSet(id, {
      onSuccess: () => {
        toast.success("Xóa bộ đề thành công");
      },
      onError: (err: any) =>
        handleError(err, toast, "Lỗi khi xóa bộ đề"),
    });
  };

  const columns: ColumnsType<ExamSet> = [
    {
      title: "Exam Set ID",
      dataIndex: "examSetId",
      key: "examSetId",
      render: (text: string) => (
        <span className="font-medium">{text}</span>
      ),
    },
    {
      title: "Tên bộ đề",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-medium">{text}</span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Xóa bộ đề?"
            description="Hành động này không thể hoàn tác."
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.examSetId)}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedExamSet(record);
              setOpenUpdate(true);
            }}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="examSetId"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
      />

      <ExamSetUpdateModal
        open={openUpdate}
        onCancel={() => {
          setOpenUpdate(false);
          setSelectedExamSet(null);
        }}
        data={selectedExamSet}
      />
    </>
  );
}