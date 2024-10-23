import { LoginData } from "../Screens/Login/Login";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export type ErrorT = {
    ok: boolean
    message?: string,
    error: Error
}

export type NormalSuccess = {
    ok: boolean
    message?: string,
}

export type DataWithConsecutive = {
    consecutive: number;
};

export type dataType = DataWithConsecutive | object[] | object | LoginData | number | string | boolean;
export type SuccessT = {
    ok: boolean,
    data: dataType, 
    accessToken?: string,
    _id?: string
    clientName?: string
}

export type LoginT = {
    ok: boolean,
    accessToken?: string,
    role: string
    _id?: string
}

export const getData = async ({token = "", path}: {token?: string, path: string}): Promise<SuccessT | ErrorT> => {
    try {
        const response = await fetch(`${BACKEND_URL}${path}`, {
            headers: {
                "Content-Type": "application/json",
                authorization: token
            }
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || "Error desconocido")
        } else {
            return {ok: true, data: data.data}
        }
    } catch (err: unknown) {
        let errorMessage = "Error desconocido"
        if (err instanceof Error) {
            errorMessage = err.message
        }

        return {ok: false, error: new Error(errorMessage)}
    }
}

export const sendData = async ({token = "", path, body, method}: {token?: string, path: string, body: object, method?: string}): Promise<LoginT | SuccessT | ErrorT> => {
    try {
        const response = await fetch(`${BACKEND_URL}${path}`, {
            method: method ? method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: token
            },
            body: JSON.stringify(body)
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || "Error desconocido")
        } else {
            return {ok: true, data: {accessToken: data.accessToken, _id: data._id, role: data.role}}
        }
    } catch (err: unknown) {
        console.log(err)
        let errorMessage = "Error desconocido"
        if (err instanceof Error) {
            errorMessage = err.message
        }

        return {ok: false, error: new Error(errorMessage)}
    }
}

export const deleteData = async ({token = "", path}: {token?: string, path: string}): Promise<NormalSuccess | ErrorT> => {
    try {
        const response = await fetch(`${BACKEND_URL}${path}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: token
            },
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || "Error desconocido")
        } else {
            return {ok: true, message: data.message}}

    } catch (err: unknown) {
        console.log(err)
        let errorMessage = "Error desconocido"
        if (err instanceof Error) {
            errorMessage = err.message
        }

        return {ok: false, error: new Error(errorMessage)}
    }
}

export const sendFormData = async ({token = "", path, body, method}: {token?: string, path: string, body: FormData, method?: string}): Promise<LoginT | SuccessT | ErrorT> => {
    try {
        const response = await fetch(`${BACKEND_URL}${path}`, {
            method: method ? method: "POST",
            headers: {
                authorization: token
            },
            body: body
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || "Error desconocido")
        } else {
            return {ok: true, data: {accessToken: data.accessToken}}
        }
    } catch (err: unknown) {
        let errorMessage = "Error desconocido"
        if (err instanceof Error) {
            errorMessage = err.message
        }

        return {ok: false, error: new Error(errorMessage)}
    }
}
