
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDNCDlueOhvLMcxs0jI8IgLkvWnU7JC4Ik",
  authDomain: "relator-clone-e1b3a.firebaseapp.com",
  projectId: "relator-clone-e1b3a",
  storageBucket: "relator-clone-e1b3a.appspot.com",
  messagingSenderId: "846801383743",
  appId: "1:846801383743:web:b74d736b2b8daa5ee3238a"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore()
 