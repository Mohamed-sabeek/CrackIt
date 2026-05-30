import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Priya Sharma",
    exam: "Cleared TNPSC Group 2",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    text: "The AI Mentor was a game-changer for me. It identified my weak areas in Indian Polity and created a customized study plan that helped me clear the exam on my first attempt."
  },
  {
    name: "Rahul Verma",
    exam: "SBI PO Mains 2023",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    text: "The mock tests on Crackit are exactly at the level of the real exams. The detailed performance analytics helped me improve my speed and accuracy significantly."
  },
  {
    name: "Ananya Patel",
    exam: "UPSC CSE Aspirant",
    image: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    text: "I love the clean UI and the comprehensive study materials. Having everything from previous year papers to daily current affairs in one place saves me so much time."
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Success Stories</h2>
          <p className="text-slate-500 text-lg">Join thousands of successful candidates who trusted Crackit for their exam preparation.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-white p-6 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all duration-300 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-0.5 mb-5 text-slate-900">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="stroke-slate-900" />
                  ))}
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{testimonial.text}"</p>
              </div>
              
              <div className="flex items-center gap-3">
                <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                <div>
                  <h4 className="font-bold text-slate-950 text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{testimonial.exam}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
