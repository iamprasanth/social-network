import "./singlePost.css";
import axios from "axios";
import { useState, useEffect } from "react";
import api from "../../config/api";
import { useParams } from 'react-router-dom';
import Post from "../../components/post/Post"
import Comments from "../../components/comments/Comments"

export const SinglePost = () => {
    const [states, setStates] = useState({
        post: null,
        loading: true
    });
    const { post, loading } = states;
    const params = useParams()

    useEffect(async () => {
        loadPost()
    }, []);

    const loadPost = async () => {
        try {
            const { data } = await axios.get(
                api.getPost + params.postId,
            );
            setStates({
                post: data.data,
                loading: false
            })
        } catch (error) {
            setStates({
                post: null,
                loading: true
            })
            console.log(error)
        }
    }

    if (post) {
        return (
            <>
                <div className="feed">
                    <Post key={post._id} post={post} />
                    <Comments comments={post.comments} postId={post._id} loadPost={loadPost} />
                </div>
            </>
        )
    } else if (loading) {
        return <div>Loading...</div>
    } else {
        return <div>Invalid Post</div>
    }
}

export default SinglePost;