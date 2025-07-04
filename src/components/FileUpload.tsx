
import React, { useState, useCallback } from 'react';
import { Upload, File, X, Plus } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onFileDrop: (files: File[]) => void;
  title: string;
  description: string;
}

const FileUpload = ({ accept, multiple = false, onFileDrop, title, description }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    let newFiles: File[];
    
    if (multiple) {
      newFiles = [...uploadedFiles, ...files];
    } else {
      // For single file mode, only take the first file
      newFiles = files.slice(0, 1);
    }
    
    setUploadedFiles(newFiles);
    onFileDrop(newFiles);
  }, [onFileDrop, multiple, uploadedFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let newFiles: File[];
    
    if (multiple) {
      newFiles = [...uploadedFiles, ...files];
    } else {
      // For single file mode, replace any existing file
      newFiles = files.slice(0, 1);
    }
    
    setUploadedFiles(newFiles);
    onFileDrop(newFiles);
  }, [onFileDrop, multiple, uploadedFiles]);

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFileDrop(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            {multiple && uploadedFiles.length > 0 ? (
              <Plus className="h-8 w-8 text-gray-400" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            {multiple && uploadedFiles.length > 0 ? (
              <p className="text-sm text-gray-500">
                Add more files or <span className="text-blue-600 font-medium">browse</span>
              </p>
            ) : uploadedFiles.length > 0 && !multiple ? (
              <p className="text-sm text-gray-500">
                Replace file or <span className="text-blue-600 font-medium">browse</span>
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Drop your {multiple ? 'files' : 'file'} here or <span className="text-blue-600 font-medium">browse</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Selected File{uploadedFiles.length > 1 ? 's' : ''} ({uploadedFiles.length}):
            </h4>
            {multiple && uploadedFiles.length > 1 && (
              <p className="text-sm text-gray-500">
                Drag files to reorder them
              </p>
            )}
          </div>
          {uploadedFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                {/* File Icon and Info */}
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <File className="h-6 w-6 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                    
                    {/* PDF Preview simulation */}
                    {file.type === 'application/pdf' && (
                      <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg max-w-sm">
                        <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <File className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-xs font-medium">PDF Preview</p>
                            <p className="text-xs">{file.name}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Preview */}
                    {file.type.startsWith('image/') && (
                      <div className="mt-3">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name}
                          className="max-w-sm max-h-48 object-contain rounded-lg border border-gray-200 bg-white"
                          onLoad={(e) => {
                            // Clean up object URL after image loads
                            setTimeout(() => {
                              URL.revokeObjectURL((e.target as HTMLImageElement).src);
                            }, 1000);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Remove Button - Below on mobile, right side on desktop */}
                <div className="flex sm:flex-col items-start space-x-2 sm:space-x-0 sm:space-y-2 flex-shrink-0">
                  <button
                    onClick={() => removeFile(index)}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove file"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
