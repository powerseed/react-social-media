import { INewPost, INewUser, IUpdatePost } from "@/types";
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

export async function updatePost(post: IUpdatePost) {
    try {
        let imageId = post.imageId;
        let imageUrl = post.imageUrl;

        if (post.file) {
            const newFile = await uploadFile(post.file);
            if (!newFile) throw Error;

            imageId = newFile.$id;

            const newImageUrl = getFilePreview(newFile.$id);

            if (!newImageUrl) {
                await deleteFile(newFile.$id);
                throw Error;
            }

            imageUrl = newImageUrl;
        }

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: imageUrl,
                imageId: imageId,
                tags: post.tags,
            }
        );

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function deletePost(postId: string, imageId: string) {
    if (!postId || !imageId) {
        throw Error;
    }

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId
        );

        return { status: 'ok' }
    }
    catch (e) {
        console.log(e);
    }
}

export async function getRecentPosts() {
    try {
        const recentPosts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(20)]
        );

        if (recentPosts === null) {
            throw Error;
        }

        return recentPosts;
    }
    catch (e) {
        console.log(e);
    }
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
        console.log("likesArray")
        console.log(likesArray)
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId,
            {
                likes: likesArray
            }
        );

        if (updatedPost === null) {
            throw Error;
        }

        return updatedPost;
    }
    catch (e) {
        console.log(e);
    }
}

export async function savePost(postId: string, userId: string) {
    try {
        const newSave = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        );

        if (newSave === null) {
            throw Error;
        }

        return newSave;
    }
    catch (e) {
        console.log(e);
    }
}

export async function deleteSave(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId
        );

        if (statusCode === null) {
            throw Error;
        }

        return { status: 'ok' };
    }
    catch (e) {
        console.log(e);
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId
        );

        if (post === null) {
            throw Error;
        }

        return post;
    }
    catch (e) {
        console.log(e);
    }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(20)];

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            queries
        );

        if (posts === null) {
            throw Error;
        }

        return posts;
    }
    catch (e) {
        console.log(e);
    }
}

export async function searchPosts(term: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            [Query.search('caption', term)]
        );

        if (posts === null) {
            throw Error;
        }

        return posts;
    }
    catch (e) {
        console.log(e);
    }
}