import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { DiscoveryEngine, type ConceptNode, type Recommendation } from "../../services/DiscoveryEngine";
import { Typography } from "../primitives/Typography";
import { GlassPanel } from "../primitives/GlassPanel";
import { Button } from "../primitives/Button";
import { Container } from "../primitives/Container";

export const KnowledgeGraphSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  
  const [activeNode, setActiveNode] = useState<ConceptNode | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [modalNode, setModalNode] = useState<ConceptNode | null>(null);
  const [isStartingLesson, setIsStartingLesson] = useState(false);

  useEffect(() => {
    // Initial state setup
    const allNodes = DiscoveryEngine.getAllNodes();
    if (allNodes.length > 0) {
      setActiveNode(allNodes[0]);
    }
  }, []);

  useEffect(() => {
    if (activeNode) {
      // Simulate network request to discovery engine
      const recs = DiscoveryEngine.getRecommendations();
      // For demo purposes, we make sure the current node isn't recommended again
      setRecommendations(recs.filter(r => r.concept.id !== activeNode.id).slice(0, 3));
    }
  }, [activeNode]);

  const handleNodeClick = (node: ConceptNode) => {
    setActiveNode(node);
    setModalNode(node);
    setIsStartingLesson(false);
  };

  const handleBeginLesson = () => {
    setIsStartingLesson(true);
    setTimeout(() => {
      alert("This would transition you into the interactive 3D lesson module for " + modalNode?.title);
      setModalNode(null);
      setIsStartingLesson(false);
    }, 800);
  };

  return (
    <section ref={ref} className="relative bg-transparent overflow-hidden">
      <Container maxWidth="lg" paddingY="xl">
        
        {/* Header */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}>
          <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4" color="gold">
            Discovery Engine
          </Typography>
          <div className="mb-4">
            <Typography variant="display-2">
              Learn through <span className="text-[var(--color-knowledge-gold)] italic">exploration.</span>
            </Typography>
          </div>
          <Typography variant="body-md" color="secondary" className="max-w-xl mx-auto">
            Not a fixed syllabus. AgriCompass adapts to your learning profile and recommends the exact knowledge you need next.
          </Typography>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center max-w-5xl mx-auto">
          
          {/* Active Node Detail */}
          <GlassPanel
            as={motion.div}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ ...LAYOUT_SPRING, delay: 0.2 }}
            className="w-full lg:w-1/3 p-8 min-h-[300px] flex flex-col cursor-pointer hover:border-[var(--color-knowledge-gold)]/30 transition-colors will-change-transform"
            onClick={() => activeNode && setModalNode(activeNode)}
          >
            <Typography variant="micro" color="gold" className="opacity-50 mb-4">
              Current Concept
            </Typography>
            <AnimatePresence mode="wait">
              {activeNode && (
                <motion.div 
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={LAYOUT_SPRING}
                  className="flex-1 flex flex-col"
                >
                  <div className="mb-4">
                    <Typography variant="heading-1" color="primary">{activeNode.title}</Typography>
                  </div>
                  <div className="mb-6">
                    <Typography variant="caption" color="tertiary">{activeNode.description}</Typography>
                  </div>
                  
                  <div className="mt-auto">
                    <Button variant="primary" className="w-full py-3 !text-sm pointer-events-none">
                      Practice & Reflect
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>

          {/* Connected Graph */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ ...LAYOUT_SPRING, delay: 0.3 }}
            className="w-full lg:w-2/3 flex flex-col gap-4"
          >
            <Typography variant="micro" color="muted" className="pl-4">
              Recommended Next Steps
            </Typography>
            
            <AnimatePresence mode="popLayout">
              {recommendations.map((rec, i) => (
                <GlassPanel
                  as={motion.button}
                  key={rec.concept.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
                  onClick={() => handleNodeClick(rec.concept)}
                  interaction="hover"
                  className="w-full text-left p-5 group flex items-center justify-between will-change-transform"
                >
                  <div className="flex-1">
                    <Typography variant="heading-2" color="gold" className="mb-1 group-hover:text-white transition-colors">
                      {rec.concept.title}
                    </Typography>
                    <Typography variant="caption" color="muted" className="mb-3 block">
                      {rec.concept.description}
                    </Typography>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--color-earth-black)] border border-[var(--color-glass-border,rgba(255,255,255,0.06))] inline-flex">
                      <span className="text-[9px] font-mono text-[var(--color-growth-green)] uppercase tracking-widest">Why?</span>
                      <span className="text-[var(--color-text-tertiary)] text-[10px] italic">{rec.reason}</span>
                    </div>
                  </div>
                  
                  <div className="ml-4 w-12 h-12 rounded-full border border-[var(--color-glass-border,rgba(255,255,255,0.06))] flex items-center justify-center text-[var(--color-text-tertiary)] group-hover:bg-[var(--color-knowledge-gold)] group-hover:text-[var(--color-earth-black)] transition-all">
                    →
                  </div>
                </GlassPanel>
              ))}
            </AnimatePresence>
            
          </motion.div>
        </div>
      </Container>

      {/* Interactive Learning Card Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {modalNode && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40"
              onClick={() => setModalNode(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 40 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl overflow-hidden bg-[#0A0900] border border-[var(--color-knowledge-gold)]/20 rounded-2xl shadow-2xl"
              >
                {/* Subtle top glow */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-knowledge-gold)]/50 to-transparent"></div>
                
                <button
                  onClick={() => setModalNode(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-xl leading-none">&times;</span>
                </button>
  
                <div className="p-8 md:p-10">
                  <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-3 block" color="gold">
                    Learning Module Preview
                  </Typography>
                  <Typography variant="heading-1" className="mb-4" color="primary">
                    {modalNode.title}
                  </Typography>
                  
                  <div className="h-[1px] w-full bg-[var(--color-glass-border,rgba(255,255,255,0.06))] my-6"></div>
                  
                  <Typography variant="body-md" color="secondary" className="mb-8 leading-relaxed">
                    <span className="font-medium text-white">Summary: </span>{modalNode.description}
                    <br/><br/>
                    <span className="italic opacity-70">
                      This is an interactive preview. In the full application, this card will expand into a complete lesson containing interactive quizzes, detailed scientific explanations, and actionable farming tasks tailored to your farm's data.
                    </span>
                  </Typography>
                  
                  <div className="flex justify-end gap-4 mt-8">
                    <Button variant="ghost" onClick={() => setModalNode(null)} className="px-6 py-2 border border-white/10 text-white/70">
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleBeginLesson} className="px-6 py-2">
                      {isStartingLesson ? "Loading..." : "Begin Lesson"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </section>
  );
};
