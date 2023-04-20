import slugify from "slugify";
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

const SignUpPage = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        fullname: Yup.string().required("Fullname is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                "Password must contain at least one uppercase letter, one number, and one special character"
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema),
    });
    const handleSignUp = async (values) => {
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
    };
    useEffect(() => {
        document.title = "Sign Up Page";
    }, []);
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
                    onSubmit={handleSubmit(handleSignUp)}
                    className="w-full max-w-[600px] mx-auto flex flex-col gap-y-8"
                >
                    <Field className="flex flex-col gap-y-5 items-start">
                        <Label htmlFor="fullname">Fullname</Label>
                        <Input
                            type="text"
                            name="fullname"
                            placeholder="Enter your fullname"
                            control={control}
                        ></Input>
                        {errors.fullname && (
                            <span className="text-red-500 relative -mt-2 text-sm block">
                                {errors.fullname.message}
                            </span>
                        )}
                    </Field>

                    <Field className="flex flex-col gap-y-5 items-start">
                        <Label htmlFor="email">Email</Label>
                        <Input
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
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            control={control}
                            hasIcon
                        ></Input>
                        {errors.password && (
                            <span className="text-red-500 relative -mt-2 text-sm block">
                                {errors.password.message}
                            </span>
                        )}
                    </Field>

                    <Field>
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input
                            type="password"
                            name="confirmPassword"
                            placeholder="Enter your confirm password"
                            control={control}
                            hasIcon
                        ></Input>
                        {errors.confirmPassword && (
                            <span className="text-red-500 relative -mt-2 text-sm block">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </Field>

                    <div className="text-center font-medium text-[17px]">
                        You already have an account?{" "}
                        <NavLink to={"/sign-in"}>
                            <span className="text-primary cursor-pointer underline">Sign in</span>
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
