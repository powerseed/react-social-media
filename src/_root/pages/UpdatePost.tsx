import PostForm from "@/components/forms/PostForm"
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom"

const UpdatePost = () => {
  const { id } = useParams();
  const { data: post, isPending: isPostLoading } = useGetPostById(id || '');

  if (isPostLoading) {
    return (
      <Loader />
    )
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="w-full max-w-5xl flex-start gap-3 justify-start">
          <img src="/public/assets/icons/add-post.svg" alt="add-post" width={36} height={36} />
          <h2 className="h3-bold md:h2-bold">Update Post</h2>
        </div>

        <PostForm action="update" post={post} />
      </div>
    </div>
  )
}

export default UpdatePost