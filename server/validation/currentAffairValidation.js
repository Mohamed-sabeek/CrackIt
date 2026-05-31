const VALID_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const URL_REGEX = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/i;

export const validateCurrentAffair = (data) => {
  const errors = {};

  if (!data.month || !VALID_MONTHS.includes(data.month)) {
    errors.month = 'Please select a valid month';
  }

  const yearNum = Number(data.year);
  if (!data.year || isNaN(yearNum) || yearNum < 2020 || yearNum > 2100) {
    errors.year = 'Please enter a valid year (2020–2100)';
  }

  if (!data.sourceName || !data.sourceName.trim()) {
    errors.sourceName = 'Source name is required';
  }

  if (!data.sourceUrl || !data.sourceUrl.trim()) {
    errors.sourceUrl = 'Source URL is required';
  } else if (!URL_REGEX.test(data.sourceUrl.trim())) {
    errors.sourceUrl = 'Please enter a valid URL starting with http:// or https://';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};
