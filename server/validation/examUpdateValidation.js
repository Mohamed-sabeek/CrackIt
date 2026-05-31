const URL_REGEX = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/i;
const STATUS_OPTIONS = [
  'Upcoming',
  'Applications Open',
  'Hall Ticket Released',
  'Exam Completed',
  'Results Released',
  'Certificate Verification',
  'Recruitment Closed'
];

export const validateExamUpdate = (data) => {
  const errors = {};

  if (!data.examName || !data.examName.trim()) {
    errors.examName = 'Exam Name is required';
  }

  if (!data.notificationDate) {
    errors.notificationDate = 'Notification Date is required';
  } else if (isNaN(new Date(data.notificationDate).getTime())) {
    errors.notificationDate = 'Valid Notification Date is required';
  }

  if (!data.status || !STATUS_OPTIONS.includes(data.status)) {
    errors.status = 'A valid status is required';
  }

  if (!data.sourceName || !data.sourceName.trim()) {
    errors.sourceName = 'Source name is required';
  }

  if (!data.officialUrl || !data.officialUrl.trim()) {
    errors.officialUrl = 'Official URL is required';
  } else if (!URL_REGEX.test(data.officialUrl.trim())) {
    errors.officialUrl = 'Please enter a valid URL starting with http:// or https://';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};
