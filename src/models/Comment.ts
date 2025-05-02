interface CommentProps {
    commentId: string;
    userId: string;
    username: string;
    content: string;
    createdAt: string;
}

interface CommentsProps {
    countComments: number;
    comments: CommentProps[];
}
