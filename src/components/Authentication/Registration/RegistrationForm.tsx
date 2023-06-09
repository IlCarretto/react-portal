import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateRegistrationData } from "../../../redux/Auth/authSlice";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Button,
  Container,
  Form,
  Input,
  SignIn,
} from "./RegistrationFormStyle";
import { addUser } from "../../../redux/Auth/userSlice";
import { useNavigate } from "react-router-dom";

const UserSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "L'username deve contenere un minimo di 3 caratteri" })
      .max(10, {
        message: "L'username deve contenere un massimo di 10 caratteri",
      }),
    email: z
      .string()
      .email({ message: "Inserire una email valida" })
      .min(5, { message: "L'email deve contenere un minimo di 5 caratteri" }),
    password: z
      .string()
      .min(8, "La password deve essere lunga almeno 8 caratteri")
      .regex(/^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/, {
        message:
          "La password deve contenere almeno una lettera maiuscola, un numero e un carattere speciale",
      }),
    confirmPassword: z
      .string()
      .min(8, "La password deve essere lunga almeno 8 caratteri")
      .regex(/^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/, { message: "La password deve contenere almeno una lettera maiuscola, numero e un carattere speciale" })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"],
  });

type FormUserType = z.infer<typeof UserSchema>;

interface RegistrationFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { zodResolver } = require("@hookform/resolvers/zod");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormUserType>({ resolver: zodResolver(UserSchema) });

  const [success, setSuccess] = useState(false);

  const onSubmit = (data: RegistrationFormData) => {
    setSuccess(true);
    dispatch(updateRegistrationData(data));
    dispatch(addUser(data));
    console.log(data);
  };

  return (
    <>
      <Container>
        {success ? (
          <Form style={{ justifyContent: "center" }}>
            <h1 style={{ textAlign: "center" }}>
              Ti sei registrato correttamente!
            </h1>
            <SignIn onClick={() => navigate("/auth/login")}>Vai al login</SignIn>
          </Form>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h2>Create a new account</h2>
            <div className="mb-1">
              <div>
                <label htmlFor="username">Username:</label>
              </div>
              <Input
                type="text"
                id="username"
                placeholder="Your username"
                {...register("username")}
              />
              {errors.username && (
                <small className="text-danger">{errors.username.message}</small>
              )}{" "}
            </div>
            <div className="mb-1">
              <div>
                <label htmlFor="email">Email:</label>
              </div>
              <Input
                type="email"
                id="email"
                placeholder="user@company.com"
                {...register("email", { required: "Campo obbligatorio" })}
              />
              {errors.email && (
                <small className="text-danger">{errors.email.message}</small>
              )}{" "}
            </div>
            <div className="mb-1">
              <div>
                <label htmlFor="password">Password:</label>
              </div>
              <Input
                type="password"
                placeholder="Your password"
                {...register("password", { required: "Campo obbligatorio" })}
              />
              {errors.password && (
                <small className="text-danger">{errors.password.message}</small>
              )}{" "}
            </div>
            <div className="mb-1">
              <div>
                <label htmlFor="confirmPassword">Conferma password:</label>
              </div>
              <Input
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Campo obbligatorio",
                })}
              />
              {errors.confirmPassword && (
                <small className="text-danger">
                  {errors.confirmPassword.message}
                </small>
              )}{" "}
            </div>
            <Button className="mt-1" type="submit">
              Register
            </Button>
          </Form>
        )}
      </Container>
    </>
  );
};

export default RegistrationForm;
