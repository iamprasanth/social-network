import NewPost from '../../components/new-post/NewPost';
import Feeds from '../../components/feeds/Feeds';
import { ToastProvider } from 'react-toast-notifications';
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../config/api";

const Home = () => {

    const user = JSON.parse(localStorage.getItem('user'));
    const [posts, setPosts] = useState([]);

    useEffect(async () => {
        try {
            const { data } = await axios.get(
                api.getTimeline + user._id,
            );
            setPosts(data.data)
        } catch (error) {
            console.log(error)
        }
    }, []);

    return (
        <>
            <div className="feed">
                <ToastProvider>
                    <NewPost />
                </ToastProvider>
                <Feeds posts={posts} showDelete={false} />
            </div>
        </>
    )
};

export default Home;
