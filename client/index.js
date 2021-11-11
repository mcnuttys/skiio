import React from 'react'
import ReactDOM from 'react-dom'

const HelloWorld = (props) => {
    return (
        <h1>Hello World</h1>
    );
}

window.onload = () => {
    console.log('webpack worked!');

    ReactDOM.render(
        <HelloWorld />,
        document.querySelector("#content")
    );
}