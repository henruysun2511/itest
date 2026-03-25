import { FraudType } from "@/shares/constants/type.enum";
import { message, Modal } from "antd";
import { useEffect } from "react";

export function useExamFullscreen(onViolation: (type: FraudType) => void) {
  useEffect(() => {
    const handleEnableFullScreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err) => {
          console.error(`Không thể bật toàn màn hình: ${err.message}`);
        });
      }
    };

    let modal: any;
    if (!document.fullscreenElement) {
      modal = Modal.warning({
        title: "Yêu cầu chế độ toàn màn hình",
        content:
          "Để đảm bảo tính công bằng, bài thi yêu cầu chế độ toàn màn hình. Vui lòng nhấn xác nhận để bắt đầu.",
        okText: "Xác nhận & Vào thi",
        onOk: handleEnableFullScreen,
      });
    }

    const handleExit = () => {
      if (!document.fullscreenElement) {
        message.error(
          "Cảnh báo: Bạn đã thoát chế độ toàn màn hình! Hành động này sẽ được ghi nhận.",
        );
        onViolation(FraudType.WINDOW_BLUR);
      }
    };

    document.addEventListener("fullscreenchange", handleExit);
    return () => {
      document.removeEventListener("fullscreenchange", handleExit);
      if (modal) modal.destroy();
    };
  }, [onViolation]);
}
