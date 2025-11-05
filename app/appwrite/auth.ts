import { ID, OAuthProvider, Query } from "appwrite"
import { account, appwriteConfig, database } from "./client"
import { redirect } from "react-router"

export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session(
            OAuthProvider.Google,
            `${window.location.origin}/`,
            `${window.location.origin}/404`
        )
    } catch (error) {
        console.log('loginWithGoogle', error)
    }
}

export const getUser = async () => {
    try {
        const user = await account.get()

        if(!user) return redirect('/sign-in')

        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            [
                Query.equal('accountId', user.$id),
                Query.select(['name', 'email', 'imageUrl', '$createdAt', 'accountId'])
            ]
        )
        return documents.length > 0 ? documents[0] : redirect("/sign-in")
    } catch (error) {
        console.log(error)
    }
}

export const logOutUser = async () => {
    try {
        await account.deleteSession('current')
        return true
    } catch (error) {
        console.log('logoutUser error', error)
        return false
    }
}

const getGooglePicture = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!response.ok) throw new Error("Failed to fetch Google profile picture");

    const { photos } = await response.json();
    return photos?.[0]?.url || null;
  } catch (error) {
    console.error("Error fetching Google picture:", error);
    return null;
  }
};

export const storeUserData = async () => {
    try {
        const user = await account.get();

        if (!user) throw new Error("User not found");

       const { providerAccessToken } = (await account.getSession("current")) || {};
    const profilePicture = providerAccessToken
      ? await getGooglePicture(providerAccessToken)
      : null;

        // Create new user document
        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: profilePicture,
            }
        );

        if(!newUser.$id) redirect("/sign-in")

    } catch (error) {
        console.log("error storing user data", error)
    }
}

export const getExistingUser = async (id: string) => {
    try {

        // Check if user exist in the database
        const {documents, total} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            [Query.equal('accountId', id)]
        )

       return total > 0 ? documents[0] : null
    } catch (error) {
        console.log('error getting existing user', error)
        return null
    }
}