import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpItem, scaleOnHover } from "@/lib/animations";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeatureShowcase from "@/components/shared/FeatureShowcase";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Brain, Database, FileText, BarChart4, MessageSquare, Users, Lightbulb, Sparkles } from "lucide-react";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Index page rendered"); // Debug log
  }, []);

  const features = [
    {
      title: "Multi-Agent Analysis",
      description: "Leverage specialized AI agents for comprehensive qualitative analysis across multiple methodologies simultaneously.",
      icon: <Brain className="h-8 w-8" />,
    },
    {
      title: "Interactive Insights",
      description: "Explore AI-generated insights through intuitive visualizations and interactive decision trees.",
      icon: <BarChart4 className="h-8 w-8" />,
    },
    {
      title: "Methodological Flexibility",
      description: "Choose from grounded theory, phenomenology, discourse analysis, and more for your research needs.",
      icon: <FileText className="h-8 w-8" />,
    },
    {
      title: "Collaborative Research",
      description: "Invite team members to collaborate on projects and validate AI-driven insights together.",
      icon: <Users className="h-8 w-8" />,
    },
    {
      title: "Theoretical Frameworks",
      description: "Apply diverse theoretical lenses like feminist theory or critical race theory to your analysis.",
      icon: <Lightbulb className="h-8 w-8" />,
    },
    {
      title: "Agent Debates",
      description: "Witness AI agents debate interpretations to strengthen validity and expose different perspectives.",
      icon: <MessageSquare className="h-8 w-8" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-20 md:pb-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-pattern opacity-50 -z-10"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity:.01, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
              >
                <div className="inline-block mb-6">
                  <div className="flex items-center space-x-2 bg-secondary/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-foreground/80">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Introducing QualAgents — Revolutionary Qualitative Research</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.42, 0, 0.58, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-balance"
              >
                The Future of <span className="text-primary">Qualitative Research</span> is Here
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.42, 0, 0.58, 1] }}
                className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance"
              >
                Harness the power of multiple AI agents working in concert to analyze your qualitative data through diverse methodological lenses.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.42, 0, 0.58, 1] }}
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Button asChild size="lg" className="rounded-full px-8 h-12">
                  <Link to="/dashboard">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12">
                  <a href="#features">Learn More</a>
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Hero Visual Element */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.42, 0, 0.58, 1] }}
            className="max-w-6xl mx-auto mt-16 md:mt-24 relative z-10"
          >
            <div className="glass-card overflow-hidden p-3 shadow-glass">
              <div className="bg-background/60 backdrop-blur-sm rounded-lg h-[300px] md:h-[450px] flex items-center justify-center border border-border/50">
                <div className="text-center p-8">
                  <Database className="h-16 w-16 text-primary mx-auto mb-6 opacity-80" />
                  <h3 className="text-2xl font-medium mb-3">AI-Powered Qualitative Analysis</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Interface preview will showcase AI agents collaborating on real-time analysis.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -top-6 -left-6 h-24 w-24 bg-accent/20 rounded-full blur-3xl"></div>
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 px-6 bg-secondary/30 relative">
          <FeatureShowcase
            title="Revolutionary Qualitative Research Platform"
            subtitle="Our multi-agent approach brings unprecedented depth and perspective to your qualitative analysis"
            features={features}
          />
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight"
              >
                How It Works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1], delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                Experience a seamless workflow designed for qualitative researchers
              </motion.p>
            </div>
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  step: "01",
                  title: "Upload Your Data",
                  description: "Import interview transcripts, field notes, documents, or any unstructured text data."
                },
                {
                  step: "02",
                  title: "Select AI Agents",
                  description: "Choose the methodological approaches and theoretical frameworks for your analysis."
                },
                {
                  step: "03",
                  title: "Explore Insights",
                  description: "Review multi-perspective findings, validate insights, and export your results."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeUpItem}
                  className="relative"
                >
                  <div className="glass-card p-8 h-full">
                    <div className="text-primary/20 text-6xl font-bold absolute top-6 right-8">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-medium mb-3 relative z-10">{item.title}</h3>
                    <p className="text-muted-foreground relative z-10">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="glass-card p-12 text-center relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
                  Ready to Transform Your Research?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join researchers who are leveraging multiple AI agents to gain deeper insights from their qualitative data.
                </p>
                <motion.div
                  {...scaleOnHover}
                >
                  <Button asChild size="lg" className="rounded-full px-8 h-12">
                    <Link to="/dashboard">Start Your First Project</Link>
                  </Button>
                </motion.div>
              </div>
              
              {/* Background decorative elements */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
