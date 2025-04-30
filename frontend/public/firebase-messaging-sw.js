    importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');
    const firebaseConfig = {
        apiKey: "AIzaSyDvEv4jQ9JJXhhivKiikSHx71zjhp4byQw",
        authDomain: "zolo-e3745.firebaseapp.com",
        projectId: "zolo-e3745",
        storageBucket: "zolo-e3745.firebasestorage.app",
        messagingSenderId: "86285220324",
        appId: "1:86285220324:web:a94c77dfd1dba49a166ff1",
        measurementId: "G-2T5Q6MRVM1"
    };

    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(function (payload) {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);

        const { title, body } = payload.data;

        const notificationOptions = {
            body: body,
            icon: '/zolo.png', // your app icon,
            badge: '/zolo.png',
            data: {
                url: payload.data?.route || '/', // link to open on click
            },
            actions: [
                { action: 'open_app', title: 'Open App' },
                // { action: 'custom_action', title: 'Do Something' },
            ]
        };

        self.registration.showNotification(title, notificationOptions);
    });

    // Optional: Handle click to open correct page
    self.addEventListener('notificationclick', function (event) {
        event.notification.close();
        event.waitUntil(
            clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
                if (clientList.length > 0) {
                    // Focus the first tab
                    return clientList[0].focus();
                }
                // If no tabs, open new
                return clients.openWindow(event.notification.data.url);
            })
        );
    });