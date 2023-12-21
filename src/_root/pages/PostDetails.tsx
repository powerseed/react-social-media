import { useParams, Link, useNavigate } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useDeletePost, useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostStats from "@/components/shared/PostStats";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const { data: post, isPending: isPostLoading } = useGetPostById(id || '');
  const { mutate: deletePost } = useDeletePost();

  const handleDeletePost = () => {
    deletePost({ postId: id!, imageId: post?.imageId });
    navigate(-1);
  };

  return (
    <div className="post_details-container">
      {isPostLoading ? <Loader /> : (
        <div className="post_details-card">
          <img src={post?.imageUrl || '/public/assets/icons/profile-placeholder.svg'} className='post-card_img' alt="post-image" />

          <div className='post_details-info w-full'>
            <div className="flex flex-col gap-5 lg:gap-7 flex-1 w-full">
              <div className="flex-between w-full">
                <div className="flex-center gap-3">
                  <Link to={`/profile/${post?.creator.$id}`} className='w-12 h-12'>
                    <img src={post?.creator.imageUrl || '/public/assets/icons/profile-placeholder.svg'} alt="creator-image" className='rounded-full' />
                  </Link>

                  <div className='flex flex-col'>
                    <p className='base-medium lg:body-bold text-light-1'>
                      {post?.creator.email}
                    </p>

                    <div className='flex-start gap-2 text-light-3'>
                      <p className='subtle-semibold lg:small-regular'>
                        {multiFormatDateString(post?.$createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-center gap-2">
                  <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post?.creator.$id && 'hidden'}`} >
                    <img src="/public/assets/icons/edit.svg" alt="edit-post" width={24} height={24} />
                  </Link>

                  <Button className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && 'hidden'}`}
                    onClick={handleDeletePost}
                    variant="ghost">
                    <img src="/public/assets/icons/delete.svg" alt="delete-post" width={24} height={24} />
                  </Button>
                </div>
              </div>

              <hr className="border w-full border-dark-4" />

              <div className='small-medium lg:base-medium'>
                <p>{post?.caption}</p>
                <ul className='flex gap-1 mt-2'>
                  {post?.tags.map((tag: string) => (
                    <li key={tag} className='text-light-3'>
                      #{tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full">
              <PostStats post={post} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;