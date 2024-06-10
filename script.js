import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAep6KK-ZCpAx8C9ckXIkmuzugXohe9jfs",
  authDomain: "bank-project-for-summer.firebaseapp.com",
  databaseURL: "https://bank-project-for-summer-default-rtdb.firebaseio.com",
  projectId: "bank-project-for-summer",
  storageBucket: "bank-project-for-summer.appspot.com",
  messagingSenderId: "1079399174128",
  appId: "1:1079399174128:web:42f67a309e9193268d5735"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

function fetchAndDisplayUsernameOffers() {
  const usernameOffersPath = ref(db, 'shop/usernameOffers');
  get(usernameOffersPath).then((snapshot) => {
    const usernameOffersDiv = document.getElementById("usernameOffers");
    if (snapshot.exists()) {
      const usernameOffers = snapshot.val();
      let offersHTML = '<h3>عروض اللقب</h3>';
      Object.keys(usernameOffers).forEach((offerId, index) => {
        const offer = usernameOffers[offerId];
        offersHTML += `
          <div class="offer-card">
            <div class="cover-div">
              <img src="${offer.cover}">
            </div>
            <div class="card-elements">
              <h4>${offer.title}</h4>
              <p>${offer.description}</p>
              <p>السعر: ${offer.price} <i class="fa-solid fa-star"></i></p>
              <button id="purchase-button-${index}" data-price="${offer.price}" data-title="${offer.title}">طلب العرض</button>
            </div>
          </div>`;
      });
      usernameOffersDiv.innerHTML = offersHTML;
      attachPurchaseButtonEvents();
    } else {
      usernameOffersDiv.textContent = "لا تتوفر اي عروض حاليا";
    }
  }).catch((error) => {
    console.error("Error fetching username offers: ", error);
  });
}

function fetchAndDisplayBagageOffers() {
  const bagageOffersPath = ref(db, 'shop/bagageOffers');
  get(bagageOffersPath).then((snapshot) => {
    const bagageOffersDiv = document.getElementById("bagageOffers");
    if (snapshot.exists()) {
      const bagageOffers = snapshot.val();
      let offersHTML = '<h3>عروض السلع</h3>';
      Object.keys(bagageOffers).forEach((offerId, index) => {
        const offer = bagageOffers[offerId];
        offersHTML += `
          <div class="offer-card">
            <div class="cover-div">
              <img src="${offer.cover}">
            </div>
            <div class="card-elements">
              <h4>${offer.title}</h4>
              <p>${offer.description}</p>
              <p>السعر: ${offer.price} <i class="fa-solid fa-star"></i></p>
              <button id="purchase-button-${index}" data-price="${offer.price}" data-title="${offer.title}">طلب العرض</button>
            </div>
          </div>`;
      });
      bagageOffersDiv.innerHTML = offersHTML;
      attachPurchaseButtonEvents();
    } else {
      bagageOffersDiv.textContent = "لا تتوفر اي عروض حاليا";
    }
  }).catch((error) => {
    console.error("Error fetching username offers: ", error);
  });
}


function attachPurchaseButtonEvents() {
  const purchaseButtons = document.querySelectorAll('[id^="purchase-button-"]');
  purchaseButtons.forEach(function(button, index) {
    button.addEventListener('click', function(event) {
      const offerPrice = button.dataset.price;
      const offerTitle = button.dataset.title;
      checkBalanceAndPurchase(offerPrice, offerTitle, index);
    });
  });
}

function checkBalanceAndPurchase(offerPrice, offerTitle, index) {
  const selectedPlanet = localStorage.getItem('selectedPlanet') || 'earth';
  const username = localStorage.getItem('username') || 'user' ;
  const userBalancePath = ref(db, `planets/${selectedPlanet}/${username}/balance`);
  get(userBalancePath).then((snapshot) => {
    if (snapshot.exists()) {
      const userBalance = snapshot.val();
      if (userBalance >= offerPrice) {
          const phoneNumber = '+963992984704';
          const message = `مرحبا، أنا ${username}، من كوكب ${selectedPlanet} و أود طلب عرض: ${offerTitle}`;
            window.open(generateWhatsAppLink(phoneNumber, message), '_blank');

      } else {
        alert(`ليس لديك رصيد كافي لشراء ${offerTitle}. رصيدك:  ${userBalance}.`);
      }
    } else {
      alert('حصل خطأ اثناء جلب البيانات');
    }
  }).catch((error) => {
    console.error("Error fetching user balance: ", error);
  });
}

function generateWhatsAppLink(phoneNumber, message) {
  let encodedMessage = encodeURIComponent(message);
  let whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  return whatsappUrl;
}

window.onload = () => {
  fetchAndDisplayUsernameOffers();
  fetchAndDisplayBagageOffers();
}
