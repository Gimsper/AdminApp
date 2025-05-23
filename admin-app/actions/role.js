import { client } from "./client";

export const getRoles = async () => {
    await client({
        method: "GET",
        url: "/Role/GetAll",
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error fetching items:", error);
        throw error;
    });
}

export const getRole = async (id) => {
    await client({
        method: "GET",
        url: `/Role/GetById/?id=${id}`,
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error fetching item:", error);
        throw error;
    });
}

export const createRole = async (item) => {
    await client({
        method: "POST",
        url: "/Role/Add",
        data: item,
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error creating item:", error);
        throw error;
    });
}

export const updateRole = async (item) => {
    await client({
        method: "PUT",
        url: "/Role/Update",
        data: item,
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error updating item:", error);
        throw error;
    });
}

export const deleteRole = async (id) => {
    await client({
        method: "DELETE",
        url: `/Role/Delete/?id=${id}`,
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error deleting item:", error);
        throw error;
    });
}