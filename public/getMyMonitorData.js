// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {

   apiKey: "AIzaSyD_rtx1A7H-xHhPz7mafylear92VG6rNS4",

   authDomain: "getmymonitor-42f46.firebaseapp.com",

   databaseURL: "https://getmymonitor-42f46-default-rtdb.firebaseio.com",

   projectId: "getmymonitor-42f46",

   storageBucket: "getmymonitor-42f46.appspot.com",

   messagingSenderId: "1051737955814",

   appId: "1:1051737955814:web:dc05cc147bda3fe9ea0a27",

   measurementId: "G-4LEP6K1L7G"

 };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); //get the database from firebase

// Firebase and other setup code here

// Function to fetch data from Firestore and update the table body
async function fetchDataAndPopulateTable() {
    const sourceWebsitesCollection = collection(db, 'SourceWebsites');
    const querySnapshot = await getDocs(sourceWebsitesCollection);

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    querySnapshot.forEach(doc => {
        const data = doc.data();

        // Create a new row and populate cells
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>₹${data.Price}</td>
            <td>${data.Brand}</td>
            <td>${data.MonitorType}</td>
            <td>${data.Condition}</td>
            <td>${data.Category}</td>
            <td>${data.RefreshRate}</td>
            <td>${data.ScreenShape}</td>
            <td>${data.HDFormat}</td>
            <td>${data.Size}</td>
            <td><a href="${data.Link}" target="_blank">LinktoBuy</a></td>
        `;
        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

// Call the function to fetch data and populate the table
fetchDataAndPopulateTable();
