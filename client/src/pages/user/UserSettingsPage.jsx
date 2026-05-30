import React from 'react';
import UserSettings from '../../components/user/settings/UserSettings';
import { useAuth } from '../../hooks/useAuth';

const UserSettingsPage = () => {
  const { user, updateProgress } = useAuth();

  const handleSetActiveExam = async (examName) => {
    try {
      await updateProgress({
        activeCourse: examName
      });
    } catch (err) {
      console.error('Failed to update active course settings:', err);
    }
  };

  return (
    <div className="py-2">
      <UserSettings 
        user={user}
        activeExam={user?.activeCourse || 'TNPSC Group 4'}
        setActiveExam={handleSetActiveExam}
      />
    </div>
  );
};

export default UserSettingsPage;
