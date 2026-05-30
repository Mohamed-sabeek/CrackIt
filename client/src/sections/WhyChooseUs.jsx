import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Smartphone, LineChart } from 'lucide-react';

const reasons = [
  {
    icon: <Target className="text-blue-600" size={20} />,
    title: "Syllabus Mapping",
    description: "Master the TNPSC syllabus with ease. Smart overlapping topic mapping for upcoming exams is planned to help you study efficiently.",
    bg: "bg-blue-50/70 border-blue-100/50",
    glow: "hover:border-blue-300 hover:shadow-blue-500/5"
  },
  {
    icon: <LineChart className="text-indigo-600" size={20} />,
    title: "Smart Analytics",
    description: "Deep dive into your performance metrics. Track time spent per question, accuracy rates, and peer comparisons.",
    bg: "bg-indigo-50/70 border-indigo-100/50",
    glow: "hover:border-indigo-300 hover:shadow-indigo-500/5"
  },
  {
    icon: <ShieldCheck className="text-emerald-600" size={20} />,
    title: "Real Exam Simulations",
    description: "Practice on an interface exactly like the real exam. Get accustomed to the pressure and time constraints.",
    bg: "bg-emerald-50/70 border-emerald-100/50",
    glow: "hover:border-emerald-300 hover:shadow-emerald-500/5"
  },
  {
    icon: <Smartphone className="text-purple-600" size={20} />,
    title: "Mobile Responsive",
    description: "Study on the go with our fully optimized mobile experience. Your progress syncs seamlessly across all devices.",
    bg: "bg-purple-50/70 border-purple-100/50",
    glow: "hover:border-purple-300 hover:shadow-purple-500/5"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-slate-50/50 relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Why Choose Crackit?</h2>
          <p className="text-slate-500 text-lg">We combine expert educational content with cutting-edge technology to give you an unfair advantage.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`bg-white p-6 rounded-xl border border-slate-200/80 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start hover:scale-[1.01] ${reason.glow}`}
            >
              <div className={`w-12 h-12 rounded-lg ${reason.bg} border flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                {reason.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{reason.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
