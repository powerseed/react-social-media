import { AuthContext } from '@/context/AuthContext'
import { Models } from 'appwrite'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'

type GridPostListProps = {
    posts: Models.Document[],
    showUser?: boolean,
    showStats?: boolean
}

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
    return (
        <ul className='grid-container'>
            {posts.map((post) => (
                <li key={post.$id} className='relative min-w-80 h-80'>
                    <Link to={`/posts/${post.$id}`} className='grid-post_link'>
                        <img src={post.imageUrl} alt="post-image" className='h-full w-full object-cover' />
                    </Link>

                    <div className='grid-post_user'>
                        {showUser && (
                            <div className='flex items-center justify-start gap-2'>
                                <img src={post.creator.imageUrl} alt="creator-image" className='h-8 w-8 rounded-full' />

                                <p className='line-clamp-1'>{post.creator.email}</p>
                            </div>
                        )}

                        {showStats && <PostStats post={post} />}
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default GridPostList