import useFireBaseImage from "../../hooks/useFireBaseImage";
import Swal from "sweetalert2";
import slugify from "slugify";
import Radio from "../../components/checkbox/Radio";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import ImageUpload from "../../components/image/ImageUpload";
import FieldCheckboxes from "../../components/field/FieldCheckboxes";
import Field from "../../components/field/Field";
import DashboardHeading from "../dashboard/DashboardHeading";
import Button from "../../components/button/Button";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/auth-context";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import normalizeStrings from "normalize-strings";
import Textarea from "../../components/textarea/Textarea";
import { useEffect } from "react";
const UserAddNew = () => {
    const navigate = useNavigate();
    const validationSchema = Yup.object().shape({
        fullname: Yup.string().required("Fullname is required"),
        description: Yup.string().required("Description is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                "Password must contain at least one uppercase letter, one number, and one special character"
            ),
    });
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { isValid, errors, isSubmitting },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            fullname: "",
            email: "",
            password: "",
            username: "",
            avatar: "",
            status: "Active",
            role: "User",
            createdAt: new Date(),
        },
    });
    const { image, setImage, progress, setProgress, handleSelectImage, handleDeleteImage } =
        useFireBaseImage(setValue, getValues);
    const { userInfo } = useAuth();
    const handleCreateUser = async (values) => {
        if (!isValid) return;
        // if (userInfo?.role !== "Admin") {
        //     Swal.fire("Failed", "You have no right to do this action", "warning");
        //     return;
        // }
        try {
            await createUserWithEmailAndPassword(auth, values.email, values.password);
            await addDoc(collection(db, "users"), {
                fullname: values.fullname,
                email: values.email,
                password: values.password,
                username: slugify(normalizeStrings(values.username || values.fullname), {
                    lower: true,
                    replacement: " ",
                    trim: true,
                }),
                description: values.description,
                avatar: image,
                status: values.status,
                role: values.role,
                createdAt: serverTimestamp(),
            });
            toast.success(`Create new user with email: ${values.email} successfully!`);
            setImage("");
            setProgress(0);
        } catch (error) {
            console.log(error);
            toast.error("Can not create new user");
        }
        navigate("/manage/user");
    };
    const watchStatus = watch("status");
    const watchRole = watch("role");
    useEffect(() => {
        document.title = "Add new user";
    }, []);
    return (
        <div>
            <DashboardHeading title="New user" desc="Add new user to system"></DashboardHeading>
            <form onSubmit={handleSubmit(handleCreateUser)}>
                <div className="w-[200px] h-[200px] mx-auto rounded-lg mb-10">
                    <ImageUpload
                        className="w-full h-full"
                        onChange={handleSelectImage}
                        handleDeleteImage={handleDeleteImage}
                        progress={progress}
                        image={image}
                    ></ImageUpload>
                </div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-14">
                    <Field>
                        <Label htmlFor="fullname">Fullname</Label>
                        <Input
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
                    <Field>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            name="username"
                            placeholder="Enter your username"
                            control={control}
                        ></Input>
                    </Field>
                    <Field>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            name="email"
                            placeholder="Enter your email"
                            control={control}
                            type="email"
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
                            name="password"
                            placeholder="Enter your password"
                            control={control}
                            type="password"
                            hasIcon
                        ></Input>
                        {errors.password && (
                            <span className="text-red-500 relative -mt-2 text-sm block">
                                {errors.password.message}
                            </span>
                        )}
                    </Field>

                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes>
                            <Radio
                                name="status"
                                control={control}
                                checked={watchStatus === "Active"}
                                value={"Active"}
                            >
                                Active
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={watchStatus === "Pending"}
                                value={"Pending"}
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={watchStatus === "Ban"}
                                value={"Ban"}
                            >
                                Banned
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                    <Field>
                        <Label>Role</Label>
                        <FieldCheckboxes>
                            <Radio
                                name="role"
                                control={control}
                                checked={watchRole === "Admin"}
                                value={"Admin"}
                            >
                                Admin
                            </Radio>
                            <Radio
                                name="role"
                                control={control}
                                checked={watchRole === "Mod"}
                                value={"Mod"}
                            >
                                Moderator
                            </Radio>
                            <Radio
                                name="role"
                                control={control}
                                checked={watchRole === "User"}
                                value={"User"}
                            >
                                User
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                    <Field>
                        <Label htmlFor="description">Brief description of yourself</Label>
                        <Textarea name="description" control={control}></Textarea>
                        {errors.description && (
                            <span className="text-red-500 relative -mt-2 text-sm block">
                                {errors.description.message}
                            </span>
                        )}
                    </Field>
                </div>
                <div className="text-center mt-10">
                    <Button
                        type="submit"
                        width="200px"
                        height="55px"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        Add new user
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default UserAddNew;
