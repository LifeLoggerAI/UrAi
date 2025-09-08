
import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

const ResumableUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const startUpload = () => {
    if (!file) return;

    setIsUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, 'uploads/' + file.name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setIsUploading(false);
      },
      () => {
        console.log("Upload complete");
        setIsUploading(false);
      }
    );
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
          <span>{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};

export default ResumableUpload;
