/* ============================================================
   Бронирование — данные номера, валидация, отправка
   ============================================================ */

// ---- Те же данные, что и в каталоге (имитация БД) ----
const ROOMS = {
  1: { id: 1, categoryLabel: 'Люкс', price: 5000, capacity: 2, area: 40,
       image: 'assets/img/lux-101.jpg' },
  2: { id: 2, categoryLabel: 'Студия', price: 3500, capacity: 2, area: 28,
       image: 'assets/img/studio-201.jpg' },
  3: { id: 3, categoryLabel: 'Стандартный', price: 2000, capacity: 1, area: 18,
       image: 'assets/img/standard-301.jpg' },
  4: { id: 4, categoryLabel: 'Люкс', price: 6500, capacity: 3, area: 55,
       image: 'assets/img/lux-102.jpg' },
  5: { id: 5, categoryLabel: 'Студия', price: 4000, capacity: 2, area: 32,
       image: 'assets/img/studio-202.jpg' },
  6: { id: 6, categoryLabel: 'Стандартный', price: 2500, capacity: 2, area: 22,
       image: 'assets/img/standard-302.jpg' }
};

// ---- Правила валидации (те же, что на сервере в Задании 3) ----
const RULES = {
  firstName: {
    test: v => /^[А-Яа-яЁё\s.\-]{2,100}$/u.test(v),
    message: 'Имя: только кириллица, пробелы, точки и тире (2–100 символов)'
  },
  lastName: {
    test: v => /^[А-Яа-яЁё\s.\-]{2,100}$/u.test(v),
    message: 'Фамилия: только кириллица, пробелы, точки и тире (2–100 символов)'
  },
  phone: {
    test: v => /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(v),
    message: 'Телефон в формате +7(ХХХ)ХХХ-ХХ-ХХ'
  },
  email: {
    test: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
    message: 'Введите корректный e-mail'
  },
  checkIn: {
    test: v => isValidDate(v),
    message: 'Дата заезда в формате ДД.ММ.ГГГГ'
  },
  checkOut: {
    test: v => isValidDate(v),
    message: 'Дата выезда в формате ДД.ММ.ГГГГ'
  }
};

function isValidDate(str) {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(str)) return false;
  const [d, m, y] = str.split('.').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function parseDate(str) {
  const [d, m, y] = str.split('.').map(Number);
  return new Date(y, m - 1, d);
}

// ---- Показ ошибки у поля ----
function setError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errEl = document.getElementById('err' + fieldId.charAt(0).toUpperCase() + fieldId.slice(1));
  if (message) {
    input.classList.add('is-invalid');
    errEl.textContent = message;
    errEl.classList.add('visible');
  } else {
    input.classList.remove('is-invalid');
    errEl.textContent = '';
    errEl.classList.remove('visible');
  }
}

// ---- Валидация всей формы ----
function validateForm() {
  let valid = true;
  const values = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    checkIn: document.getElementById('checkIn').value.trim(),
    checkOut: document.getElementById('checkOut').value.trim()
  };

  for (const key of Object.keys(RULES)) {
    const value = values[key];
    if (!value) {
      setError(key, 'Поле обязательно для заполнения');
      valid = false;
      continue;
    }
    if (!RULES[key].test(value)) {
      setError(key, RULES[key].message);
      valid = false;
    } else {
      setError(key, '');
    }
  }

  // Доп. проверка: дата выезда позже даты заезда
  if (values.checkIn && values.checkOut &&
      isValidDate(values.checkIn) && isValidDate(values.checkOut)) {
    if (parseDate(values.checkOut) <= parseDate(values.checkIn)) {
      setError('checkOut', 'Дата выезда должна быть позже даты заезда');
      valid = false;
    }
  }

  return valid ? values : null;
}

// ---- Отображение информации о номере ----
function showRoomInfo() {
  const params = new URLSearchParams(window.location.search);
  const roomId = parseInt(params.get('room_id'), 10);
  const room = ROOMS[roomId];
  const infoEl = document.getElementById('roomInfo');
  const idInput = document.getElementById('roomId');

  if (!room) {
    infoEl.innerHTML = '⚠️ Номер не выбран. Вернитесь в <a href="catalog.html">каталог</a> и выберите номер.';
    idInput.value = '';
    return;
  }

  idInput.value = room.id;
  infoEl.innerHTML = `
    Вы бронируете: <strong>${room.categoryLabel}</strong> —
    <strong>${room.price.toLocaleString('ru-RU')} ₽ / сутки</strong><br>
    ${room.capacity} мест · ${room.area} м²
  `;
}

// ---- Обработка отправки ----
function handleSubmit(event) {
  event.preventDefault();

  const successAlert = document.getElementById('successAlert');
  const errorAlert = document.getElementById('errorAlert');
  successAlert.classList.remove('visible');
  errorAlert.classList.remove('visible');

  const roomId = document.getElementById('roomId').value;
  if (!roomId) {
    errorAlert.textContent = 'Ошибка: номер не выбран. Вернитесь в каталог.';
    errorAlert.classList.add('visible');
    return;
  }

  const values = validateForm();
  if (!values) {
    errorAlert.textContent = 'Пожалуйста, исправьте ошибки в форме.';
    errorAlert.classList.add('visible');
    return;
  }

  // Имитация отправки на сервер (в Задании 3 — fetch на booking.php)
  console.log('Отправка заявки:', { roomId, ...values });

  successAlert.textContent = `✅ Заявка успешно отправлена! Номер: ${roomId}. Мы свяжемся с вами по телефону ${values.phone} для подтверждения.`;
  successAlert.classList.add('visible');
  document.getElementById('bookingForm').reset();
  document.getElementById('roomId').value = roomId;
}

// ---- Инициализация ----
document.addEventListener('DOMContentLoaded', () => {
  showRoomInfo();
  document.getElementById('bookingForm').addEventListener('submit', handleSubmit);

  // Живая валидация при потере фокуса
  ['firstName', 'lastName', 'phone', 'email', 'checkIn', 'checkOut'].forEach(id => {
    document.getElementById(id).addEventListener('blur', () => {
      const value = document.getElementById(id).value.trim();
      if (!value) { setError(id, 'Поле обязательно для заполнения'); return; }
      if (!RULES[id].test(value)) setError(id, RULES[id].message);
      else setError(id, '');
    });
  });
});
