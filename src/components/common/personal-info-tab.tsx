"use client";
import { InfoItem } from "@/components/common/info-item";
import { CalendarOutlined, CloseOutlined, EditOutlined, IdcardOutlined, PhoneOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, Input, Select, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

const { Title, Text: AntText } = Typography;

interface PersonalInfoTabProps {
    profile: any;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    onUpdate: (values: any) => void;
    isUpdating: boolean;
}

export function PersonalInfoTab({ profile, isEditing, setIsEditing, onUpdate, isUpdating }: PersonalInfoTabProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (profile && !isEditing) {
            form.setFieldsValue({
                ...profile,
                dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
            });
        }
    }, [profile, isEditing, form]);

    return (
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <Title level={4} className="!mb-0">Hồ sơ cá nhân</Title>
                {!isEditing ? (
                    <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)} type="link" className="font-semibold text-[var(--color-navy-light)]">Chỉnh sửa</Button>
                ) : (
                    <Button icon={<CloseOutlined />} onClick={() => setIsEditing(false)} type="link" danger>Hủy bỏ</Button>
                )}
            </div>
            
            {isEditing ? (
                <Form form={form} layout="vertical" onFinish={onUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                        <Form.Item name="fullName" label={<AntText strong>Họ và tên</AntText>} rules={[{ required: true }]}>
                            <Input size="large" className="rounded-lg" />
                        </Form.Item>
                        <Form.Item name="phoneNumber" label={<AntText strong>Số điện thoại</AntText>}>
                            <Input size="large" className="rounded-lg" />
                        </Form.Item>
                        <Form.Item name="dateOfBirth" label={<AntText strong>Ngày sinh</AntText>}>
                            <DatePicker size="large" className="w-full rounded-lg" format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item name="gender" label={<AntText strong>Giới tính</AntText>}>
                            <Select size="large" className="rounded-lg" options={[{ value: "MALE", label: "Nam" }, { value: "FEMALE", label: "Nữ" }]} />
                        </Form.Item>
                    </div>
                    <Button type="primary" htmlType="submit" loading={isUpdating} icon={<SaveOutlined />} className="bg-[var(--color-navy-main)] mt-4 px-10 rounded-lg h-11 font-bold">Lưu thay đổi</Button>
                </Form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InfoItem icon={<UserOutlined className="text-blue-500" />} label="Họ và tên" value={profile?.fullName} />
                    <InfoItem icon={<PhoneOutlined className="text-green-500" />} label="Số điện thoại" value={profile?.phoneNumber} />
                    <InfoItem icon={<CalendarOutlined className="text-orange-500" />} label="Ngày sinh" value={profile?.dateOfBirth ? dayjs(profile?.dateOfBirth).format("DD/MM/YYYY") : "---"} />
                    <InfoItem icon={<UserOutlined className="text-purple-500" />} label="Giới tính" value={profile?.gender === "MALE" ? "Nam" : "Nữ"} />
                    {profile?.account?.student && (
                        <InfoItem icon={<IdcardOutlined className="text-cyan-500" />} label="Mã sinh viên" value={profile.account.student.studentCode} />
                    )}
                    {profile?.account?.teacher && (
                        <InfoItem icon={<IdcardOutlined className="text-amber-500" />} label="Mã giảng viên" value={profile.account.teacher.teacherCode} />
                    )}
                </div>
            )}
        </Card>
    );
}