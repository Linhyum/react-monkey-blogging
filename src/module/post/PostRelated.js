import React from "react";
import PostItem from "./PostItem";
import { useState } from "react";
import { useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

const PostRelated = ({ categoryId = "" }) => {
    const [posts, setPosts] = useState({});

    //lấy ra những bài viết có cùng danh mục dựa theo categoryId
    useEffect(() => {
        const docRef = query(collection(db, "posts"), where("categoryId", "==", categoryId));
        onSnapshot(docRef, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setPosts(results);
        });
    }, [categoryId]);
    if (!categoryId || posts.length <= 0) return null;
    return (
        <div className="post-related">
            <h2 className="home-title mb-5">Bài viết liên quan</h2>
            <div className="grid-layout grid-layout--primary">
                {posts.length > 0 &&
                    posts.map((post) => <PostItem key={post.id} post={post}></PostItem>)}
            </div>
        </div>
    );
};

export default PostRelated;
