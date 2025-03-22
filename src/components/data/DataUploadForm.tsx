
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FileUploadSection from "./FileUploadSection";
import TextPreprocessingSection from "./TextPreprocessingSection";
import { 
  FileWithPreview, 
  PreprocessingFormValues,
  PREPROCESSING_MIN_CHUNK_SIZE,
  PREPROCESSING_MAX_CHUNK_SIZE,
  PREPROCESSING_MIN_OVERLAP,
  PREPROCESSING_MAX_OVERLAP
} from "@/types/data-upload";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileCheck, Settings } from "lucide-react";

interface DataUploadFormProps {
  projectId: string;
}

const preprocessingSchema = z.object({
  chunkSize: z.string()
    .refine(val => {
      const num = parseInt(val, 10);
      return !isNaN(num);
    }, "Must be a valid number")
    .refine(val => {
      const num = parseInt(val, 10);
      return num >= PREPROCESSING_MIN_CHUNK_SIZE;
    }, `Must be at least ${PREPROCESSING_MIN_CHUNK_SIZE} characters`)
    .refine(val => {
      const num = parseInt(val, 10);
      return num <= PREPROCESSING_MAX_CHUNK_SIZE;
    }, `Must be at most ${PREPROCESSING_MAX_CHUNK_SIZE} characters`),
  overlap: z.string()
    .refine(val => {
      const num = parseInt(val, 10);
      return !isNaN(num);
    }, "Must be a valid number")
    .refine(val => {
      const num = parseInt(val, 10);
      return num >= PREPROCESSING_MIN_OVERLAP;
    }, `Must be at least ${PREPROCESSING_MIN_OVERLAP} characters`)
    .refine(val => {
      const num = parseInt(val, 10);
      return num <= PREPROCESSING_MAX_OVERLAP;
    }, `Must be at most ${PREPROCESSING_MAX_OVERLAP} characters`),
  cleaningOptions: z.array(z.string()),
  customRegex: z.string().optional(),
});

const DataUploadForm: React.FC<DataUploadFormProps> = ({ projectId }) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [processedFiles, setProcessedFiles] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const form = useForm<PreprocessingFormValues>({
    resolver: zodResolver(preprocessingSchema),
    defaultValues: {
      chunkSize: "1000",
      overlap: "200",
      cleaningOptions: ["removeExtraSpaces", "removeUrls"],
      customRegex: ""
    }
  });
  
  // Restore processed files from localStorage if any
  useEffect(() => {
    const savedFiles = localStorage.getItem(`project_${projectId}_processed_files`);
    if (savedFiles) {
      try {
        const files = JSON.parse(savedFiles);
        setProcessedFiles(files);
      } catch (e) {
        console.error("Error restoring processed files:", e);
      }
    }
  }, [projectId]);
  
  const processFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No files to process",
        description: "Please upload at least one file."
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would send the files to the server for processing
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract file names for processed files list
      const fileNames = uploadedFiles.map(file => file.file.name);
      
      // Save to localStorage for demo persistence
      const existingFiles = [...processedFiles];
      const newFiles = [...new Set([...existingFiles, ...fileNames])];
      setProcessedFiles(newFiles);
      localStorage.setItem(`project_${projectId}_processed_files`, JSON.stringify(newFiles));
      
      // Also store a count in a project document count key
      localStorage.setItem(`project_${projectId}_document_count`, newFiles.length.toString());
      
      toast({
        title: "Files processed successfully",
        description: `${uploadedFiles.length} files are ready for analysis.`
      });
      
      // Move to the preprocessing tab
      setActiveTab("preprocess");
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: "There was an error processing your files."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePreprocessSubmit = async (data: PreprocessingFormValues) => {
    setIsProcessing(true);
    
    try {
      console.log("Preprocessing with settings:", data);
      console.log("Files:", processedFiles);
      
      // In a real implementation, this would send the preprocessing settings and files to the server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store preprocessing settings in localStorage
      localStorage.setItem(`project_${projectId}_preprocessing`, JSON.stringify(data));
      
      toast({
        title: "Preprocessing complete",
        description: "Your data is now ready for agent analysis."
      });
      
      // Navigate back to the project page
      navigate(`/project/${projectId}`);
      
    } catch (error) {
      console.error("Error preprocessing:", error);
      toast({
        variant: "destructive",
        title: "Preprocessing failed",
        description: "There was an error preprocessing your data."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="preprocess">Text Processing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <FileUploadSection 
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            isProcessing={isProcessing}
            onProcessFiles={processFiles}
          />
          
          {processedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCheck className="mr-2 h-5 w-5 text-green-500" />
                  Previously Processed Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {processedFiles.map((fileName, index) => (
                    <li key={index} className="text-sm flex items-center">
                      <FileCheck className="mr-2 h-4 w-4 text-green-500" />
                      {fileName}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab("preprocess")}
                  className="mt-2"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Preprocessing
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="preprocess" className="space-y-6">
          <TextPreprocessingSection 
            form={form}
            isProcessing={isProcessing}
            onSubmit={form.handleSubmit(handlePreprocessSubmit)}
            onBackClick={() => setActiveTab("upload")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataUploadForm;
