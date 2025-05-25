import { client } from "./client";

export const getUsers = async () => {
    const result = { data: null, error: null };

    await client({
        method: "GET",
        url: "/User/GetAll",
    })
    .then((response) => {
        result.data = response.data;
    })
    .catch((error) => {
        console.error("Error fetching items:", error);
        throw error;
    });
    return result;
}

export const getUser = async (id: any) => {
    const result = { data: null, error: null };

    await client({
        method: "GET",
        url: `/User/GetById/?id=${id}`,
    })
    .then((response) => {
        result.data = response.data;
    })
    .catch((error) => {
        console.error("Error fetching item:", error);
        throw error;
    });
    return result;
}

export const createUser = async (item: any) => {
    const result = { data: null, error: null };

    await client({
        method: "POST",
        url: "/User/Add",
        data: item,
    })
    .then((response) => {
        result.data = response.data;
    })
    .catch((error) => {
        console.error("Error creating item:", error);
        throw error;
    });
    return result;
}

export const loginUser = async (item: any) => {
    const result = { data: null, error: null };

    await client({
        method: "POST",
        url: "/User/Login",
        data: item,
    })
    .then((response) => {
        result.data = response.data;
    })
    .catch((error) => {
        console.error("Error logging in:", error);
        result.error = error;
        throw error;
    });
    return result;
}

export const updateUser = async (item: any) => {
    const result = { data: null, error: null };

    await client({
        method: "PUT",
        url: "/User/Update",
        data: item,
    })
    .then((response) => {
        result.data = response.data;
    })
    .catch((error) => {
        console.error("Error updating item:", error);
        throw error;
    });
    return result;
}

export const deleteUser = async (id: any) => {
    const result = { data: null, error: null };

    await client({
        method: "DELETE",
        url: `/User/Delete/?id=${id}`,
    })
    .then((response) => {
        result.data = response.data;
    })
    .catch((error) => {
        console.error("Error deleting item:", error);
        throw error;
    });
    return result;
}