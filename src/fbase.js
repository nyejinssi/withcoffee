import firebase from 'firebase/compat/app';
import {initializeApp} from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAeKFb4VzVOfA1Zpj-pGJKJAixQWStOGzk",
    authDomain: "withcoffee-89170.firebaseapp.com",
    projectId: "withcoffee-89170",
    storageBucket: "withcoffee-89170.appspot.com",
    messagingSenderId: "503407818616",
    appId: "1:503407818616:web:030ddff47929479770fa8d",
    measurementId: "G-NV0KL1NPMT"
};

const app = initializeApp(firebaseConfig);
export const authService = getAuth();
export const dbService = getFirestore();
export const storageService = getStorage(); 
authService.languageCode = 'it';
