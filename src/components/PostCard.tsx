"use client";
import Image from "next/image";
import { useState } from "react";
import { FiHeart, FiMessageCircle, FiBookmark, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import img_user from "../../public/img_user.webp";
import { usePostService } from "@/services/post.service";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

interface PostCardProps {
    post: PostProps;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [isLiked, setIsLiked] = useState(post.isLikedByUser);
    const [isSaved, setIsSaved] = useState(post.isSavedByUser);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const service = usePostService();

    const handleLike = async (postId: string) => {
        if (!isLiked) {
            const { error } = await service.likePost(postId);
            if (error) return toast.error(error);
        } else {
            const { error } = await service.unlikePost(postId);
            if (error) return toast.error(error);
        }

        setIsLiked(!isLiked); // Atualiza estado local também
        mutate("posts/public"); // (revalida o cache do SWR)
    };
    const handleSave = async (postId: string) => {
        if (!isLiked) {
            const { error } = await service.savePost(postId);
            if (error) return toast.error(error);
        } else {
            const { error } = await service.unsavePost(postId);
            if (error) return toast.error(error);
        }

        setIsSaved(!isSaved); // Atualiza estado local também
        mutate("posts/public"); // (revalida o cache do SWR)
    };

    const handleComment = () => {
        console.log("Abrir seção de comentários");
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? post.images.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === post.images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
            {/* User Info */}
            <div className="flex items-center gap-3">
                <Image
                    src={img_user}
                    alt="User Avatar"
                    width={30}
                    height={30}
                    className="rounded-full border-2 border-gray-200"
                />
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 cursor-pointer">{post.createdBy.username}</h3>
                    <p className="text-xs text-gray-500">
                        Followers: {post.createdBy.followerCount} | Posts: {post.createdBy.postCount}
                    </p>
                </div>
            </div>

            {/* Post Images Carousel */}
            {post.images && post.images.length > 0 && (
                <div className="relative rounded-lg overflow-hidden">
                    <Image
                        src={post.images[currentImageIndex].imageUrl}
                        alt={`${post.title} - Image ${currentImageIndex + 1}`}
                        width={600}
                        height={300}
                        className="w-full h-48 object-cover"
                    />
                    {post.images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition"
                            >
                                <FiChevronLeft size={20} />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition"
                            >
                                <FiChevronRight size={20} />
                            </button>
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                {post.images.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 rounded-full ${
                                            currentImageIndex === index ? "bg-white" : "bg-gray-400"
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Post Text */}
            <h2 className="text-base font-semibold text-gray-800">{post.title}</h2>
            <p className="text-sm text-gray-600">{post.body}</p>
            <p className="text-xs text-teal-800 font-medium">Location: {post.location}</p>

            {/* Buttons */}
            <div className="flex gap-4 text-sm">
                <button
                    onClick={() => {
                        handleLike(post.postId);
                    }}
                    className={`flex items-center gap-1 ${
                        isLiked ? "text-coral" : "text-gray-600"
                    } hover:text-coral transition-colors`}
                >
                    <FiHeart className={isLiked ? "fill-coral" : ""} size={16} />
                    <span>{post.likes.countLikes}</span>
                </button>
                <button
                    onClick={handleComment}
                    className="flex items-center gap-1 text-gray-600 hover:text-teal-800 transition-colors"
                >
                    <FiMessageCircle size={16} />
                    <span>{post.comments.countComments}</span>
                </button>
                <button
                    onClick={() => handleSave(post.postId)}
                    className={`flex items-center gap-1 ${
                        isSaved ? "text-customGreen" : "text-gray-600"
                    } hover:text-customGreen transition-colors`}
                >
                    <FiBookmark className={isSaved ? "fill-customGreen" : ""} size={16} />
                    <span>{post.countSaves}</span>
                </button>
            </div>
        </div>
    );
};
