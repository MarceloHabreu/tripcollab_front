interface LikeProps {
    userId: string;
    username: string;
}

interface LikesProps {
    countLikes: number;
    likedByUsers: LikeProps[];
}
