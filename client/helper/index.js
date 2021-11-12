const sendPost = (action, data) => {
    return fetch(action, {
        method: 'post',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': data._csrf
        },
        redirect: "follow",
        body: data
    }).then(response => responseHandler(response));
}
const sendGet = (action) => {
    return fetch(action, {
        method: "get",
        cache: 'no-cache',
        headers: {
            'Accept': 'application/json',
        },
        redirect: "follow",
    }).then(response => responseHandler(response));
}

const responseHandler = (response) => {
    switch (response.status) {
        case 200:
            return response.json();
    }
}

export { sendPost, sendGet }