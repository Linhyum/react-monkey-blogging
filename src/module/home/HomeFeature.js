import React, { useEffect, useState } from "react";
import PostFeatureItem from "../post/PostFeatureItem";
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
const HomeFeature = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const colRef = collection(db, "posts");
        const queries = query(
            colRef,
            where("status", "==", "approved"),
            where("hot", "==", true),
            limit(3)
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
    return (
        <div className="mt-20">
            <div className="container">
                <h2 className="home-title">Bài viết nổi bật</h2>
                <div className="grid mt-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                    {posts.map((item) => (
                        <PostFeatureItem item={item} key={item.id}></PostFeatureItem>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeFeature;
