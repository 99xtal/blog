import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDWwsfg5A64UvIUpVX0ttPMGK-JnVKabvc",
    authDomain: "blog-95d47.firebaseapp.com",
    projectId: "blog-95d47",
    storageBucket: "blog-95d47.appspot.com",
    messagingSenderId: "1009458664913",
    appId: "1:1009458664913:web:1ab24a736208893eb53cf0",
    measurementId: "G-WR1860YBDV"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
