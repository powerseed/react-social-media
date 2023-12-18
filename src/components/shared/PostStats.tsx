import { useDeleteSave, useGetCurrentUser, useLikePost, useSavePost } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'

type PostStatsProps = {
    post: Models.Document,
}

const PostStats = ({ post }: PostStatsProps) => {
    const { data: currentUser } = useGetCurrentUser();

    let likedUsersList = post.likes.map((user: Models.Document) => user.$id);
    let isLiked = likedUsersList.includes(currentUser?.$id) ? true : false;
    let saveId = currentUser?.save.find((save: Models.Document) => save.post.$id === post.$id)?.$id;

    const { mutateAsync: likePost } = useLikePost();
    const { mutateAsync: savePost } = useSavePost();
    const { mutateAsync: deleteSave } = useDeleteSave();

    const handleLikePost = (event: React.MouseEvent) => {
        event.stopPropagation();

        if (isLiked) {
            likedUsersList = likedUsersList.filter((id: string) => id != currentUser?.$id);
            isLiked = false;
        }
        else {
            likedUsersList.push(currentUser?.$id);
            isLiked = true;
        }

        likePost({ postId: post.$id, likesArray: likedUsersList });
    }

    const handleSavePost = async (event: React.MouseEvent) => {
        event.stopPropagation();

        if (saveId) {
            deleteSave(saveId);
            saveId = undefined;
        }
        else {
            const newSave = await savePost({ postId: post.$id, userId: currentUser!.$id });
            saveId = newSave!.$id;
        }
    }

    return (
        <div className='flex justify-between items-center'>
            <div className='flex gap-2 mr-5'>
                <img src={isLiked ? "/public/assets/icons/liked.svg" : "/public/assets/icons/like.svg"}
                    alt={isLiked ? "liked" : "like"}
                    width={20}
                    height={20}
                    onClick={handleLikePost}
                    className='cursor-pointer' />
                <p className='small-medium lg:base-medium'>{likedUsersList.length}</p>
            </div>

            <div className='flex gap-2'>
                <img src={saveId != undefined ? "/public/assets/icons/saved.svg" : "/public/assets/icons/save.svg"}
                    alt={saveId != undefined ? "saved" : "save"}
                    width={20}
                    height={20}
                    onClick={handleSavePost}
                    className='cursor-pointer' />
            </div>
        </div>
    )
}

export default PostStats