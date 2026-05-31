import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select an option',
  className = '',
  icon: Icon = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (val) => {
    onChange({ target: { value: val } });
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    const selectedOption = options.find(opt => 
      typeof opt === 'object' ? opt.value === value : opt === value
    );
    if (!selectedOption) return placeholder;
    return typeof selectedOption === 'object' ? selectedOption.label : selectedOption;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-4 pr-10 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[44px]"
      >
        <div className="flex items-center gap-2 truncate pr-2 w-full text-left">
          {Icon && <Icon size={14} className="text-slate-400 flex-shrink-0" />}
          <span className="truncate w-full">{getDisplayValue()}</span>
        </div>
        <ChevronDown 
          size={14} 
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-[100] mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-60 overflow-y-auto w-full animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1.5 flex flex-col gap-0.5">
            {options.map((opt, idx) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const label = typeof opt === 'object' ? opt.label : opt;
              const isSelected = val === value;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(val)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate pr-2">{label}</span>
                  {isSelected && <Check size={14} className="flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
