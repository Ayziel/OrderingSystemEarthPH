let orderData = JSON.parse(localStorage.getItem('orderData'));
console.log("STORENAME TEST", orderData?.storeName);

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "sync-success") {
            alert(event.data.message); // Show alert when survey syncs
        }
    });
}

function saveToIndexedDB(dbName, storeName, data) {
    const dbRequest = indexedDB.open(dbName, 1);
    
    dbRequest.onupgradeneeded = (event) => {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { autoIncrement: true });
        }
    };

    dbRequest.onsuccess = (event) => {
        let db = event.target.result;
        let tx = db.transaction(storeName, "readwrite");
        let store = tx.objectStore(storeName);
        store.add(data);
    };

    dbRequest.onerror = (event) => {
        console.error("IndexedDB error:", event.target.error);
    };
}

// Now you can use saveSurveyToIndexedDB without errors
function saveSurveyToIndexedDB(survey) {
    saveToIndexedDB("surveyDB", "surveys", survey);
}



document.getElementById('surveyForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page refresh

    let matchedUser = JSON.parse(localStorage.getItem('matchedUser')) || {};
    let orderData = JSON.parse(localStorage.getItem('orderData')) || {};

    if (!matchedUser.uid || !orderData.storeName) {
        alert("Missing user or store information. Please try again.");
        return;
    }

    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);

    // Collect data from the form
    const surveyData = {
        lionTigerCoil: formData.get('lionTigerCoil'),
        bayconCoil: formData.get('bayconCoil'),
        otherBrandsCoil: formData.get('otherBrandsCoil'),
        arsCoil: formData.get('arsCoil'),
        userUid: matchedUser.uid,
        storeName: orderData.storeName,
    };

    console.log('Survey Data:', surveyData);

    try {
        const response = await fetch('https://earthph.sdevtech.com.ph/survey/createSurvey', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(surveyData),
        });

        const result = await response.json();
        console.log('Server Response:', result);

        if (response.ok) {
            alert('Survey submitted successfully!');
            window.location.href = "https://earthhomecareph.astute.services/OrderForm/Order-Info.html";
        } else {
            alert('Failed to submit survey. Please try again.');
        }
    } catch (error) {
        console.warn('No internet. Saving survey locally.');
        saveSurveyToIndexedDB(surveyData);

        navigator.serviceWorker.ready.then((registration) => {
            return registration.sync.register("sync-surveys").then(() => {
                console.log("Background sync registered for surveys.");
            }).catch((err) => {
                console.error("Failed to register sync-surveys:", err);
            });
        });

        alert('Survey saved. It will be sent when you go online.');
        window.location.href = "https://earthhomecareph.astute.services/OrderForm/Order-Info.html";
    }
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
            if (registration.active && registration.active.scriptURL.includes("site-static-v8")) {
                registration.unregister();
                console.log("Old service worker unregistered.");
            }
        });
    });
}