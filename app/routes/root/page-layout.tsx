import RootNavbar from "components/RootNavbar";
import {Outlet, redirect, useNavigate} from "react-router";
import {getExistingUser, logOutUser, storeUserData} from "~/appwrite/auth";
import {account} from "~/appwrite/client";


export async function clientLoader() {
    try {
        const user = await account.get();

        const existingUser = await getExistingUser(user.$id);
        return existingUser?.$id ? existingUser : await storeUserData();
    } catch (e) {
        console.log('Error fetching user', e)
    }
}

const PageLayout = () => {
    return (
        <div className="bg-light-200">
            <RootNavbar />
            <Outlet />
        </div>
    )
}
export default PageLayout