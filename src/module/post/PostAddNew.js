import useFireBaseImage from "../../hooks/useFireBaseImage";
import Toggle from "../../components/toggle/Toggle";
import styled from "styled-components";
import slugify from "slugify";
import React, { useEffect, useState } from "react";
import Radio from "../../components/checkbox/Radio";
import Option from "../../components/dropdown/Option";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import ImageUpload from "../../components/image/ImageUpload";
import Field from "../../components/field/Field";
import Dropdown from "../../components/dropdown/Dropdown";
import Button from "../../components/button/Button";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/auth-context";
import { toast } from "react-toastify";
import { db } from "../../firebase/firebase-config";
import normalizeStrings from "normalize-strings";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const PostAddNewStyles = styled.div``;
const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        ["link", "image"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["clean"],
    ],
    clipboard: {
        matchVisual: false, //giữ nguyên định dạng khi coppy cái bên ngoài vào
    },
};
const PostAddNew = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const { userInfo } = useAuth();
    const {
        control,
        watch,
        setValue,
        getValues,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            title: "",
            slug: "",
            status: "pending",
            hot: false,
            category: {},
            user: {},
            image: "",
            content: "",
        },
    });
    const { image, setImage, progress, setProgress, handleSelectImage, handleDeleteImage } =
        useFireBaseImage(setValue, getValues);
    const watchStatus = watch("status"); //theo dõi trạng thái thay đổi như thế nào
    const watchHot = watch("hot"); //theo dõi trạng thái bài viết nổi bật
    const [categories, setCategories] = useState([]);

    const [selectCategory, setSelectCategory] = useState("Please select an option");

    //lấy ra thông tin user đưa vào obj
    useEffect(() => {
        async function fetchData() {
            if (!userInfo?.uid) return;
            const q = query(collection(db, "users"), where("email", "==", userInfo.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setValue("user", {
                    id: doc.id,
                    ...doc.data(),
                });
            });
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo?.uid]);
    const addPostHandler = async (values) => {
        try {
            values.slug = slugify(normalizeStrings(values.slug || values.title), {
                lower: true,
            }); //convert slug to dạng gạch ngang (d n l=> d-n-l)
            const colRef = collection(db, "posts");
            await addDoc(colRef, {
                ...values,
                image, //là đường dẫn hình ảnh
                createdAt: serverTimestamp(), //thời gian tạo bài viết
                content, //nội dụng react quill
                categoryId: values.category.id, //lấy ra id category
                userId: values.user.id,
            });
            toast.success("Create new post successfully!", {
                autoClose: 3000,
            });
            setImage("");
            setProgress(0);
            setSelectCategory("Please select an option");
            navigate("/manage/post");
        } catch (error) {
            toast.error("Please select a category!", { autoClose: 3000 });
        }
    };
    //lấy ra data danh mục(categories)
    useEffect(() => {
        async function getData() {
            const colRef = collection(db, "categories");
            const q = query(colRef, where("status", "==", "approved"));
            const querySnapshot = await getDocs(q);
            const result = [];
            querySnapshot.forEach((doc) => {
                result.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setCategories(result);
        }
        getData();
    }, []);

    //lấy ra thông tin category đưa vào obj
    const handleClickOption = async (item) => {
        const colRef = doc(db, "categories", item.id);
        const docData = await getDoc(colRef);
        setValue("category", {
            id: docData.id,
            ...docData.data(),
        });
        setSelectCategory(item.name);
    };

    useEffect(() => {
        document.title = "Add new post";
    }, []);
    const quillModules = {
        ...modules,
        toolbar: [...modules.toolbar],
    };

    return (
        <PostAddNewStyles>
            <h1 className="dashboard-heading">Add new post</h1>
            <form onSubmit={handleSubmit(addPostHandler)}>
                <div className="grid grid-cols-2 gap-x-10 gap-y-14">
                    <Field>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            control={control}
                            placeholder="Enter your title"
                            name="title"
                            required
                        ></Input>
                    </Field>
                    <Field>
                        <Label htmlFor="slug">Slug</Label>
                        <Input control={control} placeholder="Enter your slug" name="slug"></Input>
                    </Field>

                    <Field>
                        <Label htmlFor="image">Image</Label>
                        <ImageUpload
                            onChange={handleSelectImage}
                            name="image"
                            progress={progress}
                            image={image}
                            handleDeleteImage={handleDeleteImage}
                        ></ImageUpload>
                    </Field>
                    <Field>
                        <Label>Category</Label>
                        <Dropdown placeholder={selectCategory}>
                            {categories.length > 0 &&
                                categories.map((item) => (
                                    <Option onClick={() => handleClickOption(item)} key={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                        </Dropdown>
                    </Field>

                    <Field>
                        <Label>Feature post</Label>
                        <Toggle on={watchHot} onClick={() => setValue("hot", !watchHot)}></Toggle>
                    </Field>
                    <Field>
                        <Label>Status</Label>
                        <div className="flex items-center gap-x-5">
                            <Radio
                                name="status"
                                control={control}
                                checked={watchStatus === "approved"}
                                value="approved"
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={watchStatus === "pending"}
                                value="pending"
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={watchStatus === "reject"}
                                value="reject"
                            >
                                Reject
                            </Radio>
                        </div>
                    </Field>
                </div>
                <div className="mt-10 w-full">
                    <Field>
                        <Label>Content</Label>
                        <div className="w-full entry-content">
                            <ReactQuill
                                modules={quillModules}
                                theme="snow"
                                value={content}
                                onChange={setContent}
                            />
                        </div>
                    </Field>
                </div>
                <div className="text-center mt-10">
                    <Button
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                        width="200px"
                        type="submit"
                    >
                        Add new post
                    </Button>
                </div>
            </form>
        </PostAddNewStyles>
    );
};

export default PostAddNew;
