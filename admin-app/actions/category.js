import { client } from "./client";

export const getCategories = async () => {
    const result = { data: null, error: null };

    await client({
        method: "GET",
        url: "/Category/GetAll",
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

export const getCategory = async (id) => {
    await client({
        method: "GET",
        url: `/Category/GetById/?id=${id}`,
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error fetching item:", error);
        throw error;
    });
}

export const createCategory = async (item) => {
    await client({
        method: "POST",
        url: "/Category/Add",
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

export const updateCategory = async (item) => {
    await client({
        method: "PUT",
        url: "/Category/Update",
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

export const deleteCategory = async (id) => {
    await client({
        method: "DELETE",
        url: `/Category/Delete/?id=${id}`,
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error deleting item:", error);
        throw error;
    });
}