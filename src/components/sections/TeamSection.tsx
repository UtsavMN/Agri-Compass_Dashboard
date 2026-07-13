import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { team } from "../../constants/team";
import { Typography } from "../primitives/Typography";
import { GlassPanel } from "../primitives/GlassPanel";
import { Container } from "../primitives/Container";

export const TeamSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin:"-80px" });

  return (
    <section id="team" ref={ref} className="relative bg-transparent z-10">
      <Container maxWidth="lg" paddingY="xl">

        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}>
          <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4" color="gold">
            The Builders
          </Typography>
          <div className="mb-4">
            <Typography variant="display-2">
              Four students.<br />
              <span className="text-[var(--color-knowledge-gold)]">One mission.</span>
            </Typography>
          </div>
          <Typography variant="body-md" color="secondary" className="max-w-lg mx-auto">
            A final-year engineering project that became a platform serving real farmers.
            Built with genuine curiosity and a shared belief that technology can improve lives.
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 max-w-4xl mx-auto items-center">
          {team.map((member, i) => (
            <GlassPanel
              as={motion.div}
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
              className="p-8 text-center flex flex-col items-center group w-full"
              interaction="hover"
            >
              <div className="flex flex-col items-center gap-4 mb-6 relative z-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-semibold shadow-xl"
                  style={{
                    background: `${member.color}18`,
                    border: `2px solid ${member.color}45`,
                    color: member.color,
                  }}
                >
                  {member.avatar}
                </div>
                <div className="min-w-0 flex flex-col items-center">
                  <Typography variant="heading-2" color="primary">{member.name}</Typography>
                  <Typography variant="caption" style={{ color: member.color }} className="mt-1 block">{member.role}</Typography>
                </div>
              </div>

              <div className="mb-6">
                <Typography variant="body-md" color="secondary">{member.description}</Typography>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {member.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-3 py-1.5 rounded-full border border-[#2A2720] text-[#F5F0E8]/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <motion.a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ borderColor: `${member.color}50`, color: member.color }}
                className="inline-flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)]
                           border border-[var(--color-glass-border,rgba(255,255,255,0.06))] px-3.5 py-2 rounded-lg transition-all"
              >
                LinkedIn Profile →
              </motion.a>
            </GlassPanel>
          ))}
        </div>
      </Container>
    </section>
  );
};
