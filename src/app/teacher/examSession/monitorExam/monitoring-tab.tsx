"use client";

import {
    CheckCircleOutlined,
    LogoutOutlined,
    PauseCircleOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    WarningOutlined
} from '@ant-design/icons';
import {
    Badge, Card, Col, Layout, Row, Space, Tag, Tooltip, Typography,
    message
} from "antd";
import { useState } from "react";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function MonitoringTab() {
    const [students, setStudents] = useState([
        { id: '1', name: 'Nguyễn Văn A', code: 'SV001', status: 'examining', violations: 0, progress: 65 },
        { id: '2', name: 'Trần Thị B', code: 'SV002', status: 'violation', violations: 2, progress: 40 },
        { id: '3', name: 'Lê Văn C', code: 'SV003', status: 'submitted', violations: 0, progress: 100 },
        { id: '4', name: 'Phạm Minh D', code: 'SV004', status: 'paused', violations: 1, progress: 12 },
        { id: '5', name: 'Hoàng Anh E', code: 'SV005', status: 'disconnected', violations: 0, progress: 88 },
    ]);

    return (
        <>
            {/* 2. Thống kê nhanh */}
            <Row gutter={16} className="mb-6">
                {[
                    { label: 'Tổng số', count: 45, icon: <TeamOutlined />, color: '#1e293b' },
                    { label: 'Đang thi', count: 38, icon: <ThunderboltOutlined />, color: '#16a34a' },
                    { label: 'Vi phạm', count: 2, icon: <WarningOutlined />, color: '#dc2626' },
                    { label: 'Đã nộp', count: 5, icon: <CheckCircleOutlined />, color: '#2563eb' },
                ].map((stat, i) => (
                    <Col span={6} key={i}>
                        <Card bordered={false} className="shadow-sm rounded-xl">
                            <Space align="center">
                                <div className="p-3 rounded-lg" style={{ background: stat.color + '10', color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <Text type="secondary">{stat.label}</Text>
                                    <Title level={3} className="!m-0">{stat.count}</Title>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Title level={5} className="mb-4">Danh sách vi phạm</Title>
            <Row gutter={16} className="mb-6">
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card
                        hoverable
                        className={`rounded-xl border-2 transition-all duration-300  'border-red-500 bg-red-50 animate-pulse' : 'border-transparent'
                                }`}
                        bodyStyle={{ padding: 16 }}
                        actions={[
                            <Tooltip title="Tạm dừng bài thi" key="pause">
                                <PauseCircleOutlined onClick={() => message.info(`Đã tạm dừng bài của Bro`)} />
                            </Tooltip>,
                            <Tooltip title="Thu bài cưỡng chế" key="force">
                                <LogoutOutlined className="text-red-500" />
                            </Tooltip>,
                            <Tooltip title="Cấp quyền thi lại" key="retake">
                                <ThunderboltOutlined className="text-amber-500" />
                            </Tooltip>,
                        ]}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <Space direction="vertical" size={0}>
                                <Text strong className="text-base">bro</Text>
                                <Text type="secondary" className="text-xs">26A4041675</Text>
                            </Space>
                            <Badge

                            />
                        </div>

                        <div className="space-y-2 mb-2">
                            <div className="flex justify-between text-xs">
                                <span>Tiến độ bài làm:</span>
                                <span className="font-bold">80%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full bg-red-500`}
                                    style={{ width: `80%` }}
                                />
                            </div>
                        </div>


                        <Tag color="error" icon={<WarningOutlined />} className="w-full text-center m-0">
                            Vi phạm: 8 lần
                        </Tag>


                        {/* {student.status === 'submitted' && (
                                <Tag color="blue" icon={<CheckCircleOutlined />} className="w-full text-center m-0">
                                    Đã nộp bài
                                </Tag>
                            )}

                            {student.status === 'disconnected' && (
                                <Tag color="default" className="w-full text-center m-0">
                                    Mất kết nối
                                </Tag>
                            )} */}
                    </Card>
                </Col>
            </Row>


            {/* 3. Monitoring Grid */}
            <Title level={5} className="mb-4">Theo dõi thí sinh trực tuyến</Title>
            <Row gutter={[16, 16]}>
                {students.map((student) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={student.id}>
                        <Card
                            hoverable
                            className={`rounded-xl border-2 transition-all duration-300 ${student.status === 'violation' ? 'border-red-500 bg-red-50 animate-pulse' : 'border-transparent'
                                }`}
                            bodyStyle={{ padding: 16 }}
                            actions={[
                                <Tooltip title="Tạm dừng bài thi" key="pause">
                                    <PauseCircleOutlined onClick={() => message.info(`Đã tạm dừng bài của ${student.name}`)} />
                                </Tooltip>,
                                <Tooltip title="Thu bài cưỡng chế" key="force">
                                    <LogoutOutlined className="text-red-500" />
                                </Tooltip>,
                                <Tooltip title="Cấp quyền thi lại" key="retake">
                                    <ThunderboltOutlined className="text-amber-500" />
                                </Tooltip>,
                            ]}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <Space direction="vertical" size={0}>
                                    <Text strong className="text-base">{student.name}</Text>
                                    <Text type="secondary" className="text-xs">{student.code}</Text>
                                </Space>
                                <Badge
                                    status={
                                        student.status === 'examining' ? 'processing' :
                                            student.status === 'violation' ? 'error' : 'default'
                                    }
                                />
                            </div>

                            <div className="space-y-2 mb-2">
                                <div className="flex justify-between text-xs">
                                    <span>Tiến độ bài làm:</span>
                                    <span className="font-bold">{student.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full ${student.status === 'violation' ? 'bg-red-500' : 'bg-blue-500'}`}
                                        style={{ width: `${student.progress}%` }}
                                    />
                                </div>
                            </div>

                            {student.violations > 0 && (
                                <Tag color="error" icon={<WarningOutlined />} className="w-full text-center m-0">
                                    Vi phạm: {student.violations} lần
                                </Tag>
                            )}

                            {student.status === 'submitted' && (
                                <Tag color="blue" icon={<CheckCircleOutlined />} className="w-full text-center m-0">
                                    Đã nộp bài
                                </Tag>
                            )}

                            {student.status === 'disconnected' && (
                                <Tag color="default" className="w-full text-center m-0">
                                    Mất kết nối
                                </Tag>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}