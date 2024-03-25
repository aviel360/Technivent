import { Button, Loader, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../../utils/Api";
import "./Login.css";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  let navigate = useNavigate();
  const [error, setError] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => {
        if (value.length < 1) {
          setError(null);
          return "Please enter username";
        }
        return null;
      },
      password: (value) => {
        if (value.length < 1) {
          setError(null);
          return "Please enter password";
        }
        return null;
      },
    },
  });

  async function RequestLogin(values: { username: string; password: string }): Promise<void> {
    setError(null);
    const { username, password } = values;
    const apiService = new Api();
    setIsLoading(true);
    const response = await apiService.Login({ username, password });
    setIsLoading(false);
    if (response) {
      window.alert(response.data);
      if (response.status == 200) {
        navigate("/");
      }
    }
  }

  return (
    <>
      <h1>Login</h1>
      <br />

      <form onSubmit={form.onSubmit((values) => RequestLogin(values))}>
        <TextInput size="sm" label="Userame" withAsterisk placeholder="Userame" {...form.getInputProps("username")} />
        <br />
        <PasswordInput
          size="sm"
          label="Password"
          withAsterisk
          placeholder="Password"
          {...form.getInputProps("password")}
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

      {error && <p className="err-msg">{error}</p>}

      <p>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </>
  );
};

export default Login;
