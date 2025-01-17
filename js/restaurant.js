const buttonAuth = document.querySelector('.button-auth');
const buttonOut = document.querySelector('.button-out');
const userName = document.querySelector('.user-name');
const searchInput = document.querySelector('.input-search');

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      searchInput.style.border = '2px solid red';
      searchInput.placeholder = 'Поле не може бути порожнім!';
      searchInput.style.color = 'red';

      setTimeout(() => {
        searchInput.style.border = ''; 
        searchInput.placeholder = 'Пошук страв та ресторанів';
        searchInput.style.color = ''; 
      }, 1500); 
      return;
    }

    fetch(`./db/${selectedRestaurant.products}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching menu: ${response.status}`);
        }
        return response.json();
      })
      .then((menu) => {
        const filteredMenu = menu.filter((item) =>
          item.name.toLowerCase().includes(query)
        );
        renderMenu(filteredMenu);
      })
      .catch((error) => {
        console.error('Error during search:', error);
      });
  }
});
const resetButton = document.querySelector('#reset-button');

resetButton.addEventListener('click', () => {
  searchInput.value = ''; 
  searchInput.style.border = ''; 
  searchInput.placeholder = 'Пошук страв та ресторанів'; 
  searchInput.style.color = ''; 

  if (selectedRestaurant) {
    fetch(`./db/${selectedRestaurant.products}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching menu: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        renderMenu(data); 
      })
      .catch((error) => {
        console.error('Error during reset:', error);
      });
  }
});

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
  buttonOut.style.display = 'inline-flex';
}

function logOut() {
  localStorage.removeItem('login');
  userName.textContent = '';
  userName.style.display = 'none';
  buttonAuth.style.display = 'inline-flex';
  buttonOut.style.display = 'none';
}

buttonAuth.addEventListener('click', () => {
  window.location.href = 'index.html'; 
});

buttonOut.addEventListener('click', () => {
  logOut();
  window.location.href = 'index.html'; 
});

const restaurantName = document.querySelector('.restaurant-name');
const restaurantRating = document.querySelector('.restaurant-rating');
const restaurantPrice = document.querySelector('.restaurant-price');
const restaurantCategory = document.querySelector('.restaurant-category');
const menuContainer = document.querySelector('.cards-menu');

const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant'));

if (selectedRestaurant) {
  const { name, price, kitchen, stars, products } = selectedRestaurant;

  restaurantName.textContent = name;
  restaurantRating.textContent = `Рейтинг: ${stars}`;
  restaurantPrice.textContent = `Середній чек: від ${price} ₴`;
  restaurantCategory.textContent = `Кухня: ${kitchen}`;

  fetch(`./db/${products}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching menu: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderMenu(data);
    })
    .catch((error) => {
      console.error('Error loading menu:', error);
    });
} else {
  console.error('No restaurant selected');
  restaurantName.textContent = 'Ресторан не обрано';
}


let cartAdd = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(item) {
  cartAdd = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cartAdd.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartAdd.push({ ...item, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cartAdd)); 
}

function renderMenu(menu) {
  menuContainer.innerHTML = ''; 
  menu.forEach(({ id, name, description, price, image }) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${image}" alt="${name}" class="card-image" />
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
        </div>
        <div class="card-info">
          <p class="ingredients">${description}</p>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart" data-id="${id}" data-name="${name}" data-price="${price}" data-image="${image}">
            <span class="button-card-text">У кошик</span>
          </button>
          <strong class="card-price-bold">${price} ₴</strong>
        </div>
      </div>
    `;
    menuContainer.append(card);
  });

  const addCartButtons = menuContainer.querySelectorAll('.button-add-cart');
  addCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const item = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        image: button.dataset.image,
      };

      addToCart(item); 
    });
  });
}

checkAuth();
