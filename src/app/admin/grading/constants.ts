import { ResultGradingRole } from "@/shares/constants/type.enum";
import { AssignRoleInput } from "./types";

export const roleOptions = [
    { label: "Reviewer", value: "REVIEWER" as const },
    { label: "Final_approver", value: "FINAL_APPROVER" as const },
];

export const mapRoleToApi = (role: AssignRoleInput): ResultGradingRole => {
    if (role === "REVIEWER") {
        return ResultGradingRole.REVIEWER;
    }
    return ResultGradingRole.FINAL_APPROVER;
};
