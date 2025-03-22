import React, { useState } from "react";
import { Upload, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { FileWithPreview } from "@/types/data-upload";
import FilePreview from "./FilePreview";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "text/csv", 
  "text/plain", 
  "application/pdf", 
  "application/json",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword" // .doc
];

interface FileUploadSectionProps {
  uploadedFiles: FileWithPreview[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
  isProcessing: boolean;
  onProcessFiles: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  uploadedFiles,
  setUploadedFiles,
  isProcessing,
  onProcessFiles
}) => {
  const [currentTag, setCurrentTag] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles: FileWithPreview[] = [];
    
    Array.from(e.target.files).forEach(file => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} exceeds the 10MB size limit.`
        });
        return;
      }
      
      // Check file type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Unsupported file type",
          description: `${file.name} has an unsupported file type.`
        });
        return;
      }
      
      // Create preview for text files
      let preview: string | null = null;
      
      if (file.type === "text/plain" || file.type === "text/csv" || file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const fileIndex = newFiles.findIndex(f => f.file.name === file.name);
          
          if (fileIndex !== -1) {
            const updatedFiles = [...newFiles];
            updatedFiles[fileIndex].preview = text.substring(0, 200) + (text.length > 200 ? "..." : "");
            setUploadedFiles(prev => [...prev.filter(f => f.file.name !== file.name), ...updatedFiles]);
          }
        };
        reader.readAsText(file);
      }
      
      newFiles.push({
        file,
        preview,
        tags: [],
        selected: false
      });
    });
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Reset the input value to allow uploading the same file again
    e.target.value = "";
  };
  
  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.file.name !== fileName));
  };
  
  const toggleFileSelection = (fileName: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.file.name === fileName 
          ? { ...file, selected: !file.selected } 
          : file
      )
    );
  };
  
  const addTagToSelected = () => {
    if (!currentTag.trim()) return;
    
    setUploadedFiles(prev => 
      prev.map(file => 
        file.selected 
          ? { ...file, tags: [...new Set([...file.tags, currentTag.trim()])] } 
          : file
      )
    );
    
    setCurrentTag("");
  };
  
  const removeTag = (fileName: string, tagToRemove: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.file.name === fileName 
          ? { ...file, tags: file.tags.filter(tag => tag !== tagToRemove) } 
          : file
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Research Data</CardTitle>
        <CardDescription>
          Upload your research data files for analysis. Supported formats: CSV, TXT, PDF, JSON, DOC, DOCX.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Drag and drop files here, or
          </p>
          <Input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".csv,.txt,.pdf,.json,.doc,.docx"
          />
          <Label htmlFor="file-upload">
            <Button variant="outline" className="mt-2" onClick={() => document.getElementById("file-upload")?.click()}>
              Browse Files
            </Button>
          </Label>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Max file size: 10MB
          </p>
        </div>
        
        {uploadedFiles.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-medium">Uploaded Files</h3>
              <div className="space-x-2">
                <Input
                  type="text"
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  placeholder="Add tag..."
                  className="w-32 h-8 inline-block"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTagToSelected}
                  disabled={!currentTag.trim()}
                >
                  <Tag className="h-4 w-4 mr-1" />
                  Tag
                </Button>
              </div>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto border rounded-md p-2">
              {uploadedFiles.map((file, index) => (
                <FilePreview
                  key={`${file.file.name}-${index}`}
                  file={file}
                  onRemove={removeFile}
                  onToggleSelection={toggleFileSelection}
                  onRemoveTag={removeTag}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setUploadedFiles([])}
          disabled={uploadedFiles.length === 0 || isProcessing}
        >
          Clear All
        </Button>
        <Button
          onClick={onProcessFiles}
          disabled={uploadedFiles.length === 0 || isProcessing}
        >
          {isProcessing ? "Processing..." : "Process Files"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploadSection;
