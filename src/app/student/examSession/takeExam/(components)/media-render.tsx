import { Image } from "antd";

export const RenderMediaList = ({ mediaList }: { mediaList?: any[] }) => {
  if (!mediaList || mediaList.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-3 mb-4">
      {mediaList.map((m, idx) => (
        <div key={idx} className="max-w-full">
          {/* Kiểm tra cả resourceType (Cloudinary) và mediaType (Interface của bạn) */}
          {(m.resourceType === 'image' || m.mediaType === 'image') && (
            <Image
              src={m.url}
              alt="question-media"
              className="rounded-xl border border-gray-100 shadow-sm"
              style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
            />
          )}
          
          {/* Xử lý Audio/Video */}
          {(m.resourceType === 'video' || m.resourceType === 'audio' || m.mediaType === 'audio') && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 min-w-[300px]">
              <audio controls src={m.url} className="w-full h-10" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};