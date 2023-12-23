import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Home = () => {
  const { data: posts, isPending: arePostsLoading } = useGetRecentPosts();

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-bold w-full'>
            Home Feed
          </h2>

          {arePostsLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="">
              {posts?.documents.map((post: Models.Document) => {
                return (
                  <li key={post.$id} className="mb-5">
                    <PostCard post={post} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home