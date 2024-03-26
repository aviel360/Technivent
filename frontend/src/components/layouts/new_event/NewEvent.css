import React, { useState } from "react";
import { TextInput, Button, PasswordInput, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import Api from "../../../utils/Api.tsx";
import { Link, useNavigate } from "react-router-dom";

interface SignupProps {}

const Signup: React.FC<SignupProps> = () => {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      secretQuestion: "",
      secretAnswer: "",
    },

    validate: {
      username: (value) => (value.length < 1 ? "Please enter username" : null),
      password: (value) => (value.length < 1 ? "Please enter password" : null),
      confirmPassword: (value, values) => (value !== values.password ? "Passwords did not match" : null),
      secretQuestion: (value) => (value.length < 1 ? "Please enter secret question" : null),
      secretAnswer: (value) => (value.length < 1 ? "Please enter username secret answer" : null),
    },
  });

  async function RequestSignup(values: {
    username: string;
    password: string;
    confirmPassword: string;
    secretQuestion: string;
    secretAnswer: string;
  }): Promise<void> {
    const { username, password, secretQuestion, secretAnswer } = values;
    window.alert(secretQuestion);
    const apiService = new Api();
    setIsLoading(true);
    const response = await apiService.signUp({ username, password, secretQuestion, secretAnswer });
    setIsLoading(false);

    if (response) {
      window.alert(response.data);
      if (response.status == 201) {
        navigate("/login");
      }
    }
  }

  return (
    <>
      <h1>Signup</h1>
      <br />
      <form onSubmit={form.onSubmit((values) => RequestSignup(values))}>
        <TextInput
          size="sm"
          error="Username already exists"
          label="Userame"
          withAsterisk
          placeholder="Userame"
          {...form.getInputProps("username")}
        />
        <br />
        <PasswordInput
          size="sm"
          label="Password"
          withAsterisk
          placeholder="Password"
          {...form.getInputProps("password")}
        />
        <PasswordInput
          size="sm"
          label="Confirm Password"
          withAsterisk
          placeholder="Confirm Password"
          {...form.getInputProps("confirmPassword")}
        />
        <br />
        <TextInput
          size="sm"
          label="Secret Question"
          withAsterisk
          placeholder="Secret Question"
          {...form.getInputProps("secretQuestion")}
        />
        <TextInput
          size="sm"
          label="Secret Answer"
          withAsterisk
          placeholder="Secret Answer"
          {...form.getInputProps("secretAnswer")}
        />
        <br />
        {isLoading ? (
          <Loader />
        ) : (
          <Button size="md" type="submit">
            Submit
          </Button>
        )}
      </form>
      <br />
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </>
  );
};

export default Signup;
