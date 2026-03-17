import { useToast } from "@/hooks/useToast";
import { useExamSetDelete } from "@/queries/useExamSetQuery";
import { ExamSet } from "@/types/object";
import { handleError } from "@/utils/error";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { ExamExpandedTable } from "./exam-expanded-table";
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
      title: "Mã bộ đề",
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
      title: "Tên bộ môn",
      dataIndex: ["course", "name"],
      key: "courseName",
      render: (text: string) => (
        <span className="font-medium">{text || "Không xác định"}</span>
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
        expandable={{
          expandedRowRender: (record) => (
            <ExamExpandedTable examSetId={record.examSetId} />
          ),
          rowExpandable: (record) => true,
        }}
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