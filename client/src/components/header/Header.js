import { useState, useEffect } from "react";
import Autosuggest from 'react-autosuggest';
import api from "../../config/api";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import "./header.css";

export default function Header() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const config = {
        header: {
            "Content-Type": "application/json",
        },
    };

    // Filter logic
    const getSuggestions = async (value) => {
        const inputValue = value.trim().toLowerCase();
        let response = await fetch(api.getUsersForAutocomplete + value);
        let data = await response.json()
        return data;
    };

    const getSuggestionValue = suggestion => suggestion.username;

    // Render Each Option
    const renderSuggestion = suggestion => (
        <span className="sugg-option">
            <span className="icon-wrap"></span>
            <span className="name">
                <Link to={"/profile/" + suggestion.username}>{suggestion.fullname} / {suggestion.username}</Link>
            </span>
        </span>
    );

    // OnChange event handler
    const onChange = (event, { newValue }) => {
        setValue(newValue)
    };

    // Suggestion rerender when user types
    const onSuggestionsFetchRequested = async ({ value }) => {
        try {
            const { data, error } = await axios.post(
                api.getUsersForAutocomplete,
                {
                    keyword: value,
                    userId: user._id
                },
                config
            );
            if (data.data.length == 0) {
                setSuggestions([]);
            } else {
                setSuggestions(data.data);
            }
        } catch (error) {
            setSuggestions([]);
        }
    };

    // Triggered on clear
    const onSuggestionsClearRequested = () => {
        setSuggestions([])
    };

    // Option props
    const inputProps = {
        placeholder: 'Search people',
        value,
        onChange: onChange
    };

    return (
        <>
            <div className="header">
                <div className="header__left test">
                    <a href="/">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png" alt="" />
                    </a>
                    <div className="header__input">
                        <span className="material-icons"> search </span>
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                        />
                    </div>
                </div>
                <div className="header__right">
                    <div className="header__info">
                        <img className="user__avatar" alt="" />
                        <h4>{user && user.fullname}</h4>
                    </div>
                    <span className="material-icons"> expand_more </span>
                </div>
            </div>
        </>
    );
}
