import React, { useState } from "react";
import { TextInput, Button, Text, Loader, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Api from "../../../utils/Api.tsx";
import { useNavigate } from "react-router-dom";

interface SignupProps {}

const Signup: React.FC<SignupProps> = () => {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUser, setUser] = useState<boolean>(true);
  const [isAnswer, setAnswer] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [question, setQuestion] = useState<string>("");

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
      newPassword: "",
    },

    validate: {
      secretAnswer: (value) => (value.length < 1 ? "Please enter secret answer" : null),
      newPassword: (value) => (value.length < 1 ? "Please enter password" : null),
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
      if (response.status == 200) {
        setUserId(values.username);
        setQuestion(response.data);
        setUser(false);
        setAnswer(true);
      }
    }
  }
  async function RequestPassword(values: { secretAnswer: string; newPassword: string }): Promise<void> {
    const apiService = new Api();
    setIsLoading(true);
    const response = await apiService.getPassword({
      username: userId,
      secretAnswer: values.secretAnswer,
      newPassword: values.newPassword,
    });
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
      <h1>Forgot-Password</h1>
      <br />
      {isUser && (
        <>
          <form onSubmit={userForm.onSubmit((values) => RequestQuestion(values))}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextInput
              size="sm"
              label="What is your username?"
              withAsterisk
              placeholder="Userame"
              {...userForm.getInputProps("username")}
              w={"18rem"}
            />
            </div>
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
          <form onSubmit={answerForm.onSubmit((values) => RequestPassword(values))}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextInput size="sm" withAsterisk placeholder="Secret Answer" 
            {...answerForm.getInputProps("secretAnswer")} w={"20rem"} />
            <br />
            <PasswordInput
              size="sm"
              withAsterisk
              placeholder="New Password"
              {...answerForm.getInputProps("newPassword")}
              w={"20rem"}
            />
            </div>
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
    </>
  );
};

export default Signup;
