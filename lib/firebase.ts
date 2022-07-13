import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDoc,
  limit,
  where,
  doc,
  query,
  getDocs,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDX6ViX0YygdfFW7rLo6l_HyNLovEGjHqM",
  authDomain: "blog-app-38977.firebaseapp.com",
  projectId: "blog-app-38977",
  storageBucket: "blog-app-38977.appspot.com",
  messagingSenderId: "645771476890",
  appId: "1:645771476890:web:e6b9b91531f85d11eb0423",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Helpers functions for firebase operations
/**
 * Gets a users/{uid} document with username
 * @param {string} username
 * @returns
 */
export async function getUserWithUsername(username: string) {
  const userRef = collection(db, "users");
  // create a query against the collection
  const userQuery = query(userRef, where("username", "==", username), limit(1));
  // get the first document from the query
  const userSnapshot = await getDocs(userQuery);
  // return the first document from the query
  return userSnapshot.docs[0];
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
 export function postToJSON(doc:{data:()=>any}) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
