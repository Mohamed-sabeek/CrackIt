import React from 'react';

const PageHeader = ({ title, description }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
      {description && (
        <p className="text-sm text-slate-500 mt-1.5">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
