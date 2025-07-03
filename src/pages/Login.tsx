
import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import Chatbot from '../components/Chatbot';

const Login: React.FC = () => {
  return (
    <div>
      <LoginForm />
      <Chatbot />
    </div>
  );
};

export default Login;
