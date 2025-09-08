
import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, UploadTask } from "firebase/storage";

const ResumableUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadTask, setUploadTask] = useState<UploadTask | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setFile(e.target.files[0]);
    }
  };

  const startUpload = () => {
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, 'uploads/' + file.name);

    const task = uploadBytesResumable(storageRef, file);
    setUploadTask(task);
    setIsUploading(true);
    setIsPaused(false);

    task.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        switch (snapshot.state) {
          case 'paused':
            setIsPaused(true);
            setIsUploading(false);
            console.log('Upload is paused');
            break;
          case 'running':
            setIsPaused(false);
            setIsUploading(true);
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.error("Upload failed:", error);
        setIsUploading(false);
        setIsPaused(false);
        setUploadTask(null);
      },
      () => {
        console.log("Upload complete");
        setIsUploading(false);
        setIsPaused(false);
        setUploadTask(null);
        setProgress(100);
      }
    );
  };

  const handlePause = () => {
    if (uploadTask) {
      uploadTask.pause();
    }
  };

  const handleResume = () => {
    if (uploadTask) {
      uploadTask.resume();
    }
  };

    const handleCancel = () => {
        if (uploadTask) {
            uploadTask.cancel();
            // Reset state
            setFile(null);
            setProgress(0);
            setUploadTask(null);
            setIsUploading(false);
            setIsPaused(false);
        }
    };


  return (
    <div>
      <h3>Resumable File Upload</h3>
      <input type="file" onChange={handleFileChange} />
      
      {!uploadTask && <button onClick={startUpload} disabled={!file}>Upload</button>}

      {isUploading && !isPaused && <button onClick={handlePause}>Pause</button>}
      
      {isPaused && <button onClick={handleResume}>Resume</button>}

      {uploadTask && <button onClick={handleCancel}>Cancel</button>}

      {(isUploading || isPaused) && (
        <div>
          <progress value={progress} max="100" />
          <span>{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};

export default ResumableUpload;
