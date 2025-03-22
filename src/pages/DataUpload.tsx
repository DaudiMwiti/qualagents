
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import DataUploadForm from "@/components/data/DataUploadForm";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const DataUpload = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [hasExistingDocuments, setHasExistingDocuments] = useState(false);
  const [documentCount, setDocumentCount] = useState(0);
  
  useEffect(() => {
    if (projectId) {
      // Check for existing documents in this project
      const documentData = localStorage.getItem(`project_${projectId}_documents`);
      if (documentData) {
        try {
          const data = JSON.parse(documentData);
          setHasExistingDocuments(data && data.count > 0);
          setDocumentCount(data.count || 0);
        } catch (e) {
          console.error("Error parsing document data:", e);
        }
      }
    }
  }, [projectId]);

  const handleUploadComplete = (count: number) => {
    setDocumentCount(count);
    setHasExistingDocuments(count > 0);
    
    // Save the document count to localStorage
    if (projectId) {
      localStorage.setItem(`project_${projectId}_documents`, JSON.stringify({ count }));
    }
  };

  const handleClearDocuments = () => {
    if (projectId) {
      localStorage.removeItem(`project_${projectId}_documents`);
      setHasExistingDocuments(false);
      setDocumentCount(0);
    }
  };

  return (
    <PageTransition>
      <Navbar />
      
      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
          >
            <div className="flex items-center mb-6">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="mr-2 h-8 w-8"
              >
                <Link to={projectId ? `/project/${projectId}` : "/dashboard"}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl md:text-3xl font-semibold">
                Upload Research Data
              </h1>
            </div>
            
            <p className="text-muted-foreground mb-4 max-w-3xl">
              Upload your research data files for agent analysis. All documents will be automatically preprocessed for optimal analysis.
            </p>
            
            {hasExistingDocuments && (
              <Alert className="mb-6">
                <FileText className="h-4 w-4" />
                <AlertTitle>Existing Documents</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <span>You already have {documentCount} documents processed in this project.</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/project/${projectId}`)}
                    >
                      Return to Project
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleClearDocuments}
                    >
                      Upload New Documents
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {(!hasExistingDocuments || documentCount === 0) && (
              <DataUploadForm 
                projectId={projectId || ""} 
                onUploadComplete={handleUploadComplete}
              />
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default DataUpload;
