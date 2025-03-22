
import React from "react";
import { Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileWithPreview } from "@/types/data-upload";

interface FilePreviewProps {
  file: FileWithPreview;
  onRemove: (fileName: string) => void;
  onToggleSelection: (fileName: string) => void;
  onRemoveTag: (fileName: string, tag: string) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  onToggleSelection,
  onRemoveTag,
}) => {
  return (
    <div 
      className={`border rounded-md p-3 ${file.selected ? "bg-secondary/40" : ""}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={file.selected}
            onChange={() => onToggleSelection(file.file.name)}
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
                      onClick={() => onRemoveTag(file.file.name, tag)}
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
          onClick={() => onRemove(file.file.name)}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FilePreview;
