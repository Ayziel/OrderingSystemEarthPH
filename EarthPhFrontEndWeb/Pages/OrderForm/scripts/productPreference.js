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

        // Register background sync for surveys
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.sync.register("sync-surveys").then(() => {
                    console.log("Background sync registered for surveys.");
                }).catch((err) => {
                    console.error("Failed to register sync-surveys:", err);
                });
            });
        }

        alert('Survey saved. It will be sent when you go online.');
        window.location.href = "https://earthhomecareph.astute.services/OrderForm/Order-Info.html";
    }
});

// ✅ Save to IndexedDB
async function saveSurveyToIndexedDB(survey) {
    await saveToIndexedDB("surveyDB", "surveys", survey);
}

// 🔥 Service Worker Registration (Only Once)
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").then((reg) => {
        console.log("Service Worker Registered", reg);
        
        // ✅ Ensure background sync is registered after SW is ready
        navigator.serviceWorker.ready.then(async (registration) => {
            try {
                await registration.sync.register("sync-surveys");
                console.log("Background sync registered for surveys.");
            } catch (err) {
                console.error("Failed to register sync-surveys:", err);
            }
        });

    }).catch((err) => console.log("Service Worker Failed", err));

    // ✅ Listen for messages from the service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "sync-success") {
            alert(event.data.message);
        }
    });
}

// ✅ Retry syncing surveys every 10 minutes in case background sync fails
function retrySurveySync() {
    setInterval(async () => {
        const surveys = await getAllFromIndexedDB("surveyDB", "surveys");
        if (surveys.length > 0) {
            console.log("Retrying survey sync...");
            surveys.forEach(async (survey) => {
                try {
                    const response = await fetch('https://earthph.sdevtech.com.ph/survey/createSurvey', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(survey),
                    });

                    if (response.ok) {
                        console.log("Survey synced successfully, removing from IndexedDB.");
                        await removeFromIndexedDB("surveyDB", "surveys", survey);
                    }
                } catch (err) {
                    console.warn("Survey sync failed, will retry later.");
                }
            });
        }
    }, 600000); // ✅ Retry every 10 minutes
}

// ✅ Call retry sync after registering the service worker
retrySurveySync();