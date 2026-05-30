import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 relative px-4 sm:px-6 lg:px-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden"
        >
          {/* Subtle grid pattern inside dark CTA banner */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          {/* Subtle blue glow behind text */}
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10 tracking-tight">
            Start Your Government Exam Journey Today
          </h2>
          <p className="text-slate-400 text-base md:text-lg mb-10 max-w-xl mx-auto relative z-10 leading-relaxed">
            Join thousands of successful candidates. Get access to premium study materials, mock tests, and your personal AI mentor.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10 max-w-md mx-auto">
            <button className="w-full bg-white hover:bg-slate-100 text-slate-950 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm text-sm">
              Create Free Account
            </button>
            <button className="w-full bg-transparent hover:bg-slate-800/40 text-white border border-slate-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm">
              Explore Exams <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
