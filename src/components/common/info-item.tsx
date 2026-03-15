export function InfoItem({ icon, label, value }: { icon: any, label: string, value: any }) {
    return (
        <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
            <div className="text-2xl">{icon}</div>
            <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                <div className="text-base font-semibold text-slate-700">{value || "Chưa cập nhật"}</div>
            </div>
        </div>
    );
}