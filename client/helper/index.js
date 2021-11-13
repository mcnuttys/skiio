const sendPost = (action, data, error) => {
    return fetch(action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': data._csrf
        },
        body: JSON.stringify(data)
    }).then(response => responseHandler(response, error));
}
const sendGet = (action, error) => {
    return fetch(action, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    }).then(response => responseHandler(response, error));
}

const responseHandler = (response, error) => {
    if (response.ok) {
        return response.json();
    }

    return error(response.json());
}

export { sendPost, sendGet }