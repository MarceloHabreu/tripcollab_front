"use client";
import { PostCard } from "@/components/PostCard";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useProfileService } from "@/services/profile.service";
import { usePostService } from "@/services/post.service";
import { useRouter } from "next/navigation";
import img_user from "../../../public/img_user.webp";
import { httpClient } from "@/http/index";
import useSWR from "swr";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [followersCount, setFollowersCount] = useState<number>(0);
    const [postsCount, setPostsCount] = useState<number>(0);
    const [username, setUsername] = useState<string>("");
    const profileService = useProfileService();
    const postService = usePostService();
    const router = useRouter();

    // Busca de perfil com SWR
    const {
        data: profile,
        error: profileError,
        isLoading: isProfileLoading,
    } = useSWR<ProfileProps>("profile", profileService.getMeProfile, {
        revalidateOnFocus: false, // Evita revalidação ao focar a janela
    });

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || "user");
            setFollowersCount(profile.followerCount || 0);
            setPostsCount(profile.postCount || 0);
        }
    }, [profile]);

    // Busca de posts com SWR
    const {
        data: posts,
        error: postsError,
        isLoading: isPostsLoading,
    } = useSWR<PostProps[]>("posts/public", postService.getPosts, {
        revalidateOnFocus: false,
    });

    // Combina estados de loading e erro
    const isLoading = isProfileLoading || isPostsLoading;
    const error = profileError || postsError;

    // Função para recarregar manualmente os dados (opcional)
    const refreshData = () => {
        // O SWR já fornece métodos para revalidar os dados, mas pode usar mutate
        // mutate("/profile"); // Revalida o perfil
        // mutate("/posts/public"); // Revalida os posts
    };

    /* const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        const filtered = mockPosts.filter((post) => post.title.toLowerCase().includes(e.target.value.toLowerCase()));
        setPosts(filtered);
    }; */

    const handleCreatePost = () => {
        router.push("/createPost");
    };

    const handleEditProfile = () => {
        router.push("/profile");
    };

    if (isLoading) return <div className="text-center p-6 text-gray-600">Loading...</div>;
    if (error) return <div className="text-center p-6 text-red-600">{error}</div>;
    return (
        <div className="">
            {/* Main Content */}
            <div className="max-w-full mx-auto p-6 flex flex-col md:flex-row gap-8">
                {/* Posts Section */}
                <div className="md:w-3/4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(posts) && posts.length > 0 ? (
                            posts.map((post) => <PostCard key={post.postId} post={post} />)
                        ) : (
                            <p className="text-center text-gray-600">No posts found.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="md:w-1/4">
                    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-4 text-center">
                        <Image
                            src={img_user}
                            alt="User Avatar"
                            width={80}
                            height={80}
                            className="rounded-full border-2 border-gray-200"
                        />
                        <h2 className="text-lg font-semibold text-gray-800">{username}</h2>
                        <p className="text-sm text-gray-600">
                            Followers: {followersCount} | Posts: {postsCount}
                        </p>
                        <button
                            onClick={handleCreatePost}
                            className="bg-yellow-400 text-black font-semibold w-full py-3 rounded-lg hover:bg-yellow-500 transition-all duration-300"
                        >
                            Create Post
                        </button>
                        <button
                            onClick={handleEditProfile}
                            className="bg-white border border-gray-300 text-gray-800 font-semibold w-full py-3 rounded-lg hover:bg-gray-100 transition-all duration-300"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="max-w-6xl mx-auto p-6 mt-12 border-t border-gray-200">
                <div className="relative w-full max-w-md mx-auto mb-4">
                    <div className="flex items-center bg-white rounded-full border border-gray-300 px-4 py-2">
                        <FiSearch className="text-gray-500 mr-2" size={20} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full outline-none text-sm text-gray-600 placeholder-gray-500"
                            /* onChange={handleSearch} */
                        />
                    </div>
                </div>
                <div className="text-center text-xs text-gray-500">
                    <a href="#" className="hover:text-customGreen transition-colors">
                        Terms of Service
                    </a>{" "}
                    |{" "}
                    <a href="#" className="hover:text-customGreen transition-colors">
                        Privacy Policy
                    </a>{" "}
                    |{" "}
                    <a href="#" className="hover:text-customGreen transition-colors">
                        Contact Us
                    </a>
                </div>
            </footer>
        </div>
    );
}
