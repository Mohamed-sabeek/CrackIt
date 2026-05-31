import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Book, Briefcase, Building, Shield, Stethoscope, Microscope, ShieldAlert, Landmark } from 'lucide-react';

const exams = [
  {
    title: "TNPSC",
    description: "Group 1, 2, 2A, 4 and VAO exam preparation with detailed Tamil and English materials.",
    icon: <Landmark className="text-blue-600" size={22} />,
    bg: "bg-blue-50/70 border-blue-100/50",
    isActive: true,
    hoverGlow: "hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5",
  },
  {
    title: "UPSC",
    description: "Comprehensive coverage for Civil Services, NDA, CDS with expert guidance.",
    icon: <Book className="text-purple-500" size={22} />,
    bg: "bg-purple-50/70 border-purple-100/50",
    isActive: false,
  },
  {
    title: "SSC",
    description: "CGL, CHSL, MTS, and GD Constable preparation with mock tests.",
    icon: <Briefcase className="text-emerald-500" size={22} />,
    bg: "bg-emerald-50/70 border-emerald-100/50",
    isActive: false,
  },
  {
    title: "Banking",
    description: "IBPS PO/Clerk, SBI PO/Clerk, and RBI Grade B mock interviews and tests.",
    icon: <Building className="text-orange-500" size={22} />,
    bg: "bg-orange-50/70 border-orange-100/50",
    isActive: false,
  },
  {
    title: "Railway",
    description: "RRB NTPC, Group D, and ALP specialized study materials.",
    icon: <ShieldAlert className="text-rose-500" size={22} />,
    bg: "bg-rose-50/70 border-rose-100/50",
    isActive: false,
  },
  {
    title: "Police",
    description: "TNUSRB SI and Constable exam prep with physical test guidance.",
    icon: <Shield className="text-cyan-500" size={22} />,
    bg: "bg-cyan-50/70 border-cyan-100/50",
    isActive: false,
  },
  {
    title: "NEET",
    description: "Medical entrance exam prep with conceptual physics, chemistry, biology.",
    icon: <Stethoscope className="text-pink-500" size={22} />,
    bg: "bg-pink-50/70 border-pink-100/50",
    isActive: false,
  },
  {
    title: "JEE",
    description: "Engineering entrance prep with advanced mathematics and science.",
    icon: <Microscope className="text-indigo-500" size={22} />,
    bg: "bg-indigo-50/70 border-indigo-100/50",
    isActive: false,
  }
];

const Exams = () => {
  return (
    <section id="exams" className="py-24 bg-white relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Top Exam Categories</h2>
          <p className="text-slate-500 text-lg">Choose your goal and start your personalized preparation journey. Currently specializing in TNPSC, with more exams coming soon.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exams.map((exam, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`group relative rounded-xl border p-6 transition-all duration-300 flex flex-col justify-between min-h-[250px] ${
                exam.isActive 
                  ? 'border-slate-200 bg-white hover:scale-[1.01] ' + exam.hoverGlow
                  : 'border-slate-100 bg-slate-50/50 opacity-75 grayscale'
              }`}
            >
              <div>
                {/* Badge Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-10 h-10 ${exam.bg} border rounded-lg flex items-center justify-center`}>
                    {exam.icon}
                  </div>
                  <div>
                    {exam.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 border border-slate-200 text-slate-600">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{exam.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{exam.description}</p>
              </div>

              <div>
                {exam.isActive ? (
                  <Link to="/register" className="flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                    Explore {exam.title} <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ) : (
                  <div className="relative group/tooltip inline-block w-full">
                    <button 
                      disabled 
                      className="flex items-center text-sm font-medium text-slate-400 cursor-not-allowed w-full"
                    >
                      Explore <ArrowRight size={16} className="ml-1.5" />
                    </button>
                    {/* Tooltip */}
                    <span className="absolute bottom-full mb-2 left-0 hidden group-hover/tooltip:block bg-slate-900 text-white text-xs rounded py-1.5 px-2.5 z-10 whitespace-nowrap shadow-md border border-slate-800">
                      This module is under development
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Exams;
