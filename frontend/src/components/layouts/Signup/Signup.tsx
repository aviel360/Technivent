import React from 'react';
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import Api from '../../../utils/Api.tsx';
import { Link, useNavigate } from 'react-router-dom';

interface SignupProps {
}


const Signup: React.FC<SignupProps> = () => {
  let navigate = useNavigate();

  const form = useForm({
      initialValues: {
          username: '',
          password: '',
          confirmPassword: '',
      },

      validate: {
          username: (value) => (value.length < 1 ? 'Userame must have at least 1 character' : null),
          password: (value) => (value.length < 1 ? 'Password must have at least 1 character' : null),
          confirmPassword: (value, values) => (value !== values.password ? 'Passwords did not match' : null),
      },
      });
      
      async function RequestSignup(values: { username: string, password: string, confirmPassword: string }): Promise<void> {
        const { username, password } = values;

        const apiService = new Api();
        try {
          const response = await apiService.signUp({ username, password });
          switch(response.status)
          {
            case 201: navigate('/'); break;
            default: window.alert(JSON.parse(response)); break;
          }
          } catch (error) {
            window.alert(error);
        }
      }

  return (
    <>
    <h2>Signup</h2>
        <form onSubmit={form.onSubmit((values) => RequestSignup(values))}>
            <TextInput error="Username already exists" label="Userame" withAsterisk placeholder="Userame" {...form.getInputProps('username')} />
            <br/>
            <TextInput type='password' label="Password" withAsterisk placeholder="Password" {...form.getInputProps('password')}/>
            <br/>
            <TextInput type='password' label="Confirm Password" withAsterisk placeholder="Confirm Password" {...form.getInputProps('confirmPassword')}/>
            <br/>
            <Button type="submit">Submit</Button>
          </form>
        <p> <Link to="forgot-password">Forgot password?</Link> </p>
        <p> Already have an account? <Link to="login">Login</Link> </p>
    </>
  );
};

export default Signup;
