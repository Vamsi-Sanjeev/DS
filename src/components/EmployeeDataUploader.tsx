import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadEmployeeData } from '../lib/supabase';

interface EmployeeDataUploaderProps {
  onUploadSuccess: () => void;
}

export function EmployeeDataUploader({ onUploadSuccess }: EmployeeDataUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadStatus(null);
    setErrorMessage('');

    try {
      await uploadEmployeeData(acceptedFiles[0]);
      setUploadStatus('success');
      onUploadSuccess();
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-medium text-indigo-800 mb-2">CSV Format Requirements:</h3>
        <div className="text-xs text-indigo-700 space-y-1">
          <p>• First row must contain headers: timestamp, workload, satisfaction, department</p>
          <p>• Timestamp format: YYYY-MM-DDTHH:mm:ss (e.g., 2024-03-01T00:00:00)</p>
          <p>• Workload and satisfaction must be numbers between 0 and 100</p>
          <p>• Department must be a text value</p>
        </div>
      </div>

      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
        `}
      >
        <input {...getInputProps()} />
        {acceptedFiles.length > 0 ? (
          <div className="flex flex-col items-center">
            <FileText className="w-12 h-12 text-indigo-500 mb-2" />
            <p className="text-sm text-gray-600">{acceptedFiles[0].name}</p>
            <p className="text-xs text-gray-500 mt-1">Click or drag to replace</p>
          </div>
        ) : (
          <>
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-indigo-500' : 'text-gray-400'}`} />
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Drop the CSV file here'
                : 'Drag and drop a CSV file here, or click to select'}
            </p>
          </>
        )}
      </motion.div>

      {uploading && (
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Upload className="w-6 h-6 text-indigo-500" />
          </motion.div>
          <span className="ml-2 text-sm text-gray-600">Uploading...</span>
        </div>
      )}

      {uploadStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center text-green-600"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>Upload successful!</span>
        </motion.div>
      )}

      {uploadStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center text-red-600"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{errorMessage}</span>
        </motion.div>
      )}
    </div>
  );
}