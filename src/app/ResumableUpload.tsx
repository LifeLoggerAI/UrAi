
import React, { useState } from 'react';

const ResumableUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadId, setUploadId] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const startUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const newUploadId = Date.now().toString();
    setUploadId(newUploadId);
    const chunkSize = 1024 * 1024; // 1MB
    let offset = 0;

    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('uploadId', newUploadId);
      formData.append('offset', offset.toString());
      formData.append('totalSize', file.size.toString());

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Upload failed');
        }

        offset += chunk.size;
        setProgress(Math.round((offset / file.size) * 100));
      } catch (error) {
        console.error('Upload error:', error);
        setIsUploading(false);
        return;
      }
    }

    setIsUploading(false);
    console.log('Upload complete');
  };

  return (
    <div>
      <h3>Resumable File Upload</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={startUpload} disabled={isUploading || !file}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
      {isUploading && (
        <div>
          <progress value={progress} max="100" />
          <span>{progress}%</span>
        </div>
      )}
    </div>
  );
};

export default ResumableUpload;
