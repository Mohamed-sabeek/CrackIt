import React from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckSquare, Clock, FileText, Newspaper, Megaphone, BarChart3, Library } from 'lucide-react';

const features = [
  {
    icon: <Bot size={20} className="text-blue-600" />,
    title: "AI Assistant",
    description: "24/7 instant doubt solving and personalized study recommendations.",
    bg: "bg-blue-50/70 border-blue-100/50",
    glow: "hover:border-blue-300 hover:shadow-blue-500/5"
  },
  {
    icon: <CheckSquare size={20} className="text-indigo-600" />,
    title: "Mock Tests",
    description: "Real exam simulations with comprehensive performance analytics.",
    bg: "bg-indigo-50/70 border-indigo-100/50",
    glow: "hover:border-indigo-300 hover:shadow-indigo-500/5"
  },
  {
    icon: <Clock size={20} className="text-purple-600" />,
    title: "Daily Quiz",
    description: "Stay sharp with daily current affairs and subject-wise quizzes.",
    bg: "bg-purple-50/70 border-purple-100/50",
    glow: "hover:border-purple-300 hover:shadow-purple-500/5"
  },
  {
    icon: <FileText size={20} className="text-emerald-600" />,
    title: "Previous Papers",
    description: "10+ years of previous year question papers with detailed solutions.",
    bg: "bg-emerald-50/70 border-emerald-100/50",
    glow: "hover:border-emerald-300 hover:shadow-emerald-500/5"
  },
  {
    icon: <Newspaper size={20} className="text-pink-600" />,
    title: "Current Affairs",
    description: "Daily updated current affairs resources tailored for government exams.",
    bg: "bg-pink-50/70 border-pink-100/50",
    glow: "hover:border-pink-300 hover:shadow-pink-500/5"
  },
  {
    icon: <Megaphone size={20} className="text-orange-600" />,
    title: "Exam Updates",
    description: "Real-time notifications for exam dates, admit cards, and results.",
    bg: "bg-orange-50/70 border-orange-100/50",
    glow: "hover:border-orange-300 hover:shadow-orange-500/5"
  },  {
    icon: <BarChart3 size={20} className="text-cyan-600" />,
    title: "Performance Analytics",
    description: "Track your progress with AI-driven insights and weak area identification.",
    bg: "bg-cyan-50/70 border-cyan-100/50",
    glow: "hover:border-cyan-300 hover:shadow-cyan-500/5"
  },
  {
    icon: <Library size={20} className="text-violet-600" />,
    title: "Study Materials",
    description: "High-quality PDF notes, video lectures, and complete syllabuses.",
    bg: "bg-violet-50/70 border-violet-100/50",
    glow: "hover:border-violet-300 hover:shadow-violet-500/5"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-slate-50/50 relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Everything You Need to Succeed</h2>
          <p className="text-slate-500 text-lg">A complete ecosystem designed to optimize your preparation and maximize your chances of selection.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className={`p-6 rounded-xl border border-slate-200/80 bg-white transition-all duration-300 group flex flex-col justify-between hover:scale-[1.01] ${feature.glow}`}
            >
              <div>
                <div className={`w-10 h-10 ${feature.bg} border rounded-lg flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
