
import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { PreprocessingFormValues } from "@/types/data-upload";

interface TextPreprocessingSectionProps {
  form: UseFormReturn<PreprocessingFormValues>;
  isProcessing: boolean;
  onSubmit: () => void;
  onBackClick: () => void;
}

const TextPreprocessingSection: React.FC<TextPreprocessingSectionProps> = ({
  form,
  isProcessing,
  onSubmit,
  onBackClick
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Preprocessing</CardTitle>
        <CardDescription>
          Configure how your text data should be processed before analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Button type="button" variant="outline" onClick={onBackClick}>
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
  );
};

export default TextPreprocessingSection;
