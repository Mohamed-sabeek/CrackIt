// Formatter Utilities

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatPercentage = (value) => {
  return `${value}%`;
};
