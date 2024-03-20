import React from 'react';
import { TextInput, Button, PasswordInput, Box } from '@mantine/core';
import { useForm } from '@mantine/form';

interface SignupProps {
}



const Signup: React.FC<SignupProps> = () => {
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
        
  return (
    <>
    <h2>Signup</h2>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <TextInput label="Userame" placeholder="Userame" {...form.getInputProps('username')} />
            <PasswordInput label="Password" withAsterisk placeholder="Password" {...form.getInputProps('password')}/>
            <PasswordInput label="Confirm Password" withAsterisk placeholder="Confirm Password" {...form.getInputProps('confirmPassword')}/>
            <Button type="submit">Submit</Button>
          </form>
      <div>
        <p>
          <a href="/forgot-password">Forgot password?</a>
        </p>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </>
  );
};

export default Signup;
