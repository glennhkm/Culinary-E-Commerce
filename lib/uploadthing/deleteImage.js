"use server";

import { UTApi } from "uploadthing/server";

export const deleteImage = async (imageKey) => {
    const utapi = new UTApi();
    try {
        await utapi.deleteFiles(imageKey);
        return {success: true};
    } catch (error) {
        console.log("error: ", error);
        return {success: false};
    }
}