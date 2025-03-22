
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import FileUploadSection from "./FileUploadSection";
import TextPreprocessingSection from "./TextPreprocessingSection";
import { FileWithPreview, PreprocessingFormValues } from "@/types/data-upload";

interface DataUploadFormProps {
  projectId: string;
}

const DataUploadForm: React.FC<DataUploadFormProps> = ({ projectId }) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  
  const form = useForm<PreprocessingFormValues>({
    defaultValues: {
      chunkSize: "1000",
      overlap: "200",
      cleaningOptions: ["removeExtraSpaces", "removeUrls"],
      customRegex: ""
    }
  });
  
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
      console.log("Files:", uploadedFiles);
      
      // In a real implementation, this would send the preprocessing settings and files to the server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Preprocessing complete",
        description: "Your data is now ready for agent analysis."
      });
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
