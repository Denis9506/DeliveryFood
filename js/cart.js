
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get, child, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyBiLrIzHUq48WjfsdtDDUKncmo4WAx0c9M",
  authDomain: "deliveryfood-c1765.firebaseapp.com",
  projectId: "deliveryfood-c1765",
  storageBucket: "deliveryfood-c1765.firebasestorage.app",
  messagingSenderId: "71142399918",
  appId: "1:71142399918:web:f3c7bc6cd49d9ef95b723f",
  databaseURL: "https://deliveryfood-c1765-default-rtdb.europe-west1.firebasedatabase.app/"
};



const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const modalCart = document.querySelector('.modal-cart');
const modalDialog = modalCart.querySelector('.modal-dialog-cart'); 
const modalBody = document.createElement('div');
modalBody.classList.add('modal-body');
modalDialog.appendChild(modalBody);

const modalFooter = document.createElement('div');
modalFooter.classList.add('modal-footer');
modalDialog.appendChild(modalFooter);

const modalPricetag = document.createElement('span');
modalPricetag.classList.add('modal-pricetag');
modalFooter.appendChild(modalPricetag);

const orderButton = document.createElement('button');
orderButton.classList.add('button-primary');
orderButton.classList.add('button');
orderButton.textContent = 'Оформити замовлення';
modalFooter.appendChild(orderButton);


const clearCartButton = document.createElement('button');
clearCartButton.classList.add('clear-cart');
clearCartButton.classList.add('button');
clearCartButton.textContent = 'Очистити';
modalFooter.appendChild(clearCartButton);

const cartCloseButton = modalCart.querySelector('.close');
const openCartButton = document.querySelector('#cart-button');

let cart = [];

openCartButton.addEventListener('click', () => {
  loadCart();
  renderCart();
  modalCart.classList.add('is-open');
});

cartCloseButton.addEventListener('click', () => {
  modalCart.classList.remove('is-open');
});

clearCartButton.addEventListener('click', () => {
  cart = [];
  renderCart();
  localStorage.setItem('cart', JSON.stringify(cart)); 
});

function renderCart() {
  modalBody.innerHTML = ''; 
  let total = 0;

  cart.forEach((item) => {
    const foodRow = document.createElement('div');
    foodRow.classList.add('food-row');
    foodRow.innerHTML = `
      <span class="food-name">${item.name}</span>
      <strong class="food-price">${item.price} ₴</strong>
      <div class="food-counter">
        <button class="counter-button" data-id="${item.id}" data-action="decrease">-</button>
        <span class="counter">${item.quantity}</span>
        <button class="counter-button" data-id="${item.id}" data-action="increase">+</button>
      </div>
    `;
    modalBody.append(foodRow);

    total += item.price * item.quantity;
  });

  modalPricetag.textContent = `${total} ₴`;

  if (cart.length === 0) {
    modalBody.innerHTML = '<p>Кошик порожній.</p>';
  }

}

modalBody.addEventListener('click', (event) => {
  const button = event.target;
  if (button.classList.contains('remove-item')) {
    const id = button.dataset.id;
    cart = cart.filter((item) => item.id !== id);
    renderCart();
    localStorage.setItem('cart', JSON.stringify(cart)); 
  }
});

modalBody.addEventListener('click', (event) => {
  const button = event.target;
  if (button.classList.contains('counter-button')) {
    const id = button.dataset.id;
    const action = button.dataset.action;

    const item = cart.find((item) => item.id === id);

    if (item) {
      if (action === 'increase') {
        item.quantity += 1;
      } else if (action === 'decrease') {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          cart = cart.filter((item) => item.id !== id);
        }
      }
      renderCart();
    }
    localStorage.setItem('cart', JSON.stringify(cart)); 
  }
});

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    renderCart();
  }
}

const phoneInputWrapper = document.createElement('div');
phoneInputWrapper.classList.add('phone-input-wrapper');

const modalPhoneInput = document.createElement('input');
modalPhoneInput.classList.add('modal-phone-input');
modalPhoneInput.setAttribute('type', 'text');
modalPhoneInput.setAttribute('placeholder', 'Введіть номер телефону');

const phoneErrorText = document.createElement('span');
phoneErrorText.classList.add('phone-error-text');
phoneErrorText.textContent = '';

phoneInputWrapper.appendChild(modalPhoneInput);
phoneInputWrapper.appendChild(phoneErrorText);

modalFooter.before(phoneInputWrapper);


orderButton.addEventListener('click', () => {
  const phone = modalPhoneInput.value.trim();
  const phoneRegex = /^\+38\d{10}$/; 
  phoneErrorText.style.color = 'red';

  if (!phoneRegex.test(phone)) {
    modalPhoneInput.style.border = '2px solid red';
    phoneErrorText.textContent = 'Номер телефону повинен бути у форматі +38 та містити 10 цифр.';

    setTimeout(() => {
      modalPhoneInput.style.border = '';
      phoneErrorText.textContent = '';
    }, 2000);
    return;
  }

  const accountName = localStorage.getItem('login') || 'Гість';
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  if(cartItems.length===0){
    modalPhoneInput.style.border = '2px solid red';
    phoneErrorText.textContent = 'Ваш кошик порожній !!!';
    return;
  }
  
  let total = 0;
  cartItems.forEach(item => {
    total += item.price * item.quantity;
  });

  const orderData = {
    accountName: accountName,
    phoneNumber: phone,
    cart: cartItems,
    totalPrice: total,  
    timestamp: new Date().toISOString(),
  };

  const newDbRef = ref(database, 'orders/' + Date.now());

  set(newDbRef, orderData)
    .then(() => {
      
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      
      phoneErrorText.textContent = 'Успішно оформлено! Чекайте виклик.';
      phoneErrorText.style.color = 'lightgreen';
      modalPhoneInput.value = '';
      renderCart();
      

    })
    .catch((error) => {
      phoneErrorText.textContent = 'Помилка! Спробуйте пізніше.';
    });
});


