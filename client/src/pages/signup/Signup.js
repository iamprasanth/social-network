import React from 'react'
import { useState, useEffect } from "react";
import { useFormik } from 'formik'
import axios from "axios";
import * as Yup from 'yup'
import { Link } from "react-router-dom";
import api from "../../config/api"
import "./signup.css";

export default function Signup({ history }) {
    const [error, setError] = useState("");

    const initialValues = {
        email: '',
        username: '',
        password: '',
        confirm_password: ''
    }
    const validationSchema = Yup.object({
        email: Yup.string().required('Enter email').email('Invaid email'),
        username: Yup.string().required('Enter username'),
        password: Yup.string().required('Enter password'),
        confirm_password: Yup.string().required('Enter password again').oneOf([Yup.ref('password'), null], 'Passwords must match')
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
                    api.register,
                    {
                        email: values.email,
                        username: values.username,
                        password: values.password
                    },
                    config
                );
                localStorage.setItem("user", data.data);
                history.push("/");
            } catch (error) {
                console.log(error);
                if (error.response.status == 400) {
                    // Validation errors
                    var validationErrors = error.response.data.message;
                    for (const key in validationErrors) {
                        formik.errors[key] = validationErrors[key]
                    }
                } else if (error.response.status == 500 && error.response.data) {
                    // Server errors
                    setError(error.response.data.message)
                } else {
                    // some kind of Uncaught server error
                    setError('Woops something went wrong Try again later');
                }
            }
        },
    });

    return (
        <div className="container">
            <div className="wrapper">
                <div className="title"><span>Sign up Form</span></div>

                <form onSubmit={formik.handleSubmit}>

                    <div className="row">
                        <i className="fas fa-user" />
                        <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            className={`${formik.errors.email ? "input-box-danger" : ""}`}
                        />
                    </div>
                    <div className="error-div">
                        {formik.errors.email}
                    </div>
                    <div className="row">
                        <i className="fas fa-user" />
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            className={`${formik.errors.username ? "input-box-danger" : ""}`}
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
                        {formik.errors.password}
                    </div>
                    <div className="row">
                        <i className="fas fa-lock" />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirm_password"
                            onChange={formik.handleChange}
                            value={formik.values.confirm_password}
                            className={` ${formik.errors.confirm_password ? "input-box-danger" : ""}`}
                        />
                    </div>
                    <div className="error-div">
                        {formik.errors.confirm_password}
                    </div>
                    <div className="pass"><a href="#">Forgot password?</a></div>
                    <div className="row button">
                        <input type="submit" defaultValue="Login" />
                    </div>
                    <div className="signup-link">Already a member? <Link to={"/login"}>Login</Link></div>
                </form>

            </div>
        </div>
    );
};
