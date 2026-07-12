import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { team } from "../../constants/team";

export const TeamSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="team" ref={ref} className="relative py-32 bg-transparent z-10">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}>
          <p className="text-[#E5D08F] text-xs tracking-[0.3em] uppercase font-mono mb-4">
            The Builders
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F5F0E8] mb-4">
            Four students.<br />
            <span className="text-[#E5D08F]">One mission.</span>
          </h2>
          <p className="text-[#F5F0E8]/40 max-w-lg mx-auto leading-relaxed">
            A final-year engineering project that became a platform serving real farmers.
            Built with genuine curiosity and a shared belief that technology can improve lives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-4xl mx-auto items-center">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
              className="premium-card p-10 text-center flex flex-col items-center group w-full"
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
                  <p className="text-[#F5F0E8] font-semibold text-xl leading-tight">
                    {member.name}
                  </p>
                  <p className="text-sm mt-1" style={{ color: member.color }}>
                    {member.role}
                  </p>
                </div>
              </div>

              <p className="text-[#F5F0E8]/40 text-sm leading-relaxed mb-5">
                {member.description}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {member.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-3 py-1.5 rounded-full border border-[#2A2720] text-[#F5F0E8]/40 bg-[#1A0F05]/50"
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
                className="inline-flex items-center gap-2 text-xs font-mono text-[#F5F0E8]/28
                           border border-[#2A2720] px-3.5 py-2 rounded-lg transition-all"
              >
                LinkedIn Profile →
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
