import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/common/Navbar';
import Hero from '../../sections/Hero';
import Stats from '../../sections/Stats';
import Exams from '../../sections/Exams';
import Features from '../../sections/Features';
import AIAssistant from '../../sections/AIAssistant';
import WhyChooseUs from '../../sections/WhyChooseUs';
import CTA from '../../sections/CTA';
import Footer from '../../components/common/Footer';

const LandingPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const heroRef = useRef(null);
  const examsRef = useRef(null);
  const featuresRef = useRef(null);
  const aiRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Prevent browser scroll persistence
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Force reset scroll to absolute top on load
    window.scrollTo(0, 0);
  }, []);

  const sectionRefs = {
    home: heroRef,
    exams: examsRef,
    features: featuresRef,
    ai: aiRef,
    about: aboutRef
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900">
      <Navbar sectionRefs={sectionRefs} />
      <main>
        <div ref={heroRef} className="scroll-mt-28">
          <Hero />
        </div>
        <Stats />
        <div ref={examsRef} className="scroll-mt-28">
          <Exams />
        </div>
        <div ref={featuresRef} className="scroll-mt-28">
          <Features />
        </div>
        <div ref={aiRef} className="scroll-mt-28">
          <AIAssistant />
        </div>
        <WhyChooseUs />
        <CTA />
      </main>
      <div ref={aboutRef} className="scroll-mt-28">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
