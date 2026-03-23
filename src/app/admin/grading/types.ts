export type AssignRoleInput = "REVIEWER" | "FINAL_APPROVER";

export interface AssignFormValue {
    examSessionCode: string;
    teacherCode: string;
    role: AssignRoleInput;
}
