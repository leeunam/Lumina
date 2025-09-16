export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // TODO: Replace with real database validation
  if (email === 'company@oboticario.com' && password === 'password') {
    // Simulate successful login
    return res.status(200).json({
      message: 'Login successful',
      token: 'fake-jwt-token', // In a real app, you would generate a JWT
      user: {
        name: 'oBoticario',
        email: 'company@oboticario.com',
      },
    });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
};
