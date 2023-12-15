import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from 'appwrite';

export async function createUser(user: INewUser) {
    try {
        const newAppWriteAccount = await account.create(
            ID.unique(),
            user.email,
            user.password
        );

        if (!newAppWriteAccount) {
            throw Error;
        }

        const avatarUrl = avatars.getInitials(user.email);

        const newUser = await saveUserToDB({
            accountId: newAppWriteAccount.$id,
            email: user.email,
            imageUrl: avatarUrl
        });

        return newUser;
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string,
    email: string,
    imageUrl: URL
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            user
        );

        return newUser;
    }
    catch (e) {
        console.log(Error);
    }
}

export async function signIn(user: {
    email: string,
    password: string
}) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    }
    catch (error) {
        console.log(error);
    }
}

export async function signOut() {
    try {
        const session = await account.deleteSession("current");
        return session;
    }
    catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAppwriteAccount = await account.get();

        if (!currentAppwriteAccount) {
            throw Error;
        }

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', currentAppwriteAccount.$id)]
        );

        if (!currentUser) {
            throw Error;
        }

        return currentUser.documents[0];
    }
    catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.mediaStorageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.mediaStorageId,
            fileId,
            2000,
            2000,
            "top",
            100
        );

        if (!fileUrl) {
            throw Error;
        }

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.mediaStorageId, fileId);

        return { status: "ok" };
    } catch (error) {
        console.log(error);
    }
}

export async function createPost(post: INewPost) {
    try {
        const uploadedFile = await uploadFile(post.file);

        if (!uploadedFile) throw Error;

        const fileUrl = getFilePreview(uploadedFile.$id);
        
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                tags: post.tags,
            }
        );

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
    } catch (error) {
        console.log(error);
    }
}