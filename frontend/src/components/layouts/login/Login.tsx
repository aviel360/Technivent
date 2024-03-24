import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../../utils/Api";


interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
    let navigate = useNavigate();
    const [error, setError] = useState<string | null>();

    const form = useForm({
        initialValues: {
          username: "",
          password: ""
        },
        validate: {
            username: (value) => (value.length < 1 ? "Username must have at least 1 character" : null),
            password: (value) => (value.length < 1 ? "Password must have at least 1 character" : null)
          },
        });


    async function RequestLogin(values: { username: string; password: string; }): Promise<void> 
    {
        setError(null);
        const { username, password } = values;
        const apiService = new Api();
        try {
            const response = await apiService.Login({ username, password });
            navigate("/");
        }
        catch (error: any) 
        {
            if (error?.response?.status === 401) 
            {
                setError("Invalid Username or Password");
            } else if (error.request) {
                // The request was made but no response was received
                setError('No response received from server.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError('Error in setting up the request.');
            }
        }
    }
        
    return (
        <>
            <h1>Login</h1>
            <br />
            
            <form onSubmit={form.onSubmit((values) => RequestLogin(values))}>
                <TextInput
                    size="sm"
                    //error="Username already exists"
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
                <br />
                <Button size="md" type="submit">
                    Submit
                </Button>
            </form>
            
            <br />

            {error && <p>{error}</p>}
            <p>
                Don't have an account? <Link to="/signup">Signup</Link>
            </p>
        </>
    );
};

export default Login;