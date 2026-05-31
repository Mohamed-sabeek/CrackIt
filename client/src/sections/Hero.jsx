import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative pt-36 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50/50">
      {/* Subtle clean neutral grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Soft elegant mesh gradients for premium depth */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-purple-300/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/70 border border-blue-100/80 text-blue-700 font-medium text-xs mb-8 shadow-sm"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            New: AI Personal Mentor Available 24/7
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]"
          >
            Crack Government Exams with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-extrabold">AI-Powered</span> Learning
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto"
          >
            Start your TNPSC preparation journey with AI-powered learning, mock tests, quizzes, and smart performance tracking. More government exams coming soon.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20">
              Get Started
              <ArrowRight size={18} />
            </Link>
            <a href="#exams" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm no-underline">
              <Play size={16} fill="currentColor" className="text-slate-600" />
              Explore Exams
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
