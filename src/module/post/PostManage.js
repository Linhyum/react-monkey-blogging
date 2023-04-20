import Table from "../../components/table/Table";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import ActionView from "../../components/action/ActionView";
import ActionEdit from "../../components/action/ActionEdit";
import ActionDelete from "../../components/action/ActionDelete";
import { NavLink, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
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
import LabelStatus from "../../components/label/LabelStatus";
import DashboardHeading from "../dashboard/DashboardHeading";
import { useAuth } from "../../contexts/auth-context";

const postCount = 5;
const PostManage = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const [postList, setPostList] = useState([]);
    //tổng số post
    const [total, setTotal] = useState(0);
    //tìm post
    const [filter, setFilter] = useState("");
    //load more
    const [lastDoc, setLastDoc] = useState();
    //load more
    const handleLoadMorePost = async () => {
        const nextRef = query(collection(db, "posts"), startAfter(lastDoc || 0), limit(postCount));
        onSnapshot(nextRef, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setPostList([...postList, ...results]); //lấy những giá trị trước đó và những giá trị mới để load ra thêm
        });
        const documentSnapshots = await getDocs(nextRef);
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastDoc(lastVisible);
    };

    //lấy ra danh sách post,tìm post
    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "posts");
            const newRef = filter
                ? query(colRef, where("title", ">=", filter), where("title", "<=", `${filter}utf8`)) //lấy ra những post có title = giá trị input nhập vào
                : query(colRef, limit(postCount));
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
                setPostList(results);
            });
            setLastDoc(lastVisible);
        }
        fetchData();
    }, [filter]);

    //xoá post
    const handleDeleteUser = (post) => {
        // if (userInfo?.role !== "Admin") {
        //     Swal.fire("Failed", "You have no right to do this action", "warning");
        //     return;
        // }
        const colRef = doc(db, "posts", post.id);
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
                Swal.fire("Deleted!", "Your post has been deleted.", "success");
            }
        });
    };

    //tìm kiếm post
    const handleInputFilter = debounce((e) => {
        setFilter(e.target.value);
    }, 500);
    useEffect(() => {
        document.title = "Post manage";
    }, []);
    if (userInfo?.role !== "Admin")
        return (
            <div>
                <div className="flex flex-col sm:flex-row items-center justify-between">
                    <DashboardHeading title="Posts" desc="Manage your posts"></DashboardHeading>
                    <NavLink className={"inline-block mb-10"} to={"/manage/add-post"}>
                        <Button width="200px" height="55px">
                            Add post
                        </Button>
                    </NavLink>
                </div>
                <div className="mb-10 flex justify-end">
                    <input
                        onChange={handleInputFilter}
                        type="text"
                        className="w-[250px] border border-gray-300 rounded-lg py-3 px-4 outline-none  bg-transparent"
                        placeholder="Search post..."
                    />
                </div>

                <Table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Post</th>
                            <th>Category</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postList.length > 0 &&
                            postList.map((post) => (
                                <tr key={post.id}>
                                    <td title={post.id} className="max-w-[100px] truncate">
                                        {post.id}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-x-3">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-[50px] h-[50px] flex-shrink-0 rounded object-cover"
                                            />
                                            <div className="flex-1 max-w-[150px] truncate">
                                                <h3
                                                    title={post.title}
                                                    className="font-semibold truncate"
                                                >
                                                    {post.title}
                                                </h3>
                                                <time className="text-sm text-gray-500">
                                                    {new Date(
                                                        post.createdAt.seconds * 1000
                                                    ).toLocaleDateString("vi-VI")}
                                                </time>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-gray-500">{post.category.name}</span>
                                    </td>
                                    <td>
                                        <span className="text-gray-500">{post.user.fullname}</span>
                                    </td>
                                    <td>
                                        <LabelStatus
                                            type={
                                                post?.status === "approved"
                                                    ? "success"
                                                    : post?.status === "pending"
                                                    ? "warning"
                                                    : "danger"
                                            }
                                        >
                                            {post?.status}
                                        </LabelStatus>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-x-3 text-gray-500">
                                            <ActionView
                                                onClick={() => navigate(`/${post.slug}`)}
                                            ></ActionView>
                                            <ActionEdit
                                                onClick={() =>
                                                    navigate(`/manage/update-post?id=${post.id}`)
                                                }
                                            ></ActionEdit>
                                            <ActionDelete
                                                onClick={() => handleDeleteUser(post)}
                                            ></ActionDelete>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
                {total > postList.length && (
                    <div className="mt-10 text-center">
                        <Button onClick={handleLoadMorePost} width="200px" height="55px">
                            Load more
                        </Button>
                    </div>
                )}
            </div>
        );
};

export default PostManage;
