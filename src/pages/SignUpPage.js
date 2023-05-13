import React, { useEffect } from "react";
import Input from "../components/input/Input";
import Field from "../components/field/Field";
import Button from "../components/button/Button";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { Label } from "../components/label";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import ButtonGoogle from "../components/button/ButtonGoogle";

const SignUpPage = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        fullname: Yup.string().required("Fullname is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        mode: "onSubmit",
        resolver: yupResolver(validationSchema),
    });
    const handleSignUp = async (values) => {
        try {
            if (!isValid) return;
            await createUserWithEmailAndPassword(auth, values.email, values.password);
            await updateProfile(auth.currentUser, {
                displayName: values.fullname,
                photoURL:
                    "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
            });

            ///thêm vào firestore database
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                fullname: values.fullname,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
                username: values.username || values.fullname,
                avatar: "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
                status: "Active",
                role: "User",
                createdAt: serverTimestamp(),
            });
            toast.success("Register successfully!", {
                autoClose: 3000,
            });
            navigate("/");
        } catch (error) {
            toast.error("This account is already in use", {
                autoClose: 3000,
            });
        }
    };
    useEffect(() => {
        document.title = "Sign Up Page";
    }, []);
    return (
        <div className="min-h-screen px-3 py-10">
            <div className="container">
                <div className="flex items-center justify-center">
                    <NavLink to={"/"}>
                        <img srcSet="/logo.svg 2x" alt="monkey blogging" className="mx-auto mb-5" />
                    </NavLink>
                </div>
                <h1 className="text-4xl font-bold text-center text-primary mb-14">
                    Monkey Blogging
                </h1>
                <form
                    autoComplete="off"
                    onSubmit={handleSubmit(handleSignUp)}
                    className="w-full max-w-[500px] mx-auto flex flex-col gap-y-8"
                >
                    <Field className="flex flex-col items-start gap-y-5">
                        <Label htmlFor="fullname">Fullname</Label>
                        <Input
                            className={`${errors.fullname && "!border-red-500"}`}
                            type="text"
                            name="fullname"
                            placeholder="Enter your fullname"
                            control={control}
                        ></Input>
                        {errors.fullname && (
                            <span className="relative block -mt-2 text-sm text-red-500">
                                {errors.fullname.message}
                            </span>
                        )}
                    </Field>

                    <Field className="flex flex-col items-start gap-y-5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            className={`${errors.email && "!border-red-500"}`}
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            control={control}
                        ></Input>
                        {errors.email && (
                            <span className="relative block -mt-2 text-sm text-red-500">
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
                            control={control}
                            hasIcon
                        ></Input>
                        {errors.password && (
                            <span className="relative block -mt-2 text-sm text-red-500">
                                {errors.password.message}
                            </span>
                        )}
                    </Field>

                    <Field>
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input
                            className={`${errors.confirmPassword && "!border-red-500"}`}
                            type="password"
                            name="confirmPassword"
                            placeholder="Enter your confirm password"
                            control={control}
                            hasIcon
                        ></Input>
                        {errors.confirmPassword && (
                            <span className="relative block -mt-2 text-sm text-red-500">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </Field>

                    <div className="font-medium text-center">
                        You already have an account?{" "}
                        <NavLink to={"/sign-in"}>
                            <span className="underline cursor-pointer text-primary">Sign in</span>
                        </NavLink>
                    </div>
                    <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                        Sign Up
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
