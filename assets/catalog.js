/* ============================================================
   Каталог номеров — данные, рендер, фильтрация
   ============================================================ */

// ---- Данные (имитация БД; в Задании 3 — из MySQL) ----
const ROOMS = [
  {
    id: 1,
    category: 'lux',
    categoryLabel: 'Люкс',
    price: 5000,
    capacity: 2,
    area: 40,
    image: 'assets/img/lux-101.jpg',
    features: ['Кондиционер', 'Телевизор', 'Холодильник', 'Wi-Fi']
  },
  {
    id: 2,
    category: 'studio',
    categoryLabel: 'Студия',
    price: 3500,
    capacity: 2,
    area: 28,
    image: 'assets/img/studio-201.jpg',
    features: ['Кондиционер', 'Телевизор', 'Wi-Fi']
  },
  {
    id: 3,
    category: 'standard',
    categoryLabel: 'Стандартный',
    price: 2000,
    capacity: 1,
    area: 18,
    image: 'assets/img/standard-301.jpg',
    features: ['Wi-Fi']
  },
  {
    id: 4,
    category: 'lux',
    categoryLabel: 'Люкс',
    price: 6500,
    capacity: 3,
    area: 55,
    image: 'assets/img/lux-102.jpg',
    features: ['Кондиционер', 'Телевизор', 'Холодильник', 'Wi-Fi']
  },
  {
    id: 5,
    category: 'studio',
    categoryLabel: 'Студия',
    price: 4000,
    capacity: 2,
    area: 32,
    image: 'assets/img/studio-202.jpg',
    features: ['Кондиционер', 'Телевизор', 'Холодильник', 'Wi-Fi']
  },
  {
    id: 6,
    category: 'standard',
    categoryLabel: 'Стандартный',
    price: 2500,
    capacity: 2,
    area: 22,
    image: 'assets/img/standard-302.jpg',
    features: ['Телевизор', 'Wi-Fi']
  }
];

// ---- DOM ----
const grid = document.getElementById('roomGrid');
const filterForm = document.getElementById('filterForm');
const resetBtn = document.getElementById('resetFilter');

// ---- Рендер карточки ----
function renderCard(room) {
  return `
    <article class="room-card" data-id="${room.id}">
      <img src="${room.image}" alt="${room.categoryLabel} №${room.id}" loading="lazy">
      <div class="room-body">
        <h3 class="room-category">${room.categoryLabel}</h3>
        <p class="room-price">${room.price.toLocaleString('ru-RU')} ₽ / сутки</p>
        <ul class="room-features">
          <li>${room.capacity} ${pluralize(room.capacity, 'место', 'места', 'мест')}</li>
          <li>${room.area} м²</li>
          <li>${room.features.join(', ')}</li>
        </ul>
        <a href="booking.html?room_id=${room.id}" class="btn btn-primary">Забронировать</a>
      </div>
    </article>
  `;
}

function pluralize(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

// ---- Рендер сетки ----
function renderGrid(rooms) {
  if (rooms.length === 0) {
    grid.innerHTML = `<div class="no-results" style="grid-column: 1 / -1;">
      По выбранным условиям номера не найдены. Попробуйте изменить фильтр.
    </div>`;
    return;
  }
  grid.innerHTML = rooms.map(renderCard).join('');
}

// ---- Случайные 6 номеров (для первого показа) ----
function pickRandom(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

// ---- Фильтрация ----
function applyFilter(event) {
  if (event) event.preventDefault();

  const category = document.getElementById('filterCategory').value;
  const priceMin = parseInt(document.getElementById('filterPriceMin').value, 10);
  const priceMax = parseInt(document.getElementById('filterPriceMax').value, 10);
  const capacity = parseInt(document.getElementById('filterCapacity').value, 10);

  let filtered = ROOMS.filter(room => {
    if (category && room.category !== category) return false;
    if (!isNaN(priceMin) && room.price < priceMin) return false;
    if (!isNaN(priceMax) && room.price > priceMax) return false;
    if (!isNaN(capacity)) {
      if (capacity === 3 && room.capacity < 3) return false;
      if (capacity !== 3 && room.capacity !== capacity) return false;
    }
    return true;
  });

  renderGrid(filtered);
}

// ---- Сброс фильтра ----
function resetFilter() {
  filterForm.reset();
  // Возвращаем случайные 6 номеров (как при первом заходе)
  renderGrid(pickRandom(ROOMS, 6));
}

// ---- Инициализация ----
document.addEventListener('DOMContentLoaded', () => {
  // Первый показ — 6 случайных номеров
  renderGrid(pickRandom(ROOMS, 6));

  filterForm.addEventListener('submit', applyFilter);
  resetBtn.addEventListener('click', resetFilter);
});
