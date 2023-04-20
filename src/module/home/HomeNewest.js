import React, { useEffect, useState } from "react";
import PostNewestLarge from "../post/PostNewestLarge";
import PostNewestItem from "../post/PostNewestItem";
import PostItem from "../post/PostItem";
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import Footer from "../footer/Footer";

const HomeNewest = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const colRef = collection(db, "posts");
        const queries = query(
            colRef,
            where("status", "==", "approved"),
            where("hot", "==", false),
            limit(4)
        );
        onSnapshot(queries, (snapshot) => {
            const result = [];
            snapshot.forEach((doc) => {
                result.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setPosts(result);
        });
    }, []);
    if (posts.length <= 0) return null;
    const [first, ...rest] = posts;
    return (
        <>
            <div className="py-20">
                <div className="container">
                    <h2 className="home-title">Mới nhất</h2>
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 mt-8">
                        <PostNewestLarge post={first}></PostNewestLarge>
                        <div>
                            <div className="bg-[#F3EDFF] rounded-xl px-5">
                                {rest.length > 0 &&
                                    rest.map((post, index) => (
                                        <PostNewestItem
                                            key={post.id}
                                            post={post}
                                            index={index}
                                        ></PostNewestItem>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeNewest;
