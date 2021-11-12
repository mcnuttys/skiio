const sendPost = (action, data, error) => {
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
    }).then(response => responseHandler(response, error));
}
const sendGet = (action, error) => {
    return fetch(action, {
        method: "get",
        cache: 'no-cache',
        headers: {
            'Accept': 'application/json',
        },
        redirect: "follow",
    }).then(response => responseHandler(response, error));
}

const responseHandler = (response, error) => {
    switch (response.status) {
        case 200:
            return response.json();

        case 400:
            error(response.json());
            break;

        case 401:
            error(response.json());
            break;

        case 404:
            error(response.json());
            break;
    }
}

export { sendPost, sendGet }