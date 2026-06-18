import { useEffect, useRef, useState } from 'react';
import type { UploadedFileInfo } from '../types/activity';

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export function PhotoUpload({
  uploaded,
  onUploaded,
}: {
  uploaded?: UploadedFileInfo;
  onUploaded: (file: UploadedFileInfo) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const choose = (selected?: File) => {
    setError('');
    if (!selected) return;
    if (!ALLOWED.includes(selected.type)) {
      setError('請選擇 JPEG、PNG 或 WEBP 圖片。');
      return;
    }
    if (selected.size > MAX_SIZE) {
      setError('圖片不可超過 10 MB，請縮小後再試。');
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    onUploaded({ fileName: selected.name, selectedAt: new Date().toISOString() });
  };

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="upload-card">
      {preview ? (
        <img className="photo-preview" src={preview} alt="準備上傳的照片預覽" />
      ) : (
        <button className="upload-picker" type="button" onClick={() => inputRef.current?.click()}>
          <span aria-hidden="true">＋</span>
          拍照或選擇照片
        </button>
      )}
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept={ALLOWED.join(',')}
        capture="environment"
        onChange={(event) => choose(event.target.files?.[0])}
      />
      {file && (
        <div className="upload-actions">
          <button className="button button-ghost" type="button" onClick={clear}>
            重新選擇
          </button>
        </div>
      )}
      <p className="upload-notice">照片只會在這台裝置上預覽，不會上傳或保存。</p>
      {(file || uploaded) && (
        <p className="success-message">
          ✓ 已選擇照片{file?.name ?? uploaded?.fileName ? `：${file?.name ?? uploaded?.fileName}` : ''}
        </p>
      )}
      {error && <p className="error-message" role="alert">{error}</p>}
    </div>
  );
}
