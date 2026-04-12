import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

interface UploadState {
  progress: number;
  downloadUrl: string | null;
  uploading: boolean;
  error: string | null;
}

export function useFileUpload() {
  const [state, setState] = useState<UploadState>({
    progress: 0,
    downloadUrl: null,
    uploading: false,
    error: null,
  });

  const uploadFile = async (file: File, path: string): Promise<string> => {
    if (!storage) {
      throw new Error('Firebase Storage is not configured. Please set up your .env.local file.');
    }

    return new Promise((resolve, reject) => {
      setState({ progress: 0, downloadUrl: null, uploading: true, error: null });

      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setState((prev) => ({ ...prev, progress }));
        },
        (error) => {
          setState((prev) => ({ ...prev, uploading: false, error: error.message }));
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setState({ progress: 100, downloadUrl, uploading: false, error: null });
          resolve(downloadUrl);
        }
      );
    });
  };

  const resetUpload = () => {
    setState({ progress: 0, downloadUrl: null, uploading: false, error: null });
  };

  return { ...state, uploadFile, resetUpload };
}
