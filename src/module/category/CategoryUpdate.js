import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../../firebase/firebase-config";
import slugify from "slugify";
import { toast } from "react-toastify";
import DashboardHeading from "../dashboard/DashboardHeading";
import Field from "../../components/field/Field";
import { Label } from "../../components/label";
import Input from "../../components/input/Input";
import Radio from "../../components/checkbox/Radio";
import Button from "../../components/button/Button";
import normalizeStrings from "normalize-strings";
const CategoryUpdate = () => {
    const {
        control,
        reset,
        watch,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm({
        mode: "onChange",
        defaultValues: {},
    });
    const [params] = useSearchParams();
    const categoryId = params.get("id"); //lấy ra id trên thanh search

    const navigate = useNavigate();

    //lấy dữ liệu ra
    useEffect(() => {
        async function fetchData() {
            const colRef = doc(db, "categories", categoryId);
            const singleDoc = await getDoc(colRef); //singleDoc.data() là 1 category
            reset(singleDoc.data()); //reset nó để nó tự dộng điền dữ liệu vào form
        }
        fetchData();
    }, [categoryId, reset]);

    const watchStatus = watch("status");

    const handleUpdateCategory = async (values) => {
        const colRef = doc(db, "categories", categoryId);
        await updateDoc(colRef, {
            name: values.name,
            slug: slugify(normalizeStrings(values.slug || values.name), { lower: true }),
            status: values.status,
        });
        toast.success("Update category successfully!", { autoClose: 3000 });
        navigate("/manage/category");
    };
    useEffect(() => {
        document.title = "Update category";
    }, []);
    if (!categoryId) return null;
    return (
        <div>
            <DashboardHeading
                title="Update category"
                desc={`Update your category id: ${categoryId}`}
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdateCategory)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
                    <Field>
                        <Label>Name</Label>
                        <Input
                            control={control}
                            name="name"
                            placeholder="Enter your category name"
                            required
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Slug</Label>
                        <Input control={control} name="slug" placeholder="Enter your slug"></Input>
                    </Field>

                    <Field>
                        <Label>Status</Label>
                        <div className="flex flex-wrap gap-x-5">
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
                                checked={watchStatus === "unapproved"}
                                value="unapproved"
                            >
                                Unapproved
                            </Radio>
                        </div>
                    </Field>
                </div>

                <div className="text-center mt-10">
                    <Button
                        width="200px"
                        type="submit"
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                    >
                        Update category
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CategoryUpdate;
