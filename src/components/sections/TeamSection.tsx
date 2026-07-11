import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { team } from "../../constants/team";

export const TeamSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="team" ref={ref} className="py-32 bg-[#0A0900]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}>
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-mono mb-4">
            The Builders
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#F5F0E8] mb-4">
            Four builders.<br />
            <span className="text-[#C9A84C]">One mission.</span>
          </h2>
          <p className="text-[#F5F0E8]/30 max-w-lg mx-auto leading-relaxed">
            A dedicated team building a platform to serve real farmers.
            Driven by a shared belief that technology can improve lives and transform agriculture.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.75 }}
              whileHover={{ y: -6 }}
              className="bg-[#111008] border border-[#2A2720] rounded-2xl p-8 transition-all duration-300"
              style={{ boxShadow: "0 6px 50px rgba(0,0,0,0.45)" }}
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-semibold"
                  style={{
                    background: `${member.color}18`,
                    border: `2px solid ${member.color}45`,
                    color: member.color,
                  }}
                >
                  {member.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-[#F5F0E8] font-semibold text-lg leading-tight">
                    {member.name}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: member.color }}>
                    {member.role}
                  </p>
                </div>
              </div>

              <p className="text-[#F5F0E8]/40 text-sm leading-relaxed mb-5">
                {member.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {member.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#2A2720] text-[#F5F0E8]/25"
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
