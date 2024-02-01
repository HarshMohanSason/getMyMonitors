
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
import {getFirestore, collection, getDocs} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


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
let globalTableData = []; // global data

// Function to fetch data from Firestore and update the table body
async function fetchDataforTable() {
    // Check if the data is already in local storage
    const cachedData = localStorage.getItem('firebaseData');

    if (cachedData) {

        globalTableData = JSON.parse(cachedData);
        populateTable();

    } else {
        // If no cached data exists, we fetch from firebase
        const sourceWebsitesCollection = collection(db, 'SourceWebsites');
        const querySnapshot = await getDocs(sourceWebsitesCollection);

        querySnapshot.forEach(doc => {
            globalTableData.push(doc.data());
        });
        // Update the table body with the fetched data
        populateTable();
        // Cache the fetched data in local storage
        localStorage.setItem('firebaseData', JSON.stringify(globalTableData));
    }
}

function populateTable(minPrice = 0, maxPrice = null) {

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    globalTableData.forEach(data => {
        const row = document.createElement('tr');

        if (data.Price >= minPrice && (maxPrice === null || data.Price <= maxPrice))  {
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
        <td><a href="${data.Link}" target="_blank">LinktoBuy</a></td>`;
            // Append the row to the table body
            tableBody.appendChild(row);
        }
    });
}


//clear the local storage periodically(1 week time)
function periodicallyClearLocalStorage() {
    // Clear local storage for your website
    localStorage.removeItem('firebaseData');
    // Optionally, you can perform additional cleanup or actions here
}

setInterval(periodicallyClearLocalStorage, 7 * 24 * 60 * 60 * 1000); // 7 days interval to clear the local storage for each browser for this website

fetchDataforTable(); //fetch the data from the table


//to handle the priceInputs
const priceInputs = document.querySelectorAll('priceFiltering input[type="number"]'); //get the entered value
priceInputs.forEach(input => {
    input.addEventListener("keyup", function(event) {
        // Get the entered value from the input
        const minPrice = document.getElementById('minPricebox').value; // assuming minPrice ID is used
        const maxPrice = document.getElementById('maxPricebox').value; // assuming maxPrice ID is used
        // Call populateTable with the entered value
        populateTable(minPrice, maxPrice);
    });
});
