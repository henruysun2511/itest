import {
    DeleteOutlined
} from '@ant-design/icons';
import { Button } from "antd";
export const renderMediaContent = (m: any, onRemove: () => void) => {
    const isImage = m.resourceType === 'image';
    const isAudio = m.resourceType === 'video' || m.resourceType === 'audio';

    return (
        <div key={m.publicId} style={{ marginBottom: 12, position: 'relative', display: 'inline-block', marginRight: 12 }}>
            {/* Nút xóa nhỏ ở góc */}
            <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                size="small"
                onClick={onRemove}
                style={{ position: 'absolute', right: -10, top: -10, zIndex: 10 }}
            />

            {isImage && (
                <img
                    src={m.url}
                    alt="media"
                    style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid #d9d9d9' }}
                />
            )}

            {isAudio && (
                <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '8px' }}>
                    <audio controls src={m.url} style={{ height: '35px' }}>
                        Trình duyệt không hỗ trợ nghe nhạc.
                    </audio>
                </div>
            )}
        </div>
    );
};