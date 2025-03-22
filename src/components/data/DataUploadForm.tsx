
"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast as sonnerToast } from "sonner";

interface DataUploadFormProps {
  projectId: string;
  onUploadComplete?: (count: number) => void;
}

const DataUploadForm = ({ projectId, onUploadComplete }: DataUploadFormProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileRemove = (index: number) => {
    setUploadedFiles((files) => files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please add at least one file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    
    try {
      // Show upload started toast
      sonnerToast.loading("Uploading files...", {
        description: `Uploading ${uploadedFiles.length} files`,
        id: "upload-progress"
      });
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearInterval(progressInterval);
      setProgress(100);
      setIsUploading(false);
      
      // Update toast
      sonnerToast.success("Files uploaded successfully", {
        description: `${uploadedFiles.length} files have been uploaded.`,
        id: "upload-progress"
      });
      
      // Start background processing
      handleProcessing();
    } catch (error) {
      setIsUploading(false);
      sonnerToast.error("Upload failed", {
        description: "There was an error uploading your files. Please try again.",
        id: "upload-progress"
      });
      console.error("Error uploading files:", error);
    }
  };

  const handleProcessing = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Show processing toast
    sonnerToast.loading("Processing documents...", {
      description: "Your documents are being preprocessed for analysis.",
      id: "processing"
    });
    
    try {
      // Simulate processing time with progress
      const processingInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(processingInterval);
            return 100;
          }
          return newProgress;
        });
      }, 200);
      
      // Apply default preprocessing (stopword removal, stemming, lemmatization)
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(processingInterval);
      setProgress(100);
      
      sonnerToast.success("Processing complete", {
        description: "Your documents are ready for analysis.",
        id: "processing"
      });
      
      // Save document data to localStorage to simulate persistence
      localStorage.setItem(`project_${projectId}_documents`, JSON.stringify({
        count: uploadedFiles.length,
        names: uploadedFiles.map(f => f.name),
        processed: true,
        timestamp: new Date().toISOString()
      }));
      
      // Call the onUploadComplete callback if provided
      if (onUploadComplete) {
        onUploadComplete(uploadedFiles.length);
      }
      
      // Wait a moment before redirecting
      setTimeout(() => {
        // Redirect to project page with a query parameter to indicate successful upload
        navigate(`/project/${projectId}?upload=success`);
      }, 1000);
    } catch (error) {
      sonnerToast.error("Processing failed", {
        description: "There was an error preprocessing your data. Please try again.",
        id: "processing"
      });
      console.error("Error preprocessing:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>
      
      {!isUploading && !isProcessing && (
        <>
          <div {...getRootProps()} className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${isDragActive ? 'border-primary' : 'border-border'}`}>
            <input {...getInputProps()} />
            <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {isDragActive ? "Drop the files here..." : "Drag 'n' drop some files here, or click to select files"}
            </p>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Selected Files</h3>
              <ul className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="flex items-center justify-between py-2 px-4 rounded-md bg-secondary">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleFileRemove(index)}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <Alert className="mt-6">
            <AlertTitle>Documents will be preprocessed automatically</AlertTitle>
            <AlertDescription>
              Files will be automatically processed with standard text cleaning, including stopword removal, 
              stemming, and lemmatization for optimal analysis.
            </AlertDescription>
          </Alert>
          
          <div className="mt-6">
            <Button 
              onClick={handleUpload} 
              disabled={uploadedFiles.length === 0} 
              className="w-full"
            >
              Upload & Process Documents
            </Button>
          </div>
        </>
      )}
      
      {(isUploading || isProcessing) && (
        <div className="mt-4 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                {isUploading ? 'Uploading...' : 'Processing documents...'}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
          
          <div className="flex justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">
                {isUploading 
                  ? "Uploading your documents... Please wait." 
                  : "Processing your documents for analysis. This may take a moment..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataUploadForm;
