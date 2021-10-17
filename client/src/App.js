import { useEffect } from 'react';
import SinglePost from './pages/single-post/SinglePost';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import MyProfile from './pages/myprofile/MyProfile';
import InnerPageLayout from './components/layout/InnerPageLayout';
import RestrictedRoute from './components/routing/RestrictedRoute';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useLocation
} from "react-router-dom";

export const App = () => {

    return (
        <>
            < Router >
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup" component={Signup} />
                    <InnerPageLayout>
                        <RestrictedRoute exact path="/" component={Home} ignoreScrollBehavior />
                        <RestrictedRoute exact path="/post/:postId" component={SinglePost} />
                        <RestrictedRoute exact path="/profile/:username" component={Profile} />
                        <RestrictedRoute exact path="/myprofile" component={MyProfile} />
                    </InnerPageLayout>
                </Switch >
            </ Router>
        </>
    )
}

export default App