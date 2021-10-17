import React from 'react'
import { useState, useEffect } from "react";
import { useFormik } from 'formik'
import axios from "axios";
import * as Yup from 'yup'
import { Link } from "react-router-dom";
import api from "../../config/api"
import "./login.css";

export default function Login({ history }) {
    const [error, setError] = useState("");
    useEffect(() => {
        localStorage.removeItem("user");
        if (localStorage.getItem("user")) {
            history.push("/");
        }
    }, [history]);

    const initialValues = {
        username: '',
        password: ''
    }
    const validationSchema = Yup.object({
        username: Yup.string().required('Enter username'),
        password: Yup.string().required('Enter password')
    });
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async values => {
            const config = {
                header: {
                    "Content-Type": "application/json",
                },
            };
            try {
                const { data, error } = await axios.post(
                    api.login,
                    {
                        username: values.username,
                        password: values.password
                    },
                    config
                );
                localStorage.setItem("user", JSON.stringify(data.data));
                history.push("/");
            } catch (error) {
                console.log(error)
                if (error.response && error.response.data) {
                    setError(error.response.data.message)
                } else {
                    setError('Woops something went wrong');
                }
                setTimeout(() => {
                    // Fade out errro message after 5 sec
                    setError("");
                }, 10000);
            }
        },
    });

    return (
        <div className="container">
            <div className="wrapper">
                <div className="title"><span>Login Form</span></div>

                <form onSubmit={formik.handleSubmit}>

                    <div className="row">
                        <i className="fas fa-user" />
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                        />
                    </div>
                    <div className="error-div">
                        {formik.errors.username}
                    </div>
                    <div className="row">
                        <i className="fas fa-lock" />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            className={` ${formik.errors.password ? "input-box-danger" : ""}`}
                        />
                    </div>
                    <div className="error-div">
                        {formik.errors.password && formik.errors.password}
                    </div>
                    <div className="error-div">
                        {error}
                    </div>
                    <div className="pass"><a href="#">Forgot password?</a></div>
                    <div className="row button">
                        <input type="submit" defaultValue="Login" />
                    </div>
                    <div className="signup-link">Not a member? <Link to={"/signup"}>Signup now</Link></div>
                </form>

            </div>
        </div>
    );
};
