import React from "react";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage.js";
import { NavLink } from "react-router-dom";

const PostNewestItem = ({ post, index }) => {
    return (
        <>
            {index !== 0 && <div className="h-[1px] bg-gray-300 w-full"></div>}
            <NavLink to={`/${post?.slug}`} className="flex items-center gap-x-5 py-[30px]">
                <PostImage
                    url={post?.image}
                    alt={post?.title}
                    width="w-[180px]"
                    height="h-[130px]"
                ></PostImage>
                <div>
                    <PostCategory bg="white">{post?.category?.name}</PostCategory>
                    <PostTitle margin="my-[10px]">{post?.title}</PostTitle>
                    <PostMeta
                        date={new Date(post?.createdAt?.seconds * 1000).toLocaleDateString("vi-VI")}
                        author={post?.user?.fullname}
                    ></PostMeta>
                </div>
            </NavLink>
        </>
    );
};

export default PostNewestItem;
