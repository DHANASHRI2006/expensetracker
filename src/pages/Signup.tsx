
import React from 'react';
import SignupForm from '../components/auth/SignupForm';
import Chatbot from '../components/Chatbot';

const Signup: React.FC = () => {
  return (
    <div>
      <SignupForm />
      <Chatbot />
    </div>
  );
};

export default Signup;
