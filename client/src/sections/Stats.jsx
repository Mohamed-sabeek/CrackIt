import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, Users, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: <BookOpen className="text-blue-600" size={22} />,
    value: "10K+",
    label: "Questions Available",
    bg: "bg-blue-50/70 border-blue-100/50",
    hoverGlow: "group-hover:border-blue-300 group-hover:shadow-blue-500/5"
  },
  {
    icon: <Award className="text-indigo-600" size={22} />,
    value: "50+",
    label: "Exams Covered",
    bg: "bg-indigo-50/70 border-indigo-100/50",
    hoverGlow: "group-hover:border-indigo-300 group-hover:shadow-indigo-500/5"
  },
  {
    icon: <Users className="text-purple-600" size={22} />,
    value: "24/7",
    label: "AI Mentor Support",
    bg: "bg-purple-50/70 border-purple-100/50",
    hoverGlow: "group-hover:border-purple-300 group-hover:shadow-purple-500/5"
  },
  {
    icon: <TrendingUp className="text-emerald-600" size={22} />,
    value: "100%",
    label: "Mock Tests & Analytics",
    bg: "bg-emerald-50/70 border-emerald-100/50",
    hoverGlow: "group-hover:border-emerald-300 group-hover:shadow-emerald-500/5"
  }
];

const Stats = () => {
  return (
    <section className="relative z-20 -mt-10 mb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`group bg-white border border-slate-200/80 rounded-xl p-6 flex items-center gap-5 hover:shadow-md transition-all duration-300 ${stat.hoverGlow}`}
            >
              <div className={`w-12 h-12 ${stat.bg} border rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                {stat.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
