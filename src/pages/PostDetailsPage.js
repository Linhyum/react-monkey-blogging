import styled from "styled-components";
import React from "react";
import PostRelated from "../module/post/PostRelated";
import PostMeta from "../module/post/PostMeta";
import PostCategory from "../module/post/PostCategory";
import NotFoundPage from "./NotFoundPage";
import Layout from "../components/layout/Layout";
import AuthorBox from "../components/author/AuthorBox";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { db } from "../firebase/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
const PostDetailsPageStyles = styled.div`
    padding-bottom: 100px;
    .post {
        &-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 40px;
            margin: 40px 0;
        }
        &-feature {
            width: 100%;
            max-width: 640px;
            height: 466px;
            border-radius: 20px;
            object-fit: cover;
        }
        &-heading {
            font-weight: bold;
            font-size: 36px;
            margin-bottom: 16px;
        }
        &-info {
            flex: 1;
        }
        &-content {
            max-width: 700px;
            margin: 80px auto;
        }
    }
    @media screen and (max-width: 1023.98px) {
        padding-bottom: 40px;
        .post {
            &-header {
                flex-direction: column;
            }
            &-feature {
                height: auto;
                object-fit: cover;
            }
            &-heading {
                font-size: 26px;
            }
            &-content {
                margin: 40px 0;
            }
        }
    }
`;

const PostDetailsPage = () => {
    const { slug } = useParams(); //lấy ra đường dẫn của bài viết
    const [postInfo, setPostInfo] = useState({});

    //lấy ra thông tin bài viết
    useEffect(() => {
        async function fetchData() {
            if (!slug) return;
            const colRef = query(collection(db, "posts"), where("slug", "==", slug));
            onSnapshot(colRef, (snapshot) => {
                snapshot.forEach((doc) => {
                    doc.data() &&
                        setPostInfo({
                            id: doc.id,
                            ...doc.data(),
                        });
                });
            });
        }
        fetchData();
    }, [slug]);
    useEffect(() => {
        document.body.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [slug]);
    useEffect(() => {
        document.title = postInfo.title;
    }, [postInfo.title]);
    if (!slug) return <NotFoundPage></NotFoundPage>;
    if (!postInfo.title) return null;
    return (
        <PostDetailsPageStyles>
            <Layout>
                <div className="container">
                    <div className="post-header">
                        <img className="post-feature" src={postInfo?.image} alt={postInfo?.title} />
                        <div className="post-info">
                            <PostCategory to={postInfo?.category?.slug}>
                                {postInfo?.category?.name}
                            </PostCategory>
                            <h1 className="post-heading mt-5">{postInfo?.title}</h1>
                            <PostMeta
                                date={new Date(
                                    postInfo?.user?.createdAt?.seconds * 1000
                                ).toLocaleDateString("vi-VI")}
                                author={postInfo?.user?.fullname}
                            ></PostMeta>
                        </div>
                    </div>
                    <div className="post-content">
                        <div
                            className="entry-content"
                            dangerouslySetInnerHTML={{
                                __html: postInfo.content || "",
                            }}
                        ></div>
                        <AuthorBox postInfo={postInfo}></AuthorBox>
                    </div>
                    <PostRelated categoryId={postInfo?.categoryId}></PostRelated>
                </div>
            </Layout>
        </PostDetailsPageStyles>
    );
};

export default PostDetailsPage;
