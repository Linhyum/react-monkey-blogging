import useFireBaseImage from "../../hooks/useFireBaseImage";
import Textarea from "../../components/textarea/Textarea";
import slugify from "slugify";
import Radio from "../../components/checkbox/Radio";
import normalizeStrings from "normalize-strings";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import ImageUpload from "../../components/image/ImageUpload";
import FieldCheckboxes from "../../components/field/FieldCheckboxes";
import Field from "../../components/field/Field";
import DashboardHeading from "../dashboard/DashboardHeading";
import Button from "../../components/button/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
const UserProfile = () => {
    const validationSchema = Yup.object().shape({
        fullname: Yup.string().required("Fullname is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        description: Yup.string().required("Description is required"),
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
        watch,
        reset,
        getValues,
        setValue,
        formState: { isSubmitting, errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema),
    }); //lấy ra id trên thanh search
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const userId = params.get("id"); //lấy ra id trên thanh search
    const watchStatus = watch("status");
    const watchRole = watch("role");
    const imageUrl = getValues("avatar");
    const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl); //lấy ra tên hình ảnh từ đường dẫn
    const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";

    async function deleteAvatar() {
        //khi xoá sẽ set image là rỗng
        const colRef = doc(db, "users", userId);
        await updateDoc(colRef, {
            avatar: "",
        });
    }

    const { image, setImage, progress, handleSelectImage, handleDeleteImage } = useFireBaseImage(
        setValue,
        getValues,
        imageName,
        deleteAvatar //khi xoá sẽ set image là rỗng
    );
    //khi bấm qua trang update user thì sẽ tự động điền ảnh vào
    useEffect(() => {
        setImage(imageUrl);
    }, [imageUrl, setImage]);

    //lấy dữ liệu ra
    useEffect(() => {
        async function fetchData() {
            const colRef = doc(db, "users", userId);
            const singleDoc = await getDoc(colRef); //singleDoc.data() là 1 user
            reset(singleDoc.data()); //reset nó để nó tự dộng điền dữ liệu vào form
        }
        fetchData();
    }, [userId, reset]);

    const handleUpdateUser = async (values) => {
        const colRef = doc(db, "users", userId);
        await updateDoc(colRef, {
            fullname: values.fullname,
            email: values.email,
            password: values.password,
            username: slugify(normalizeStrings(values.username || values.fullname), {
                lower: true,
                replacement: " ",
                trim: true,
            }),
            avatar: image,
            description: values.description,
            status: values.status,
            role: values.role,
        });
        toast.success("Update user successfully!", { autoClose: 3000 });
        navigate("/manage/user");
    };
    useEffect(() => {
        document.title = "Account information";
    }, []);
    if (!userId) return null;
    return (
        <div>
            <DashboardHeading
                title="Account information"
                desc="Update your account information"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdateUser)}>
                <div className="w-[200px] h-[200px] mx-auto rounded-lg mb-10">
                    <ImageUpload
                        className="w-full h-full"
                        onChange={handleSelectImage}
                        handleDeleteImage={handleDeleteImage}
                        progress={progress}
                        image={image}
                    ></ImageUpload>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
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
                    <Button width="200px" isLoading={isSubmitting} disabled={isSubmitting}>
                        Update user
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;
