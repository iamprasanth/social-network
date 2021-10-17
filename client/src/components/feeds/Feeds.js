import Post from "../post/Post"

export const Feeds = ({ posts, showDelete }) => {

    return (
        <>

            {posts &&
                posts.map((post, index) => {
                    return <Post key={post._id} post={post} showDelete={showDelete} />;
                })
            }
        </>
    )
}

export default Feeds;
