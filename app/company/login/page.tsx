'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CompanyLoginPage() {
  const [email, setEmail] = useState('company@oboticario.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        // Store token, user info, etc. (e.g., in localStorage or context)
        console.log('Login successful:', response.data);
        router.push('/company/dashboard');
      }
    } catch (err: any) {
      if (err.response) {
        setError(
          err.response.data.message || 'An error occurred during login.'
        );
      } else {
        setError('Unable to connect to the server.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="site-container">
        {/* Bottom section with login form */}
        <div className="absolute bottom-0 left-0 right-0 bg-lumina-teal rounded-t-3xl px-6 py-8 lg:static lg:rounded-xl lg:max-w-2xl lg:mx-auto lg:mt-12 lg:shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-8">Login</h2>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-2 border-white text-white placeholder:text-white/70 rounded-lg py-3 px-4 text-lg"
                disabled={loading}
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-2 border-white text-white placeholder:text-white/70 rounded-lg py-3 px-4 text-lg"
                disabled={loading}
              />
            </div>

            <div className="text-right">
              <button className="text-white/80 text-sm hover:text-white">
                Esqueceu a senha?
              </button>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-white text-lumina-teal hover:bg-gray-100 font-semibold py-3 rounded-lg text-lg"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>

          <div className="text-center mt-6">
            <span className="text-white/80 text-sm">
              {"Don't have an account? "}
              <button
                onClick={() => router.push('/company/register')}
                className="text-white font-semibold hover:underline"
              >
                Register here
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
