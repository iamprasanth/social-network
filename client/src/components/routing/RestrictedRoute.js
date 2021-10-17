import { Redirect, Route } from "react-router-dom";

const RestrictedRoute = ({ component: Component, ...rest }) => {

    return (

        < Route
            {...rest}
            render={(props) =>
                localStorage.getItem("user") ? <Component {...props} /> : <Redirect to="/login" />
            }
        />
    );
};

export default RestrictedRoute;