"use client";

import { useDeleteExamPdf, useUploadExamPdf } from '@/queries/useStorageQuery';
import { QuestionType } from '@/shares/constants/type.enum';
import { getQuestionTypeLabel } from '@/shares/utils/mappingLabel';
import { CloseCircleFilled, FileOutlined, PaperClipOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Input, List, message, Radio, Tag, Upload } from 'antd';
import { RenderMediaList } from './media-render';


export function StudentQuestion({ question, value, onChange }: any) {
  const { questionType, content, options, questionNumber, groupInstruction, groupMedia, mediaPlaceholders } = question;
  const type = questionType?.toUpperCase();
  const typeInfo = getQuestionTypeLabel(questionType);

  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadExamPdf();
  const { mutateAsync: deleteFile } = useDeleteExamPdf();

  const handleUpload = async (file: File) => {
    try {
      const response = await uploadFile(file);
      const { objectKey, signedUrl } = response.data.data;

      onChange({
        content: value?.content || "",
        file_metadata: [...(value?.file_metadata || []), { signedUrl, objectKey }]
      });
    } catch (error) {
      message.error("Lỗi khi tải file");
    }
    return false;
  };

  const handleDelete = async (fileItem: any) => {
    try {
      // Gọi API xóa theo interface DeleteFilePdfBody { filePath: string }
      await deleteFile({ filePath: fileItem.objectKey });

      const newMetadata = value.file_metadata.filter((m: any) => m.objectKey !== fileItem.objectKey);

      onChange({
        ...value,
        file_metadata: newMetadata
      });
      message.success("Đã xóa file");
    } catch (e) {
      message.error("Xóa file thất bại");
    }
  };

  const renderOptions = () => {
    const activeClass = "border-[var(--color-primary)] bg-[rgba(44,44,112,0.05)] shadow-sm";
    const inactiveClass = "border-gray-100 bg-white hover:border-[var(--color-accent)]";

    switch (type) {
      case QuestionType.SINGLE_CHOICE:
      case QuestionType.TRUE_FALSE:
        return (
          <Radio.Group onChange={(e) => onChange(e.target.value)} value={value} className="w-full">
            <div className="flex flex-col gap-3">
              {options?.map((opt: any) => (
                <Radio
                  key={opt.label}
                  value={opt.label}
                  className={`m-0 p-4 rounded-xl border-2 transition-all w-full flex items-center ${value === opt.label ? activeClass : inactiveClass
                    }`}
                >
                  <span className="font-bold mr-2 text-[var(--color-primary)]">{opt.label}.</span> {opt.text}
                </Radio>
              ))}
            </div>
          </Radio.Group>
        );

      case QuestionType.MULTIPLE_CHOICE:
        return (
          <Checkbox.Group onChange={(vals) => onChange(vals)} value={value || []} className="w-full">
            <div className="flex flex-col gap-3">
              {options?.map((opt: any) => (
                <Checkbox
                  key={opt.label}
                  value={opt.label}
                  className={`m-0 p-4 rounded-xl border-2 transition-all w-full flex items-center ${value?.includes(opt.label) ? activeClass : inactiveClass
                    }`}
                >
                  <span className="font-bold mr-2 text-[var(--color-primary)]">{opt.label}.</span> {opt.text}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        );

      case QuestionType.FILL_IN_THE_BLANK:
        return (
          <Input
            placeholder="Gõ câu trả lời ngắn tại đây..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 rounded-xl border-2 border-gray-100 focus:border-[var(--color-primary)] max-w-md"
          />
        );

      case QuestionType.ESSAY:
        return (
          <div className="space-y-4">
            <Input.TextArea
              value={value?.content || ""}
              onChange={(e) => onChange({
                content: e.target.value,
                file_metadata: value?.file_metadata || []
              })}
            />

            <div className="bg-slate-50 p-4 rounded-xl border border-dashed">
              <div className="flex justify-between mb-3">
                <span className="text-xs font-bold text-slate-500"><PaperClipOutlined /> ĐÍNH KÈM PDF</span>
                <Upload beforeUpload={handleUpload} showUploadList={false} multiple>
                  <Button icon={<UploadOutlined />} loading={isUploading} size="small">Chọn file</Button>
                </Upload>
              </div>

              <List
                dataSource={value?.file_metadata || []}
                renderItem={(item: any) => (
                  <div className="flex items-center justify-between bg-white p-2 mb-2 rounded border">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileOutlined className="text-red-500" />
                      <a href={item.signedUrl} target="_blank" rel="noreferrer" className="text-xs truncate max-w-[250px]">
                        {item.fileName || "Tài liệu đính kèm"}
                      </a>
                    </div>
                    <CloseCircleFilled
                      className="text-red-400 hover:text-red-600 cursor-pointer"
                      onClick={() => handleDelete(item)}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        );

      default:
        return <Tag color="error">Loại câu hỏi {type} đang được cập nhật</Tag>;
    }
  };

  return (
    <Card
      className="mb-8 rounded-3xl border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden"
      bodyStyle={{ padding: '28px' }}
    >
      {groupInstruction && (
        <div className="mb-6 p-6 bg-[rgba(230,169,67,0.1)] border-l-4 border-[var(--color-accent)] rounded-r-2xl">
          <Tag color="orange" className="mb-3 font-bold uppercase border-none">Thông tin nhóm câu hỏi</Tag>
          <div className="text-slate-700 leading-relaxed text-base italic mb-4" dangerouslySetInnerHTML={{ __html: groupInstruction }} />
          <RenderMediaList mediaList={groupMedia} />
        </div>
      )}

      <div className="flex gap-5">
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          {/* Số thứ tự câu hỏi */}
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-black shadow-lg shadow-[rgba(44,44,112,0.2)]">
            {questionNumber}
          </div>
        </div>

        <div className="flex-grow">
          <div className='flex justify-between items-center mb-4'>
            <div
              className="text-[17px] font-semibold text-[var(--color-text-primary)] leading-relaxed"
            >{content}</div>

            <Tag color={typeInfo.color} className="rounded-full px-3 font-medium uppercase text-[10px] tracking-wider border-none shadow-sm">
              {typeInfo.label}
            </Tag>
          </div>


          <RenderMediaList mediaList={mediaPlaceholders} />

          <div className="mt-6">
            {renderOptions()}
          </div>
        </div>
      </div>
    </Card>
  );
}