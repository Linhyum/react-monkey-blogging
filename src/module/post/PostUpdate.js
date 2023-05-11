import React from "react";
import Button from "../../components/button/Button";
import Radio from "../../components/checkbox/Radio";
import Label from "../../components/label/Label";
import Field from "../../components/field/Field";
import Toggle from "../../components/toggle/Toggle";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useFireBaseImage from "../../hooks/useFireBaseImage";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useMemo } from "react";
import axios from "axios";
import DashboardHeading from "../dashboard/DashboardHeading";
import Input from "../../components/input/Input";
import ImageUpload from "../../components/image/ImageUpload";
import Dropdown from "../../components/dropdown/Dropdown";
import Option from "../../components/dropdown/Option";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import { DropdownProvider } from "../../components/dropdown/dropdown-context";
Quill.register("modules/imageUploader", ImageUploader);

const PostUpdate = () => {
    const {
        control,
        handleSubmit,
        watch,
        reset,
        getValues,
        setValue,
        formState: { isSubmitting },
    } = useForm({
        mode: "onChange",
    });
    const [params] = useSearchParams();
    const postId = params.get("id"); //lấy ra id trên thanh search
    const navigate = useNavigate();
    const watchStatus = watch("status");
    const watchHot = watch("hot");
    const imageUrl = getValues("image");
    const imageName = getValues("image_name");
    const [categories, setCategories] = useState([]);
    const [selectCategory, setSelectCategory] = useState("Please select an option");
    const [content, setContent] = useState("");
    const { image, setImage, progress, handleSelectImage, handleDeleteImage } = useFireBaseImage(
        setValue,
        getValues,
        imageName,
        deletePostImage //khi xoá sẽ set image là rỗng
    );
    async function deletePostImage() {
        //khi xoá sẽ set image là rỗng
        const colRef = doc(db, "posts", postId);
        await updateDoc(colRef, {
            image: "",
        });
    }
    //khi bấm qua trang update post thì sẽ tự động điền ảnh vào
    useEffect(() => {
        setImage(imageUrl);
    }, [imageUrl, setImage]);

    //lấy dữ liệu ra
    useEffect(() => {
        async function fetchData() {
            if (!postId) return;
            const colRef = doc(db, "posts", postId);
            const singleDoc = await getDoc(colRef); //singleDoc.data() là 1 post
            reset(singleDoc?.data()); //reset nó để nó tự dộng điền dữ liệu vào form
            setSelectCategory(singleDoc.data()?.category.name); //tự dộng điền tên danh mục vào form
            setContent(singleDoc.data()?.content); //tự dộng điền nội dung vào form
        }
        fetchData();
    }, [postId, reset]);

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

    const handleUpdatePost = async (values) => {
        try {
            const colRef = doc(db, "posts", postId);
            await updateDoc(colRef, {
                ...values,
                content,
                image,
            });
            toast.success("Update post successfully!", { autoClose: 3000 });
            navigate("/manage/post");
        } catch (error) {
            toast.error("Please select a category!", { autoClose: 3000 });
        }
    };
    const modules = useMemo(
        () => ({
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
            imageUploader: {
                upload: async (file) => {
                    const bodyFormData = new FormData(); //hiển thị hình ảnh
                    bodyFormData.append("image", file);
                    const response = await axios({
                        method: "post", //thêm vào database
                        url: `https://api.imgbb.com/1/upload?key=dee4f40c6fff07ce193ff506b78168bb`,
                        data: bodyFormData,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    return response.data.data.url;
                },
            },
        }),
        []
    );
    useEffect(() => {
        document.title = "Update post";
    }, []);
    if (!postId) return null;
    return (
        <div>
            <DashboardHeading title="Update post" desc="Update post content"></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdatePost)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
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
                        <DropdownProvider>
                            <Dropdown placeholder={selectCategory}>
                                {categories.length > 0 &&
                                    categories.map((item) => (
                                        <Option
                                            onClick={() => handleClickOption(item)}
                                            key={item.id}
                                        >
                                            {item.name}
                                        </Option>
                                    ))}
                            </Dropdown>
                        </DropdownProvider>
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
                                modules={modules}
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
                        Update post
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PostUpdate;
