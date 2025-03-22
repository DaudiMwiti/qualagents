
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import DataUploadForm from "@/components/data/DataUploadForm";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const DataUpload = () => {
  const { projectId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

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
                Upload & Preprocess Data
              </h1>
            </div>
            
            <p className="text-muted-foreground mb-8 max-w-3xl">
              Upload your research data files for agent analysis. You can organize, tag, and preprocess your data before analysis.
            </p>
            
            <DataUploadForm projectId={projectId || ""} />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default DataUpload;
