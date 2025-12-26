importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyD27p5BJdhQ0LOcdmeH8okcNvfuOJaZ9iM",
  authDomain: "fcm-notification-9fd1f.firebaseapp.com",
  projectId: "fcm-notification-9fd1f",
  messagingSenderId: "1063781122560",
  appId: "1:1063781122560:web:8a8d847341133db82ecee5",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  });
});
