import React, { useState } from "react";
import { TextInput, Button, Text, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import Api from "../../../utils/Api.tsx";
import { Link, useNavigate } from "react-router-dom";

interface SignupProps {}

const Signup: React.FC<SignupProps> = () => {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUser, setUser] = useState<boolean>(true);
  const [isAnswer, setAnswer] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [isPassowrd, setIsPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const userForm = useForm({
    initialValues: {
      username: "",
    },

    validate: {
      username: (value) => (value.length < 1 ? "Please enter username" : null),
    },
  });

  const answerForm = useForm({
    initialValues: {
      secretAnswer: "",
    },

    validate: {
      secretAnswer: (value) =>
        value.length < 1 ? "Please enter username secret answer" : null,
    },
  });

  async function RequestQuestion(values: { username: string }): Promise<void> {
    const apiService = new Api();
    setIsLoading(true);
    const response = await apiService.getSecretQuestion({
      username: values.username,
    });
    setIsLoading(false);

    if (response) {
      window.alert(response.data);
      if (response.status == 200) {
        setUserId(values.username);
        setQuestion(response.body);
        setUser(false);
        setAnswer(true);
        setIsPassword(true);
        setPassword(response.body)
      }
    }
  }
  async function RequestPassword(values: {
    secretAnswer: string;
  }): Promise<void> {
    const apiService = new Api();
    setIsLoading(true);
    const response = await apiService.getPassword({
      username: userId,
      secretAnswer: values.secretAnswer,
    });
    setIsLoading(false);

    if (response) {
      window.alert(response.data);
      if (response.status == 200) {
        setUser(false);
        setAnswer(false);
        setPassword(response.body);
      }
    }
  }

  return (
    <>
      <h1>Forgot-Password</h1>
      <br />
      {isUser && (
        <>
          <form
            onSubmit={userForm.onSubmit((values) => RequestQuestion(values))}
          >
            <TextInput
              size="sm"
              label="What is your username?"
              withAsterisk
              placeholder="Userame"
              {...userForm.getInputProps("username")}
            />
            <br />
            {isUser && isLoading ? (
              <Loader />
            ) : (
              <Button size="md" type="submit">
                Submit
              </Button>
            )}
          </form>
        </>
      )}
      {isAnswer && (
        <>
          <Text size="lg">Username: {userId}</Text>
          <br />
          <Text size="lg">Question: {question}</Text>
          <br />
          <form
            onSubmit={answerForm.onSubmit((values) => RequestPassword(values))}
          >
            <TextInput
              size="sm"
              withAsterisk
              placeholder="Secret Answer"
              {...userForm.getInputProps("secretAnswer")}
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
        </>
      )}
      {isPassowrd && (
        <>
          <Text size="lg">Your password is: {password}</Text>
          <Link to="/login">Login</Link>
        </>
      )}
    </>
  );
};

export default Signup;
