import Loader from './Loader'
import GridPostList from './GridPostList'

type SearchResultsProps = {
    areSearchResultsLoading: boolean,
    searchedPosts: any
}

const SearchResults = ({ areSearchResultsLoading, searchedPosts }: SearchResultsProps) => {
    if (areSearchResultsLoading) {
        return <Loader />
    }

    if (searchedPosts.documents.length > 0) {
        return (
            <GridPostList posts={searchedPosts.documents} />
        );
    }

    return (
        <p className='text-light-4 mt-10 w-full'>No results found. </p>
    )
}

export default SearchResults