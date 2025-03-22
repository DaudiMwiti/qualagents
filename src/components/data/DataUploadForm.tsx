import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Trash2, Tag, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type FileWithPreview = {
  file: File;
  preview: string | null;
  tags: string[];
  selected: boolean;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "text/csv", 
  "text/plain", 
  "application/pdf", 
  "application/json",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword" // .doc
];

const DataUploadForm = ({ projectId }: { projectId: string }) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [chunkSize, setChunkSize] = useState(1000);
  const [activeTab, setActiveTab] = useState("upload");
  
  const form = useForm({
    defaultValues: {
      chunkSize: "1000",
      overlap: "200",
      cleaningOptions: ["removeExtraSpaces", "removeUrls"],
      customRegex: ""
    }
  });
  
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
  
  const handlePreprocessSubmit = form.handleSubmit(async (data) => {
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
  });
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="preprocess">Text Processing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
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
                      <div 
                        key={`${file.file.name}-${index}`}
                        className={`border rounded-md p-3 ${file.selected ? "bg-secondary/40" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-2">
                            <input
                              type="checkbox"
                              checked={file.selected}
                              onChange={() => toggleFileSelection(file.file.name)}
                              className="mt-1"
                            />
                            <div>
                              <p className="font-medium truncate">{file.file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.file.size / 1024).toFixed(1)} KB • {file.file.type}
                              </p>
                              {file.preview && (
                                <div className="text-xs text-gray-600 mt-1 bg-gray-100 dark:bg-gray-800 rounded p-1.5 max-h-24 overflow-y-auto">
                                  <pre className="whitespace-pre-wrap">{file.preview}</pre>
                                </div>
                              )}
                              {file.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {file.tags.map((tag, tagIndex) => (
                                    <Badge 
                                      key={tagIndex} 
                                      variant="secondary"
                                      className="text-xs flex items-center gap-1"
                                    >
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => removeTag(file.file.name, tag)}
                                        className="text-xs hover:text-destructive transition-colors"
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.file.name)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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
                onClick={processFiles}
                disabled={uploadedFiles.length === 0 || isProcessing}
              >
                {isProcessing ? "Processing..." : "Process Files"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preprocess" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Preprocessing</CardTitle>
              <CardDescription>
                Configure how your text data should be processed before analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={handlePreprocessSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="chunkSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chunk Size (characters)</FormLabel>
                          <FormControl>
                            <Input type="number" min="100" max="10000" {...field} />
                          </FormControl>
                          <FormDescription>
                            How large each text segment should be
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="overlap"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chunk Overlap</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="1000" {...field} />
                          </FormControl>
                          <FormDescription>
                            Character overlap between chunks
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="cleaningOptions"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Text Cleaning Options</FormLabel>
                          <FormDescription>
                            Select how to clean the text before processing
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {[
                            { id: "removeExtraSpaces", label: "Remove Extra Whitespace" },
                            { id: "removeUrls", label: "Remove URLs" },
                            { id: "removeEmails", label: "Remove Email Addresses" },
                            { id: "removePunctuation", label: "Remove Punctuation" },
                            { id: "convertToLowercase", label: "Convert to Lowercase" },
                            { id: "removeStopwords", label: "Remove Common Stopwords" },
                          ].map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="cleaningOptions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <input
                                        type="checkbox"
                                        checked={field.value?.includes(option.id)}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          if (checked) {
                                            field.onChange([...field.value, option.id]);
                                          } else {
                                            field.onChange(
                                              field.value?.filter(
                                                (value: string) => value !== option.id
                                              )
                                            );
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customRegex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Regex Pattern</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. \d{4}-\d{2}-\d{2}" {...field} />
                        </FormControl>
                        <FormDescription>
                          Optional: regex pattern to extract or remove specific content
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("upload")}>
                      Back to Upload
                    </Button>
                    <Button type="submit" disabled={isProcessing}>
                      {isProcessing ? (
                        "Processing..."
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save & Continue
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataUploadForm;
