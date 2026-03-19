import { MediaPlaceholder } from '@/shares/types/object';
import {
    DeleteOutlined
} from '@ant-design/icons';
import { Button } from "antd";
export const renderMediaContent = (p: MediaPlaceholder, onRemove: () => void) => {
    const isImage = p.mediaType === 'image';
    const isAudio = p.mediaType === 'audio';

    return (
        <div key={p.publicId || p.url} className="relative inline-block mr-3 mb-3">
            <Button
                type="primary" danger shape="circle" size="small"
                icon={<DeleteOutlined />}
                onClick={onRemove}
                className="absolute -top-2 -right-2 z-10"
            />
            {isImage && (
                <img src={p.url} alt="media" className="max-w-[200px] rounded-lg border" />
            )}
            {isAudio && (
                <div className="bg-slate-100 p-2 rounded-lg">
                    <audio controls src={p.url} className="h-9" />
                </div>
            )}
        </div>
    );
};