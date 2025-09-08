
export const mockLogin = async (email, password) => {
  // In a real application, you would make a call to your authentication API
  console.log(`Logging in with ${email} and ${password}`);

  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real application, you would receive a user object and a token
  return {
    user: {
      name: "Test User",
      email: email,
    },
    token: "mock-jwt-token",
  };
};
