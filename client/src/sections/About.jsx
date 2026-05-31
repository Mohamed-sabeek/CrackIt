import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Lightbulb, TrendingUp } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-24 bg-white relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">About Crackit</h2>
          <p className="text-slate-500 text-lg">
            We are dedicated to democratizing quality education for government exam aspirants through technology and expert pedagogy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              Crackit was born from a simple idea: every aspirant deserves access to high-quality, structured, and affordable study materials. We aim to bridge the gap between traditional coaching and modern, self-paced learning.
            </p>
            <p className="text-slate-600 leading-relaxed">
              By combining comprehensive syllabi covering TNPSC and more, precise mock tests, and a 24/7 AI-powered mentor, we provide a holistic ecosystem designed solely for your success.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div>
                <h4 className="text-4xl font-extrabold text-blue-600 mb-2">10k+</h4>
                <p className="text-slate-500 text-sm font-semibold">Active Students</p>
              </div>
              <div>
                <h4 className="text-4xl font-extrabold text-indigo-600 mb-2">500+</h4>
                <p className="text-slate-500 text-sm font-semibold">Mock Tests</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap size={20} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Expert Content</h4>
              <p className="text-sm text-slate-500">Curated by top educators and exam toppers.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sm:translate-y-8">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb size={20} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Smart Learning</h4>
              <p className="text-sm text-slate-500">AI-driven insights to focus on your weak areas.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Community</h4>
              <p className="text-sm text-slate-500">Join thousands of peers with a shared goal.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sm:translate-y-8">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={20} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Proven Results</h4>
              <p className="text-sm text-slate-500">Consistent track record of successful candidates.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
