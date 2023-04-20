import slugify from "slugify";
import React, { useEffect } from "react";
import Radio from "../../components/checkbox/Radio";
import Input from "../../components/input/Input";
import FieldCheckboxes from "../../components/field/FieldCheckboxes";
import Field from "../../components/field/Field";
import DashboardHeading from "../dashboard/DashboardHeading";
import Button from "../../components/button/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Label } from "../../components/label";
import { db } from "../../firebase/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import normalizeStrings from "normalize-strings";
import { useNavigate } from "react-router-dom";
const CategoryAddNew = () => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        watch,
        formState: { isValid, isSubmitting },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            name: "",
            slug: "",
            status: "approved",
            createdAt: new Date(),
        },
    });
    const handleAddNewCategory = async (values) => {
        if (!isValid) return;
        const newValues = { ...values };
        newValues.slug = slugify(normalizeStrings(newValues.slug || newValues.name), {
            lower: true,
        });
        const colRef = collection(db, "categories");
        try {
            await addDoc(colRef, {
                ...newValues,
                createdAt: serverTimestamp(),
            });
            toast.success("Create new category successfully!", { autoClose: 3000 });
        } catch (error) {
            toast.error(error.message, { autoClose: 3000 });
        } finally {
            // reset({
            //     name: "",
            //     slug: "",
            //     status: "approved",
            //     createdAt: new Date(),
            // });
        }
        navigate("/manage/category");
    };
    const watchStatus = watch("status");
    useEffect(() => {
        document.title = "Add new category";
    }, []);
    return (
        <div>
            <DashboardHeading title="New category" desc="Add new category"></DashboardHeading>
            <form onSubmit={handleSubmit(handleAddNewCategory)} autoComplete="off">
                <div className="grid grid-cols-2 gap-x-10 gap-y-16">
                    <Field>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            control={control}
                            name="name"
                            placeholder="Enter your category name"
                            required
                        ></Input>
                    </Field>

                    <Field>
                        <Label htmlFor="slug">Slug</Label>
                        <Input control={control} name="slug" placeholder="Enter your slug"></Input>
                    </Field>

                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes>
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
                        </FieldCheckboxes>
                    </Field>
                </div>
                <div className="text-center mt-10">
                    <Button
                        width="220px"
                        type="submit"
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                    >
                        Add new category
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CategoryAddNew;
