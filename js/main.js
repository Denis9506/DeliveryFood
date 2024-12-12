const modalAuth = document.querySelector('.modal-auth');
const buttonAuth = document.querySelector('.button-auth');
const buttonOut = document.querySelector('.button-out');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const cardsRestaurants = document.querySelector('.cards-restaurants');

async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

function openModalAuth() {
  loginInput.value = '';
  passwordInput.value = '';
  modalAuth.classList.add('is-open');
  clearInvalidField(loginInput);
  clearInvalidField(passwordInput);
  document.body.style.overflow = 'hidden';
}

function closeModalAuth() {
  modalAuth.classList.remove('is-open');
  document.body.style.overflow = '';
}

function markInvalidField(field) {
  field.classList.add('error');
}

function clearInvalidField(field) {
  field.classList.remove('error');
}

function checkAuth() {
  const login = localStorage.getItem('login');
  if (login) {
    logIn(login);
  } else {
    logOut();
  }
}

function logIn(login) {
  userName.textContent = login;
  userName.style.display = 'inline';
  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'block';
  closeModalAuth();
}

function logOut() {
  localStorage.removeItem('login');
  userName.textContent = '';
  userName.style.display = 'none';
  buttonAuth.style.display = 'block';
  buttonOut.style.display = 'none';
}

function createCard({ image, name, time_of_delivery, price, kitchen, stars, products }) {
  const card = document.createElement('a');
  card.classList.add('card', 'card-restaurant');

  card.dataset.restaurant = JSON.stringify({ name, price, kitchen, stars, products });
  card.dataset.products = products;

  card.innerHTML = `
    <img src="${image}" alt="${name}" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${time_of_delivery}</span>
      </div>
      <div class="card-info">
        <div class="rating">${stars}</div>
        <div class="price">від ${price} ₴</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  `;
  return card;
}

function renderCards(data) {
  cardsRestaurants.innerHTML = '';
  data.forEach((restaurant) => {
    const card = createCard(restaurant);
    cardsRestaurants.append(card);
  });
}

document.addEventListener('click', (event) => {
  const target = event.target;

  if (target.closest('.button-auth')) {
    clearInvalidField(loginInput);
    clearInvalidField(passwordInput);
    openModalAuth();
  }

  if (target.closest('.close-auth')) {
    closeModalAuth();
  }

  if (target.closest('.button-out')) {
    logOut();
  }

  const card = target.closest('.card-restaurant');
  if (card) {
    event.preventDefault();
    if (!localStorage.getItem('login')) {
      openModalAuth();
    } else {
      localStorage.setItem('selectedRestaurant', card.dataset.restaurant);
      window.location.href = 'restaurant.html';
    }
  }
});

logInForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let valid = true;

  if (!loginInput.value.trim()) {
    markInvalidField(loginInput);
    valid = false;
  } else {
    clearInvalidField(loginInput);
  }

  if (!passwordInput.value.trim()) {
    markInvalidField(passwordInput);
    valid = false;
  } else {
    clearInvalidField(passwordInput);
  }

  if (valid) {
    localStorage.setItem('login', loginInput.value.trim());
    logIn(loginInput.value.trim());
  }
});

getData('./db/partners.json').then(renderCards);

checkAuth();
