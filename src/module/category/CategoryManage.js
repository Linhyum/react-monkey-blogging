import Table from "../../components/table/Table";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import LabelStatus from "../../components/label/LabelStatus";
import DashboardHeading from "../dashboard/DashboardHeading";
import Button from "../../components/button/Button";
import ActionEdit from "../../components/action/ActionEdit";
import ActionDelete from "../../components/action/ActionDelete";
import { NavLink, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase-config";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    onSnapshot,
    query,
    startAfter,
    where,
} from "firebase/firestore";
import { debounce } from "lodash";

const categoryCount = 5;
const CategoryManage = () => {
    const [categoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();

    //tổng số danh mục
    const [total, setTotal] = useState(0);

    //tìm danh mục
    const [filter, setFilter] = useState("");

    //load more
    const [lastDoc, setLastDoc] = useState();
    //load more
    const handleLoadMoreCategory = async () => {
        const nextRef = query(
            collection(db, "categories"),
            startAfter(lastDoc || 0),
            limit(categoryCount)
        );
        onSnapshot(nextRef, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setCategoryList([...categoryList, ...results]); //lấy những giá trị trước đó và những giá trị mới để load ra thêm
        });
        const documentSnapshots = await getDocs(nextRef);
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastDoc(lastVisible);
    };

    //lấy ra danh sách danh mục,tìm danh muc
    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "categories");
            const newRef = filter
                ? query(colRef, where("name", ">=", filter), where("name", "<=", `${filter}utf8`)) //lấy ra những danh mục có name = giá trị input nhập vào
                : query(colRef, limit(categoryCount));
            const documentSnapshots = await getDocs(newRef);
            const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

            ///lấy ra tổng số các danh mục
            onSnapshot(colRef, (snapshot) => {
                setTotal(snapshot.size);
            });

            onSnapshot(newRef, (snapshot) => {
                const results = [];
                snapshot.forEach((doc) => {
                    results.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setCategoryList(results);
            });
            setLastDoc(lastVisible);
        }
        fetchData();
    }, [filter]);

    //xoá danh mục
    const handleDeleteCategory = (categoryId) => {
        // if (userInfo?.role !== "Admin") {
        //     Swal.fire("Failed", "You have no right to do this action", "warning");
        //     return;
        // }
        const colRef = doc(db, "categories", categoryId);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteDoc(colRef);
                Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
        });
    };

    //sửa danh mục
    const handleEditCategory = (categoryId) => {
        navigate(`/manage/update-category?id=${categoryId}`);
    };

    //tìm kiếm danh mục
    const handleInputFilter = debounce((e) => {
        setFilter(e.target.value);
    }, 500);
    useEffect(() => {
        document.title = "Category manage";
    }, []);
    return (
        <div>
            <div className="flex flex-col sm:flex-row items-center justify-between">
                <DashboardHeading title="Categories" desc="Manage your category"></DashboardHeading>
                <NavLink className={"inline-block mb-10"} to={"/manage/add-category"}>
                    <Button width="200px" height="55px">
                        Add category
                    </Button>
                </NavLink>
            </div>
            <div className="mb-10 flex justify-end">
                <input
                    onChange={handleInputFilter}
                    type="text"
                    placeholder="Search category..."
                    className="w-[250px] border border-gray-300 rounded-lg py-3 px-4 outline-none  bg-transparent"
                />
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryList.length > 0 &&
                        categoryList.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>
                                    <em className="text-gray-500">{item.slug}</em>
                                </td>
                                <td>
                                    <LabelStatus
                                        type={item.status === "approved" ? "success" : "danger"}
                                    >
                                        {item.status}
                                    </LabelStatus>
                                </td>
                                <td>
                                    <div className="flex gap-5 text-gray-500">
                                        <ActionEdit
                                            onClick={() => handleEditCategory(item.id)}
                                        ></ActionEdit>
                                        <ActionDelete
                                            onClick={() => handleDeleteCategory(item.id)}
                                        ></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            {total > categoryList.length && (
                <div className="mt-10 text-center">
                    <Button onClick={handleLoadMoreCategory} width="200px" height="55px">
                        Load more
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CategoryManage;
