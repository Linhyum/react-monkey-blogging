import slugify from "slugify";
import React from "react";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage.js";
import PostCategory from "./PostCategory";
import normalizeStrings from "normalize-strings";
import { NavLink } from "react-router-dom";

const PostFeatureItem = ({ item }) => {
    if (!item || !item.id) return null;
    //thời gian tạo bài viết
    const date = item?.createdAt?.seconds ? new Date(item?.createdAt?.seconds * 1000) : new Date();
    const formatDate = new Date(date).toLocaleDateString("vi-VI");
    return (
        <NavLink to={`/${item?.slug}`} className="relative h-[300px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 z-10 bg-black bg-opacity-30"></div>
            <PostImage url={item.image} alt={item.title}></PostImage>
            <div className="absolute z-20 inset-0 p-4">
                <div className="flex items-center">
                    {item.category?.name && (
                        <PostCategory to={item.category.slug}>{item.category.name}</PostCategory>
                    )}
                    <PostMeta
                        to={slugify(normalizeStrings(item.user?.fullname || ""), { lower: true })}
                        date={formatDate}
                        author={item.user?.fullname}
                        className1="text-white ml-auto"
                        className2="bg-white"
                    ></PostMeta>
                </div>
                <PostTitle to={item.slug} big={true} cl="white" margin="mt-5">
                    {item.title}
                </PostTitle>
            </div>
        </NavLink>
    );
};

export default PostFeatureItem;
