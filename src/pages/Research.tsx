import { RESEARCH_DATA } from "../data/research";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export function Research() {
  return (
    <div className="min-h-screen bg-bg text-fg pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-16 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-6 uppercase"
          >
            Research <span className="text-accent">Lab</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-fg/60 font-mono leading-relaxed"
          >
            Exploring the landscape of modern presentation techniques, visual philosophies, and the technical stack that powers them.
          </motion.p>
        </header>

        <div className="space-y-24">
          {RESEARCH_DATA.map((category, categoryIndex) => (
            <section key={category.id} className="relative">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-border pb-4">
                 <div>
                    <h2 className="text-3xl font-display uppercase tracking-wide flex items-center gap-3">
                      <span className="text-accent">0{categoryIndex + 1}.</span> {category.title}
                    </h2>
                    <p className="font-mono text-sm text-fg/60 mt-2 max-w-xl">{category.description}</p>
                 </div>
              </div>
             
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: itemIndex * 0.1 }}
                      className={clsx(
                        "group relative overflow-hidden bg-card border-2 border-border p-6",
                        "hover:border-accent transition-colors duration-300",
                        "flex flex-col h-full"
                      )}
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                        <Icon size={120} />
                      </div>

                      <div className="mb-6">
                        <div className="w-12 h-12 bg-accent/10 flex items-center justify-center rounded-lg border border-accent/20 mb-4 group-hover:bg-accent group-hover:text-bg transition-colors duration-300">
                          <Icon size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                        <p className="text-fg/70 leading-relaxed text-sm">{item.description}</p>
                      </div>

                      <div className="mt-auto pt-6 flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 bg-bg border border-border text-[10px] font-mono uppercase tracking-wider text-fg/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        
        <div className="mt-24 p-8 border-2 border-dashed border-border rounded-lg bg-card/50 text-center">
            <p className="font-mono text-fg/50">
                Data compiled by <span className="text-accent">Lead Research Assistant</span> & <span className="text-accent">Presentation Architect</span>
            </p>
        </div>
      </div>
    </div>
  );
}
