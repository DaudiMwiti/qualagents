
import { motion } from "framer-motion";
import { staggerContainer, fadeUpItem } from "@/lib/animations";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type FeatureShowcaseProps = {
  features: Feature[];
  title: string;
  subtitle: string;
};

const FeatureShowcase = ({ features, title, subtitle }: FeatureShowcaseProps) => {
  return (
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
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1], delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="features-grid"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeUpItem}
              className="glass-card relative overflow-hidden p-8 flex flex-col h-full"
            >
              <div className="mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
