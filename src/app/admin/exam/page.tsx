"use client";

import type { TabsProps } from "antd";
import { Tabs } from "antd";
import CreateExam from "./create-exam";
import ExamList from "./exam-list";


export default function ExamPage() {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Danh sách đề thi",
      children: <ExamList />,
    },
    {
      key: "2",
      label: "Tạo đề thi mới",
      children: <CreateExam />,
    },
  ];

  return (
    <div className="p-6">

      <Tabs
        defaultActiveKey="1"
        items={items}
        type="card"
      />
    </div>
  );
}