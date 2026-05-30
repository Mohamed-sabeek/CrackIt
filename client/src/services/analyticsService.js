// Performance Analytics Service - Mock data metrics
import { mockActivityTimeline } from '../data/mockData';

export const getActivityTimeline = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockActivityTimeline);
    }, 100);
  });
};
export default { getActivityTimeline };
