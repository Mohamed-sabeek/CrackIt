// Syllabus Service - Manages Active Syllabus Operations
import { initialSubjectsList } from '../data/mockData';

export const getSubjects = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialSubjectsList);
    }, 100);
  });
};
export default { getSubjects };
