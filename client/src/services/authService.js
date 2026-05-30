// Authentication Service - Handle Mock Auth Actions

export const loginUser = async (email, password) => {
  // Simulate API network call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'safeeofficial1730@gmail.com' && password === 'SafeeCrackIt@1730') {
        resolve({
          name: 'Admin User',
          email: 'safeeofficial1730@gmail.com',
          role: 'admin',
          token: 'mock-jwt-admin-token'
        });
      } else {
        // Find normal user in local mock DB or similar (AuthContext handles the storage)
        resolve({
          name: 'Mohamed Sabeek',
          email: email,
          role: 'user',
          token: 'mock-jwt-user-token'
        });
      }
    }, 800);
  });
};
