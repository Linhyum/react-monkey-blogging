import React, { useEffect } from "react";
import { useAuth } from "../contexts/auth-context";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Field from "../components/field/Field";
import { Label } from "../components/label";
import Input from "../components/input/Input";
import Button from "../components/button/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { toast } from "react-toastify";
const SignInPage = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Sign In Page";
        if (userInfo?.email) {
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        mode: "onSubmit",
        resolver: yupResolver(validationSchema),
    });
    const handleSignIn = async (values) => {
        if (!isValid) return; //đã xác nhận xong k gặp lỗi nữa còn nếu gặp lỗi thì dừng liền
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            toast.success("Sign in successfully!", { autoClose: 3000 });
            navigate("/");
        } catch (error) {
            toast.error("Email or password is incorrect!", { autoClose: 3000 });
        }
    };
    return (
        <div className="min-h-screen py-10 px-3">
            <div className="container">
                <div className="flex items-center justify-center">
                    <NavLink to={"/"}>
                        <img srcSet="/logo.svg 2x" alt="monkey blogging" className="mx-auto mb-5" />
                    </NavLink>
                </div>
                <h1 className="text-center text-primary font-bold text-4xl mb-14">
                    Monkey Blogging
                </h1>
                <form
                    autoComplete="off"
                    onSubmit={handleSubmit(handleSignIn)}
                    className="w-full max-w-[600px] mx-auto flex flex-col gap-y-8"
                >
                    <Field className="flex flex-col gap-y-5 items-start">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            className={`${errors.email && "!border-red-500"}`}
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            control={control}
                        ></Input>
                        {errors.email && (
                            <span className="text-red-500 relative -mt-2 text-sm block">
                                {errors.email.message}
                            </span>
                        )}
                    </Field>

                    <Field>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            className={`${errors.password && "!border-red-500"}`}
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            hasIcon
                            control={control}
                        ></Input>
                        {errors.password && (
                            <span className="text-red-500 relative -mt-2 text-sm block">
                                {errors.password.message}
                            </span>
                        )}
                    </Field>
                    <div className="text-center font-medium text-[17px]">
                        You not have an account?{" "}
                        <NavLink to={"/sign-up"}>
                            <span className="text-primary cursor-pointer underline">Sign up</span>
                        </NavLink>
                    </div>
                    <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default SignInPage;
