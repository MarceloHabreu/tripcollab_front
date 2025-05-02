import { httpClient } from "../http";

const resourceUrl: string = "/posts";

export const usePostService = () => {
    const getPosts = async (): Promise<PostProps[]> => {
        const response = await httpClient.get(`${resourceUrl}/public`);
        const postsData = response.data.data || response.data;
        const posts = postsData.map((post: any) => ({
            ...post,
            createdBy: {
                username: post.createdBy.username,
                followers: post.createdBy.followerCount.toString(),
                postCount: post.createdBy.postCount,
                avatar: "",
            },
        }));
        return posts;
    };

    const likePost = async (postId: string): Promise<{ error?: string }> => {
        try {
            await httpClient.post(`${resourceUrl}/${postId}/likes`);
            return {}; // -> response 204
        } catch (error: any) {
            if (error.response?.data?.error) {
                return { error: error.response.data.error };
            }
            return { error: "Network error or server unreachable." };
        }
    };

    const unlikePost = async (postId: string): Promise<{ error?: string }> => {
        try {
            await httpClient.delete(`${resourceUrl}/${postId}/likes`);
            return {}; // -> response 204
        } catch (error: any) {
            if (error.response?.data?.error) {
                return { error: error.response.data.error };
            }
            return { error: "Network error or server unreachable." };
        }
    };
    const savePost = async (postId: string): Promise<{ error?: string }> => {
        try {
            await httpClient.post(`${resourceUrl}/${postId}/saves`);
            return {}; // -> response 204
        } catch (error: any) {
            if (error.response?.data?.error) {
                return { error: error.response.data.error };
            }
            return { error: "Network error or server unreachable." };
        }
    };

    const unsavePost = async (postId: string): Promise<{ error?: string }> => {
        try {
            await httpClient.delete(`${resourceUrl}/${postId}/saves`);
            return {}; // -> response 204
        } catch (error: any) {
            if (error.response?.data?.error) {
                return { error: error.response.data.error };
            }
            return { error: "Network error or server unreachable." };
        }
    };

    return {
        getPosts,
        likePost,
        unlikePost,
        savePost,
        unsavePost,
    };
};

export default usePostService;
