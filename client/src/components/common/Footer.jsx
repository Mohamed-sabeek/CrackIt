import { Mail, Phone, MapPin } from 'lucide-react';
import logoImg from '../../assets/crackit-logo.webp';

const Footer = () => {
  return (
    <footer id="about" className="bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-300 pt-20 pb-10 border-t border-blue-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & Description */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/10 shadow-lg">
                <img src={logoImg} alt="Crackit" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Crackit</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Your comprehensive AI-powered platform currently specializing in TNPSC preparation, with a planned roadmap to expand to more government exams soon.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-tr hover:from-pink-500 hover:to-orange-500 hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/mohamed-sabeek-1a272a327/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-full bg-slate-800/60 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Exams', 'Features', 'AI Assistant', 'About Us'].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase().replace(' ', '')}`} 
                    className="relative text-slate-400 hover:text-blue-400 transition-colors duration-300 hover:underline decoration-blue-500 decoration-2 underline-offset-4"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Exams */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">TNPSC Modules</h4>
            <ul className="space-y-4 mb-4">
              {['TNPSC Group 1', 'TNPSC Group 2', 'TNPSC Group 4', 'TNPSC VAO'].map((exam) => (
                <li key={exam}>
                  <a 
                    href="#exams" 
                    className="relative text-slate-400 hover:text-blue-400 transition-colors duration-300 hover:underline decoration-blue-500 decoration-2 underline-offset-4"
                  >
                    {exam}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 italic mt-2">
              More competitive exams will be added soon.
            </p>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3.5 group">
                <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors duration-300">
                  <MapPin className="text-blue-400 flex-shrink-0" size={18} />
                </div>
                <span className="text-slate-400 group-hover:text-slate-200 transition-colors duration-300 text-sm leading-relaxed pt-1">
                  Coimbatore, Tamil Nadu, India
                </span>
              </li>
              <li className="flex items-center gap-3.5 group">
                <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors duration-300">
                  <Phone className="text-blue-400 flex-shrink-0" size={18} />
                </div>
                <a 
                  href="tel:+916383028607" 
                  className="text-slate-400 group-hover:text-slate-200 transition-colors duration-300 text-sm hover:underline decoration-blue-500 decoration-2 underline-offset-4"
                >
                  +91 6383028607
                </a>
              </li>
              <li className="flex items-center gap-3.5 group">
                <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors duration-300">
                  <Mail className="text-blue-400 flex-shrink-0" size={18} />
                </div>
                <a 
                  href="mailto:safeeofficial1730@gmail.com" 
                  className="text-slate-400 group-hover:text-slate-200 transition-colors duration-300 text-sm break-all hover:underline decoration-blue-500 decoration-2 underline-offset-4"
                >
                  safeeofficial1730@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Crackit Educational Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
