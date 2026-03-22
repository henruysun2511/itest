"use client";

import { ArrowLeftOutlined, HomeOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Result, Typography } from "antd";
import { useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[32px] shadow-2xl p-12 text-center border-none">
        <Result
          status="404"
          icon={
            <div className="relative inline-block">
              <div className="text-9xl font-black text-slate-100 select-none">404</div>
              <QuestionCircleOutlined className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-[var(--color-accent)] animate-bounce" />
            </div>
          }
          title={
            <Title level={2} className="!text-[var(--color-navy-deep)] !font-black !mt-0 !mb-2 uppercase tracking-tight">
              Không tìm thấy trang
            </Title>
          }
          subTitle={
            <Paragraph className="text-slate-400 text-lg mb-8">
              Rất tiếc, đường dẫn bạn truy cập hiện không tồn tại hoặc đã được thay đổi.
              Vui lòng kiểm tra lại URL hoặc quay về trang chủ.
            </Paragraph>
          }
          extra={[
            <div key="actions" className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
                className="rounded-xl h-12 px-8 border-slate-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all font-medium"
              >
                Quay lại
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={() => router.push("/")}
                className="rounded-xl h-12 px-8 bg-[var(--color-navy-deep)] border-none hover:!bg-[var(--color-navy-main)] shadow-lg shadow-blue-900/10 font-bold"
              >
                Về trang chủ
              </Button>
            </div>
          ]}
        />

        <div className="mt-12 pt-12 border-t border-slate-50 flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center font-black text-[var(--color-navy-deep)] shadow-lg shadow-orange-500/10">i</div>
          <span className="text-slate-300 font-bold tracking-tighter text-sm uppercase">iTEST System</span>
        </div>
      </div>
    </div>
  );
}
