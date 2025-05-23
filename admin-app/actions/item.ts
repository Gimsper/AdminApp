import { client } from "./client";

export const getItems = async () => {
    const result = { data: null, error: null };

    await client({
        method: "GET",
        url: "/Item/GetAll",
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

export const getItem = async (id: any) => {
    const result = { data: null, error: null };

    await client({
        method: "GET",
        url: `/Item/GetById/?id=${id}`,
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error fetching item:", error);
        throw error;
    });
    return result;
}

export const createItem = async (item: any) => {
    const result = { data: null, error: null };

    await client({
        method: "POST",
        url: "/Item/Add",
        data: item,
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error creating item:", error);
        throw error;
    });
    return result;
}

export const updateItem = async (item: any) => {
    const result = { data: null, error: null };

    await client({
        method: "PUT",
        url: "/Item/Update",
        data: item,
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error updating item:", error);
        throw error;
    });
    return result;
}

export const deleteItem = async (id: any) => {
    const result = { data: null, error: null };

    await client({
        method: "DELETE",
        url: `/Item/Delete/?id=${id}`,
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error deleting item:", error);
        throw error;
    });
    return result;
}