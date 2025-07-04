import React, { useState } from 'react';
import { ArrowLeft, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import FileUpload from './FileUpload';

interface ToolWorkspaceProps {
  toolName: string;
  toolDescription: string;
  fileAccept: string;
  multiple: boolean;
  onBack: () => void;
  rotationAngle?: number;
  children?: React.ReactNode;
}

const ToolWorkspace = ({ 
  toolName, 
  toolDescription, 
  fileAccept, 
  multiple, 
  onBack,
  rotationAngle = 90,
  children 
}: ToolWorkspaceProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const handleFileDrop = (droppedFiles: File[]) => {
    // Clear any previous errors
    setProcessingError(null);
    
    if (!multiple && droppedFiles.length > 1) {
      let errorMessage = '';
      if (toolName === 'Image to PDF') {
        errorMessage = 'You can only select one image file.';
      } else if (toolName === 'Rotate PDF') {
        errorMessage = 'You can only select one PDF to rotate.';
      } else {
        errorMessage = 'This tool only supports one file.';
      }
      setProcessingError(errorMessage);
      return;
    }
    
    setFiles(droppedFiles);
    setIsComplete(false);
    setProcessedFileUrl(null);
  };

  const moveFile = (fromIndex: number, direction: 'up' | 'down') => {
    if (!multiple) return;
    
    const newFiles = [...files];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex < 0 || toIndex >= newFiles.length) return;
    
    [newFiles[fromIndex], newFiles[toIndex]] = [newFiles[toIndex], newFiles[fromIndex]];
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const processMergePDF = async (files: File[]): Promise<Uint8Array> => {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      console.log(`Processing file: ${file.name}`);
      const arrayBuffer = await fileToArrayBuffer(file);
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    return await mergedPdf.save();
  };

  const processRotatePDF = async (file: File, angle: number): Promise<Uint8Array> => {
    console.log(`Rotating PDF by ${angle} degrees`);
    const arrayBuffer = await fileToArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = pdf.getPages();
    
    // Apply rotation to all pages
    pages.forEach(page => {
      const currentRotation = page.getRotation().angle || 0;
      const newRotation = (currentRotation + angle) % 360;
      page.setRotation(degrees(newRotation));
    });
    
    return await pdf.save();
  };

  const processImageToPDF = async (files: File[]): Promise<Uint8Array> => {
    const pdf = await PDFDocument.create();
    
    for (const file of files) {
      console.log(`Converting image to PDF: ${file.name}`);
      const arrayBuffer = await fileToArrayBuffer(file);
      
      let image;
      if (file.type === 'image/png') {
        image = await pdf.embedPng(arrayBuffer);
      } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        image = await pdf.embedJpg(arrayBuffer);
      } else {
        throw new Error(`Unsupported image format: ${file.type}`);
      }
      
      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }
    
    return await pdf.save();
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      let processedBytes: Uint8Array;
      let filename = '';
      
      switch (toolName) {
        case 'Merge PDFs':
          processedBytes = await processMergePDF(files);
          filename = 'merged-pdf.pdf';
          break;
        case 'Rotate PDF':
          processedBytes = await processRotatePDF(files[0], rotationAngle);
          filename = 'rotated-pdf.pdf';
          break;
        case 'Image to PDF':
          processedBytes = await processImageToPDF(files);
          filename = 'images-to-pdf.pdf';
          break;
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
      
      const blob = new Blob([processedBytes], { type: 'application/pdf' });
      
      const firstBytes = processedBytes.slice(0, 5);
      const header = new TextDecoder().decode(firstBytes);
      console.log('PDF header:', header);
      
      if (!header.startsWith('%PDF-')) {
        throw new Error('Generated file does not have valid PDF header');
      }
      
      const url = URL.createObjectURL(blob);
      setProcessedFileUrl(url);
      setIsComplete(true);
      
      console.log('File processing completed successfully');
      
    } catch (error) {
      console.error('File processing error:', error);
      setProcessingError(error instanceof Error ? error.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedFileUrl) return;
    
    const link = document.createElement('a');
    link.href = processedFileUrl;
    
    let filename = `processed-${toolName.toLowerCase().replace(/\s+/g, '-')}`;
    let extension = '.pdf';
    
    link.download = filename + extension;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('File download initiated');
  };

  const handleProcessAnother = () => {
    setFiles([]);
    setIsComplete(false);
    setProcessingError(null);
    if (processedFileUrl) {
      URL.revokeObjectURL(processedFileUrl);
      setProcessedFileUrl(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{toolName}</h1>
          <p className="text-gray-600">{toolDescription}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8">
          {!isComplete ? (
            <>
              <FileUpload
                accept={fileAccept}
                multiple={multiple}
                onFileDrop={handleFileDrop}
                title={`Upload your ${multiple ? 'files' : 'file'}`}
                description={`Select ${multiple ? 'one or more files' : 'a file'} to process`}
              />

              {/* File List with Reordering (for multiple files) */}
              {files.length > 0 && multiple && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Files to Process ({files.length})
                  </h3>
                  <div className="space-y-3">
                    {files.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-lg p-4 space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900 break-all">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 self-end sm:self-auto">
                          <button
                            onClick={() => moveFile(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => moveFile(index, 'down')}
                            disabled={index === files.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeFile(index)}
                            className="px-2 py-1 text-xs text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Panel */}
              {files.length > 0 && children && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  {children}
                </div>
              )}

              {/* Error Display */}
              {processingError && (
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <div className="text-red-600">
                      <h3 className="font-medium">Error</h3>
                      <p className="text-sm mt-1">{processingError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Process Button */}
              {files.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Process ${files.length} ${files.length === 1 ? 'file' : 'files'}`
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Success State */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your file is ready!
              </h3>
              <div className="text-gray-600 mb-6 space-y-2">
                {toolName === 'Rotate PDF' ? (
                  <p>PDF rotated {rotationAngle}° successfully.</p>
                ) : (
                  <p>Processing completed successfully. The file is ready for download.</p>
                )}
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Download PDF File
                </button>
                <button
                  onClick={handleProcessAnother}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Process Another File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolWorkspace;
