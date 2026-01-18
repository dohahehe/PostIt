import { createContext, useEffect, useState } from "react";
import { GetUserData } from "../service/LoginApi";


export const AuthContext = createContext()

// ! every context has a provider which is a function the provides the app with data
export function AuthContextProvider({children}){

    // data that you want to send to other components
    const [userToken, setUserToken] = useState(null);

    const [userData, setUserData] = useState(null);

    async function fetchUserData(){
        const response = await GetUserData()
        if(response.message === 'success'){
            setUserData(response.user)
        }
        //  console.log(response);    
    }

    // for reloading, before this the state returns back to null on reload
    useEffect(() => {
        if(localStorage.getItem('token') != null){
            setUserToken(localStorage.getItem('token') );
        }
        if(userToken){
            fetchUserData();
        }
    },[userToken])


    return <AuthContext.Provider value={{userToken, setUserToken, userData, setUserData}}>
        {/* wrap application here */}
        {children}
    </AuthContext.Provider>
}

// ! a Context is like a store that can provide your whole application with data, in this example the authContext provides the whole application with the token