interface PostProps {
    postId: string;
    title: string;
    body: string;
    location: string;
    createdBy: ProfileProps;
    likes: LikesProps;
    comments: CommentsProps;
    countSaves: number;
    isLikedByUser: boolean;
    isSavedByUser: boolean;
    images: ImageProps[];
    createdAt: string;
    updatedAt: string;
}
