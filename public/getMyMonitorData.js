
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
import {getDatabase, ref, onValue, get} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";


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
const db = getDatabase(app);
let timeoutId;
let globalTableData = [];

const filters = {  //Object to store screenSize, inBuiltSpeakers and refreshRate hashmaps
  screenSize: {},
  inBuiltSpeakers: {},
  refreshRate: {}
};

async function fetchDataforTable() {
    try {
      document.getElementById('loadingIndicator').style.display = 'block';
        let cachedData = localStorage.getItem('firebaseData');
        let lastCacheTimestamp = localStorage.getItem('cacheTimestamp');

        if (cachedData && lastCacheTimestamp) {
            const currentTime = new Date().getTime();
            const oneDayInMillis =  24 * 60 * 60 * 1000;

            if (currentTime - parseInt(lastCacheTimestamp) < oneDayInMillis) {
                globalTableData = JSON.parse(cachedData);
                populateTable();
                return;
            }
        }

        const snapshot = await get(ref(db));

        if (snapshot.exists()) {
            const data = snapshot.val();
            globalTableData = Object.values(data);
            localStorage.setItem('firebaseData', JSON.stringify(globalTableData));
            localStorage.setItem('cacheTimestamp', new Date().getTime().toString());
            populateTable();
        }
        else {
            console.log("No data available right now");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    finally {
      // Hide the loading indicator once the data is fetched
      document.getElementById('loadingIndicator').style.display = 'none';
  }
}


function populateTable(minPrice = 0, maxPrice = null) {

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clearing existing rows

    const trueInBuiltSpeakersValues = getTrueValues('inBuiltSpeakers');
    const trueRefreshRateValues = getTrueValues('refreshRate');

    const filteredData = globalTableData.filter(data => {

      const inBuiltSpeakersFilter = trueInBuiltSpeakersValues.includes(data.InbuiltSpeakers) || trueInBuiltSpeakersValues.length === 0;
      const refreshRateFilter = trueRefreshRateValues.includes(data.RefreshRate) || trueRefreshRateValues.length === 0;
      const screenSizeFilter = screenSizeComparator(data.Size, 'screenSize') || 0;

        return (
          (minPrice <= data.Price) &&
          (maxPrice === null || data.Price <= maxPrice) &&
          inBuiltSpeakersFilter &&
          refreshRateFilter &&
          screenSizeFilter
          );

    }).sort((a, b) => a.Price - b.Price);

    filteredData.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>₹${data.Price}</td>
            <td>${data.Brand}</td>
            <td>${data.MonitorType}</td>
            <td>${data.InbuiltSpeakers}</td>
            <td>${data.Sync}</td>
            <td>${data.Condition}</td>
            <td>${data.Category}</td>
            <td>${data.RefreshRate}</td>
            <td>${data.ScreenShape}</td>
            <td>${data.HDFormat}</td>
            <td>${data.Size}</td>
            <td><a href="${data.Link}" target="_blank">LinktoBuy</a></td>`;
        tableBody.appendChild(row);
    });
}


fetchDataforTable();
getcheckBoxValue('inBuiltSpeakers');
getcheckBoxValue('refreshRate');
getSizeBoxValue('screenSize');


const getMinPrice = document.getElementById('minPrice');

getMinPrice.addEventListener('input', (event) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        const minPrice = parseFloat(event.target.value) || 0;
        const maxPrice = parseFloat(document.getElementById('maxPrice').value) || null;
        populateTable(minPrice, maxPrice);
    }, 2);
});


const getMaxPrice = document.getElementById('maxPrice');

getMaxPrice.addEventListener('input', (event) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
        const maxPrice = parseFloat(event.target.value) || null;
        populateTable(minPrice, maxPrice);
    }, 2);
});



function getcheckBoxValue(filterType) {

  var checkboxes = document.querySelectorAll(`input[name="${filterType}"]`);

  checkboxes.forEach((checkbox) => {
    const labelValue = checkbox.getAttribute('data-condition');
    checkbox.addEventListener('change', (event) => {
      filters[filterType][labelValue] = checkbox.checked;
      populateTable();
    });
  });
}

function getTrueValues(filterType) {
  const trueValues = [];
  for (const key in filters[filterType]) {
    if (filters[filterType][key]) {
      trueValues.push(key);
    }
  }
  return trueValues;
}


//function to get theSizeBoxValue
function getSizeBoxValue(filterType)
{
  var checkboxes = document.querySelectorAll(`input[name="${filterType}"]`);

  checkboxes.forEach((checkbox) =>
  {
    const labelValue = checkbox.getAttribute('data-condition');
     checkbox.addEventListener('change', (event) => {
       filters[filterType][labelValue] = checkbox.checked;
       populateTable();
     });
  });
}


function screenSizeComparator(value, filterType) {
  const numericValue = parseFloat(value); // parse the value into float for comparison

  for (const key in filters[filterType]) {
    if (filters[filterType][key]) { // if that value for that key is true
      const filterValue = parseFloat(key) || 0; // Default to 0 if no valid value is specified in the filter

      if (numericValue >= filterValue) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  return true;
}
