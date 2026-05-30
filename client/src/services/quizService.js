// Daily Quiz Service - Manages Timed daily questions
import { quizQuestions } from '../data/mockData';

export const getQuizQuestions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(quizQuestions);
    }, 100);
  });
};
export default { getQuizQuestions };
