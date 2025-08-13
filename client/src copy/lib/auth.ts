// "use server"

// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import { app } from "./firebase";

// const auth = getAuth(app);
// const db = getFirestore(app);

// export const signup = async (email: string, password: string, username: string) => {
//     console.log("Signing up with email:", email);
//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // Save username and email to Firestore under "users/{uid}"
//         await setDoc(doc(db, "users", user.uid), {
//             username,
//             email,
//             createdAt: new Date().toISOString(),
//         });

//         return {
//             uid: user.uid,
//             email: user.email,
//             username,
//         };
//     } catch (error: {

//     }) {
//         console.error("Signup error:", error.code, error.message);
//         throw error;
//     }
// };

// export const login = async (email: string, password: string) => {
//     console.log("Logging in with email:", email);
//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // Fetch user document from Firestore to get username
//         const userDoc = await getDoc(doc(db, "users", user.uid));

//         if (!userDoc.exists()) {
//             throw new Error("User data not found in Firestore");
//         }

//         const userData = userDoc.data();

//         return {
//             uid: user.uid,
//             email: user.email,
//             username: userData.username,
//         };
//     } catch (error: any) {
//         console.error("Login error:", error.code, error.message);
//         throw error;
//     }
// };

// export const logout = async () => {
//     console.log("Logging out");
//     try {
//         await auth.signOut();
//     } catch (error: any) {
//         console.error("Logout error:", error.code, error.message);
//         throw error;
//     }
// };


"use server"

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, DocumentData } from "firebase/firestore";
import { app } from "./firebase";

const auth = getAuth(app);
const db = getFirestore(app);

interface SignupReturn {
    uid: string;
    email: string | null;
    username: string;
}

interface LoginReturn {
    uid: string;
    email: string | null;
    username: string;
}

interface FirebaseError {
    code?: string;
    message?: string;
}

export const signup = async (email: string, password: string, username: string): Promise<SignupReturn> => {
    console.log("Signing up with email:", email);
    try {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user: User = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            username,
            email,
            createdAt: new Date().toISOString(),
        });

        return {
            uid: user.uid,
            email: user.email,
            username,
        };
    } catch (error: unknown) {
        const err = error as FirebaseError;
        console.error("Signup error:", err.code, err.message);
        throw error;
    }
};

export const login = async (email: string, password: string): Promise<LoginReturn> => {
    console.log("Logging in with email:", email);
    try {
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        const user: User = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
            throw new Error("User data not found in Firestore");
        }

        const userData = userDoc.data() as { username: string };

        return {
            uid: user.uid,
            email: user.email,
            username: userData.username,
        };
    } catch (error: unknown) {
        const err = error as FirebaseError;
        console.error("Login error:", err.code, err.message);
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    console.log("Logging out");
    try {
        await auth.signOut();
    } catch (error: unknown) {
        const err = error as FirebaseError;
        console.error("Logout error:", err.code, err.message);
        throw error;
    }
};
