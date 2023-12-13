import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
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

        if(!currentUser) {
            throw Error;
        }

        return currentUser.documents[0];
    }
    catch (error) {
        console.log(error);
    }
}