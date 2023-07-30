export const parseResponse = (response, responseType, errorFunc, successFunc) => {
    let array = [];
    let error = null;

    if (response.status === 200 || response.status === 201) {
        if (response.data.success) {
            array = response.data[responseType] ?? [];
        } else {
            error = response.data.message ?? "An unknown error occurred."
        }
    } else {
        error = `An error occurred. Please reload. If error persists, consult the administrator.`;
    }
    if (error !== null) {
        errorFunc(error);
    } else {
        successFunc(array);
    }
};

export const axiosError = (prefix = null, error, errorDisplayFunc) => {
    errorDisplayFunc &&
    errorDisplayFunc(`${prefix !== null ? prefix + ": " : ""}${error.toString()}`);
};