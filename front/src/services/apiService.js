const BACK_URL = process.env.REACT_APP_BACK_URL;

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || `Request failed with status ${response.status}`);
    }
    return response.json();
};

export const encodeDocument = async (data) => {
    const response = await fetch(`${BACK_URL}/encode`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const decodeDocument = async (id) => {
    const response = await fetch(`${BACK_URL}/decode?id=${id}`);
    return handleResponse(response);
};

export const getPokemonImages = async (pasteId) => {
    const response = await fetch(`${BACK_URL}/parse-pokebin?pasteId=${pasteId}`);
    return handleResponse(response);
};

export const createPaste = async (pasteContent) => {
    const response = await fetch(`${BACK_URL}/create-paste`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paste: pasteContent }),
    });
    return handleResponse(response);
};
