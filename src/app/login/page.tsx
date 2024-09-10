"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [cookie, setCookie] = useCookies(["token"]);
  const router = useRouter();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        mode: 'no-cors',
      });

      // Note: With 'no-cors', you cannot access the response body or headers.
      // Assuming the login is successful, you can manually set a cookie.
      document.cookie = `token=${JSON.stringify(response)}; path=/; max-age=3600; samesite=strict`;

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      setError('Login failed. Please check your email and password and try again.');
      console.error('Login failed:', error);
    }
  };


  return (
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={handleEmailChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
      </Box>
    </Container>
  );
}

export default Login;