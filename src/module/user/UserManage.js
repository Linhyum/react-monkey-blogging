import Table from "../../components/table/Table";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import LabelStatus from "../../components/label/LabelStatus";
import DashboardHeading from "../dashboard/DashboardHeading";
import Button from "../../components/button/Button";
import ActionEdit from "../../components/action/ActionEdit";
import ActionDelete from "../../components/action/ActionDelete";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
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

const userCount = 5;
const UserManage = () => {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    //tổng số user
    const [total, setTotal] = useState(0);
    //tìm user
    const [filter, setFilter] = useState("");

    //load more
    const [lastDoc, setLastDoc] = useState();
    //load more
    const handleLoadMoreCategory = async () => {
        const nextRef = query(collection(db, "users"), startAfter(lastDoc || 0), limit(userCount));
        onSnapshot(nextRef, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setUserList([...userList, ...results]); //lấy những giá trị trước đó và những giá trị mới để load ra thêm
        });
        const documentSnapshots = await getDocs(nextRef);
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastDoc(lastVisible);
    };

    //lấy ra danh sách user,tìm user
    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "users");
            const newRef = filter
                ? query(
                      colRef,
                      where("fullname", ">=", filter),
                      where("fullname", "<=", `${filter}utf8`)
                  ) //lấy ra những user có fullname = giá trị input nhập vào
                : query(colRef, limit(userCount));
            const documentSnapshots = await getDocs(newRef);
            const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

            ///lấy ra tổng số các user
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
                setUserList(results);
            });
            setLastDoc(lastVisible);
        }
        fetchData();
    }, [filter]);

    //xoá user
    const handleDeleteUser = (user) => {
        // if (userInfo?.role !== "Admin") {
        //     Swal.fire("Failed", "You have no right to do this action", "warning");
        //     return;
        // }
        const colRef = doc(db, "users", user.id);
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
                await deleteDoc(colRef); //xoá trong firestore database
                Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
        });
    };

    //tìm kiếm danh mục
    const handleInputFilter = debounce((e) => {
        setFilter(e.target.value);
    }, 500);
    useEffect(() => {
        document.title = "User manage";
    }, []);
    return (
        <div>
            <div className="flex flex-col sm:flex-row items-center justify-between">
                <DashboardHeading title="Users" desc="Manage your users"></DashboardHeading>
                <NavLink className={"inline-block mb-10"} to={"/manage/add-user"}>
                    <Button width="200px" height="55px">
                        Add user
                    </Button>
                </NavLink>
            </div>
            <div className="mb-10 flex justify-end">
                <input
                    onChange={handleInputFilter}
                    type="text"
                    placeholder="Search user..."
                    className="w-[250px] border border-gray-300 rounded-lg py-3 px-4 outline-none  bg-transparent"
                />
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Info</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.length > 0 &&
                        userList.map((user) => (
                            <tr key={user.id}>
                                <td title={user.id} className="max-w-[100px] truncate">
                                    {user.id}
                                </td>
                                <td className="whitespace-nowrap">
                                    <div className="flex items-center gap-x-3">
                                        <img
                                            src={user.avatar}
                                            alt="avatar"
                                            className="w-10 h-10 flex-shrink-0 rounded-full object-cover"
                                        />
                                        <div className="flex-1 max-w-[150px] truncate">
                                            <h3 title={user.fullname} className="truncate">
                                                {user.fullname}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                {new Date(
                                                    user.createdAt.seconds * 1000
                                                ).toLocaleDateString("vi-VI")}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td title={user.username} className="max-w-[150px] truncate">
                                    {user.username}
                                </td>
                                <td title={user.email} className="max-w-[150px] truncate">
                                    {user.email}
                                </td>
                                <td>
                                    <LabelStatus
                                        type={
                                            user.status === "Active"
                                                ? "success"
                                                : user.status === "Pending"
                                                ? "warning"
                                                : "danger"
                                        }
                                    >
                                        {user.status}
                                    </LabelStatus>
                                </td>
                                <td>{user.role}</td>
                                <td>
                                    <div className="flex gap-5 text-gray-500">
                                        <ActionEdit
                                            onClick={() =>
                                                navigate(`/manage/update-user?id=${user.id}`)
                                            }
                                        ></ActionEdit>
                                        <ActionDelete
                                            onClick={() => handleDeleteUser(user)}
                                        ></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            {total > userList.length && (
                <div className="mt-10 text-center">
                    <Button onClick={handleLoadMoreCategory} width="200px" height="55px">
                        Load more
                    </Button>
                </div>
            )}
        </div>
    );
};

export default UserManage;
