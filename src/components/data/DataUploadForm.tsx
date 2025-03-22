"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { FileText, Upload, CheckCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface DataUploadFormProps {
  projectId: string;
}

const DataUploadForm = ({ projectId }: DataUploadFormProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreprocessing, setIsPreprocessing] = useState(false);
  const [preprocessingProgress, setPreprocessingProgress] = useState(0);
  const [projectName, setProjectName] = useState("My Project");
  const [projectDescription, setProjectDescription] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileRemove = (index: number) => {
    setUploadedFiles((files) => files.filter((_, i) => i !== index));
  };

  const handleFileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Files uploaded successfully",
        description: `${uploadedFiles.length} files have been uploaded.`,
        variant: "default",
      });
      
      setStep(2);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      });
      console.error("Error uploading files:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreprocessingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPreprocessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Preprocessing complete",
        description: "Text preprocessing has been completed successfully.",
        variant: "default",
      });
      
      setStep(3);
    } catch (error) {
      toast({
        title: "Preprocessing failed",
        description: "There was an error preprocessing your data. Please try again.",
        variant: "destructive",
      });
      console.error("Error preprocessing:", error);
    } finally {
      setIsPreprocessing(false);
    }
  };

  useEffect(() => {
    if (isPreprocessing) {
      const interval = setInterval(() => {
        setPreprocessingProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      setPreprocessingProgress(0);
    }
  }, [isPreprocessing]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Data Upload for Project: {projectId}</h1>
      
      {step === 1 && (
        <form onSubmit={handleFileSubmit} className="space-y-4">
          <div {...getRootProps()} className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${isDragActive ? 'border-primary' : 'border-border'}`}>
            <input {...getInputProps()} />
            <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {isDragActive ? "Drop the files here..." : "Drag 'n' drop some files here, or click to select files"}
            </p>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
              <ul>
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
          
          <Button type="submit" disabled={isSubmitting || uploadedFiles.length === 0} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Files"
            )}
          </Button>
        </form>
      )}
      
      {step === 2 && (
        <form onSubmit={handlePreprocessingSubmit} className="space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Text Preprocessing</h2>
            <p className="text-sm text-muted-foreground">
              Configure the text preprocessing steps for your uploaded documents.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="remove-stopwords">
              <Input type="checkbox" id="remove-stopwords" className="mr-2" />
              Remove Stopwords
            </Label>
            <Label htmlFor="stemming">
              <Input type="checkbox" id="stemming" className="mr-2" />
              Apply Stemming
            </Label>
            <Label htmlFor="lemmatization">
              <Input type="checkbox" id="lemmatization" className="mr-2" />
              Apply Lemmatization
            </Label>
          </div>
          
          <Button type="submit" disabled={isPreprocessing} className="w-full">
            {isPreprocessing ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preprocessing...
              </div>
            ) : (
              "Start Preprocessing"
            )}
          </Button>
          
          {isPreprocessing && (
            <Progress value={preprocessingProgress} className="mt-4" />
          )}
        </form>
      )}
      
      {step === 3 && (
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
          <h2 className="text-lg font-semibold">Upload Complete!</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your data has been successfully uploaded and preprocessed.
          </p>
          <Button onClick={() => setStep(1)}>Upload More Files</Button>
        </div>
      )}
    </div>
  );
};

export default DataUploadForm;
