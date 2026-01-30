import { ToastType } from "@/hooks/useToast";

export const handleError = (
    error: any,
    toast: ToastType,
    defaultMsg: string = "Thao tác thất bại"
) => {
    const errorData = error?.response?.data;

    const msg =
        errorData?.messages?.[0] ||
        errorData?.message ||
        defaultMsg;

    toast.error(msg);
    return msg;
};