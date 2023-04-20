import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { auth, db } from "../firebase/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const AuthContext = createContext();
function AuthProvider(props) {
    const [userInfo, setUserInfo] = useState();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            //mỗi khi thay đổi trạng thái đăng nhập, đăng xuất hoặc đăng ký thì sẽ cập nhật lại thông tin người dùng
            if (user) {
                const docRef = query(collection(db, "users"), where("email", "==", user.email));
                onSnapshot(docRef, (snapshot) => {
                    snapshot.forEach((doc) => {
                        setUserInfo({
                            ...user,
                            ...doc.data(),
                        });
                    });
                });
                // setUserInfo(user);
            } else {
                setUserInfo(null);
            }
        });
    }, []);
    return (
        <AuthContext.Provider value={{ userInfo, setUserInfo }} {...props}></AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (typeof context === "undefined")
        throw new Error("useAuth must be used within a AuthProvider");
    return context;
}

export { AuthProvider, useAuth };
