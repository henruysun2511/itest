import { App } from "antd";

export const useToast = () => {
  const { message } = App.useApp();

  return {
    success(content: string) {
      message.open({
        type: "success",
        content,
      });
    },
    error(content: string) {
      message.open({
        type: "error",
        content,
      });
    },
    warning(content: string) {
      message.open({
        type: "warning",
        content,
      });
    },
    info(content: string) {
      message.open({
        type: "info",
        content,
      });
    },
  };
};

export type ToastType = ReturnType<typeof useToast>;