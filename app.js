const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const staff = [
  { section: 'Администрация', name: 'Демьян', role: 'Админ (тех. вопросы)', username: 'Demianovich' },
  { section: 'Администрация', name: 'Анастасия', role: 'Админ (обучение)', username: 'Ananasik_ya' },
  { section: 'Администрация', name: 'Мистер Филч', role: 'Завхоз', username: 'StSatanDay' },
  { section: 'Деканы', name: 'Софа', role: 'Декан Гриффиндора', username: 'sof_russo' },
  { section: 'Деканы', name: 'Апепя', role: 'Декан Когтеврана', username: 'cirquel' },
  { section: 'Деканы', name: 'Карина', role: 'Декан Пуффендуя', username: 'kbaylife' },
  { section: 'Деканы', name: 'Ника', role: 'Декан Слизерина', username: 'nikatinka_me' },
  { section: 'Деканы', name: 'Ника', role: 'Магистр викторин', username: 'nikatinka_me' },
  { section: 'Преподаватели', name: 'Эларион', role: 'УЗМС / История магии', username: 'Pandadrag' },
  { section: 'Преподаватели', name: 'Проф. Таун', role: 'Травология', username: 'Buna72' },
  { section: 'Преподаватели', name: 'Профессор Снейп', role: 'Зельеварение', username: 'snepulik' },
  { section: 'Преподаватели', name: 'Профессор Флитвик', role: 'Заклинания', username: 'lenka_dm' },
  { section: 'Преподаватели', name: 'Серафина Свитч', role: 'Трансфигурация', username: 'Lune474' }
];

const roleMatrix = {
  student: ['read'],
  teacher: ['read', 'lessons:edit', 'points:edit', 'gazette:publish'],
  admin: ['*']
};

const roleByUsername = {
  demianovich: 'admin',
  ananasik_ya: 'admin',
  sof_russo: 'admin',
  cirquel: 'admin',
  kbaylife: 'admin',
  nikatinka_me: 'admin',
  pandadrag: 'teacher',
  buna72: 'teacher',
  snepulik: 'teacher',
  lenka_dm: 'teacher',
  lune474: 'teacher'
};

const initialRules = [
  { title: 'Атмосфера и уважение', body: 'Хогвартс — ролевая школа. Соблюдайте уважение к участникам, не мешайте чужим сюжетам и не нарушайте границы игроков.' },
  { title: 'Учебный процесс', body: 'Уроки ведутся по курсам 1–7. Расписание заполняют преподаватели и администрация.' },
  { title: 'Магия в RP', body: 'Заклинания применяются по уровню персонажа: сначала теория, затем практика. Опасные ритуалы запрещены без допуска администрации.' },
  { title: 'Еженедельный сплетник', body: 'Главный выпуск выходит по воскресеньям, дополнительные материалы — в течение недели. Студенты отправляют материалы в редакцию.' },
  { title: 'Библиотека', body: 'Книги оформлены в стиле пергаментных томов: заклинания, зелья, существа, предметы, история и сказки.' }
];

const LIBRARY_SECTIONS = [
  { id: 'all', label: 'Все разделы' },
  { id: 'spells', label: 'Заклинания' },
  { id: 'potions', label: 'Зелья' },
  { id: 'creatures', label: 'Существа' },
  { id: 'items', label: 'Волшебные предметы' },
  { id: 'subjects', label: 'Учебные предметы' },
  { id: 'history', label: 'История' },
  { id: 'tales', label: 'Сказки и рассказы' }
];

const S = {
  houses: load('houses', [
    { id: 'gryffindor', name: 'Гриффиндор', icon: '🦁', points: 0, color: '#c73c2c' },
    { id: 'slytherin', name: 'Слизерин', icon: '🐍', points: 0, color: '#1f8f66' },
    { id: 'ravenclaw', name: 'Когтевран', icon: '🦅', points: 0, color: '#446ac8' },
    { id: 'hufflepuff', name: 'Пуффендуй', icon: '🦡', points: 0, color: '#d3ab43' }
  ]),
  rules: load('rules', initialRules),
  gazette: load('gazette', []),
  lessons: load('lessons', { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }),
  selectedCourse: 1,
  notifyGazette: load('notifyGazette', false),
  books: buildBooks(),
  query: '',
  librarySection: 'all',
  user: null,
  botApiBase: load('botApiBase', '')
};

function load(k, def) {
  try {
    const v = localStorage.getItem(`hogwarts4:${k}`);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
}

function save() {
  localStorage.setItem('hogwarts4:houses', JSON.stringify(S.houses));
  localStorage.setItem('hogwarts4:rules', JSON.stringify(S.rules));
  localStorage.setItem('hogwarts4:gazette', JSON.stringify(S.gazette));
  localStorage.setItem('hogwarts4:lessons', JSON.stringify(S.lessons));
  localStorage.setItem('hogwarts4:notifyGazette', JSON.stringify(S.notifyGazette));
  localStorage.setItem('hogwarts4:botApiBase', JSON.stringify(S.botApiBase));
}

function tgUser() {
  const u = tg?.initDataUnsafe?.user;
  if (u) return u;
  return { id: 1000, username: 'demo_student', first_name: 'Demo', last_name: '' };
}

function can(perm) {
  const list = roleMatrix[S.user.role] || [];
  return list.includes('*') || list.includes(perm);
}

function resolveUser() {
  const u = tgUser();
  const key = String(u.username || '').toLowerCase();
  S.user = {
    id: u.id,
    username: u.username || `id${u.id}`,
    name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Студент',
    role: roleByUsername[key] || 'student'
  };
}

function go(viewId) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.view === viewId));
}

function home() {
  const max = Math.max(...S.houses.map((h) => h.points), 1);
  const root = document.getElementById('castleView');
  root.innerHTML = `
    <div class="hero"><div style="font-size:42px">🏰</div><h2>Добро пожаловать в Хогвартс</h2><p class="small"><i>Draco dormiens nunquam titillandus</i></p></div>
    <div class="card">
      <h3 class="section-title">⌛ Песочные часы факультетов</h3>
      <div class="hours">${S.houses.map((h) => `<div class="hour"><div style="font-size:33px">${h.icon}</div><div class="tube"><div class="fill" style="height:${Math.round((h.points / max) * 100)}%; background:${h.color}"></div></div><div class="house-points" style="color:${h.color}">${h.points}</div><div class="house-name">${h.name}</div></div>`).join('')}</div>
    </div>
    <button class="menu-btn" id="openRules">📜 Устав школы →</button>
    <button class="menu-btn" id="openStaff">👥 Персонал Хогвартса →</button>
    <button class="menu-btn" id="openGazette">📰 Еженедельный Сплетник →</button>
  `;
  root.querySelector('#openRules').onclick = () => go('rulesView');
  root.querySelector('#openStaff').onclick = () => go('staffView');
  root.querySelector('#openGazette').onclick = () => go('gazetteView');
}

function rules() {
  const root = document.getElementById('rulesView');
  root.innerHTML = `
    <div class="hero"><div style="font-size:40px">📜</div><h2>Устав Хогвартса</h2></div>
    <div class="card">${S.rules.map((r) => `<details class="acc"><summary>${r.title}</summary><p>${r.body}</p></details>`).join('')}</div>
    <button class="btn" id="backCastle1">← Вернуться в Замок</button>
  `;
  root.querySelector('#backCastle1').onclick = () => go('castleView');
}

function staffView() {
  const sections = [...new Set(staff.map((x) => x.section))];
  const root = document.getElementById('staffView');
  root.innerHTML = `
    <div class="hero"><h2>👥 Персонал Хогвартса</h2></div>
    ${sections.map((sec) => `<div class="card"><h3 class="section-title">${sec}</h3>${staff.filter((p) => p.section === sec).map((p) => `<div class="staff-row"><div><div><b>${p.name}</b></div><div class="tag">${p.role}</div></div><div class="nick">@${p.username}</div></div>`).join('')}</div>`).join('')}
    <button class="btn" id="backCastle2">← Вернуться в Замок</button>
  `;
  root.querySelector('#backCastle2').onclick = () => go('castleView');
}

function gazetteView() {
  const canPublish = can('gazette:publish') || can('*');
  const root = document.getElementById('gazetteView');
  root.innerHTML = `
    <div class="hero"><h2>📰 Еженедельный сплетник</h2></div>
    <div class="card">
      <label><input id="noti" type="checkbox" ${S.notifyGazette ? 'checked' : ''}/> Уведомлять о новых выпусках</label>
      <p class="small">Воскресенье — основной выпуск. Дополнительные статьи — по событиям недели.</p>
      ${S.gazette.length ? S.gazette.slice().reverse().map((a) => `<article class="article"><h3 class="section-title">${a.title}</h3><p>${a.text}</p><div class="tag">${a.author} • ${new Date(a.date).toLocaleString('ru-RU')}</div></article>`).join('') : '<div class="article">Пока выпусков нет.</div>'}
    </div>
    <div class="grid2">
      <div class="card controls"><h3 class="section-title">Отправить материал в редакцию</h3><textarea id="proposal" placeholder="Твой текст"></textarea><button class="btn" id="sendProposal">Отправить</button></div>
      <div class="card controls"><h3 class="section-title">Публикация (админ/препод)</h3>${canPublish ? '<input id="pubTitle" placeholder="Заголовок"/><textarea id="pubText" placeholder="Текст статьи"></textarea><button class="btn" id="publish">Опубликовать</button>' : '<div class="tag">Нет прав публикации</div>'}</div>
    </div>
  `;

  root.querySelector('#noti').onchange = (e) => { S.notifyGazette = e.target.checked; save(); };
  root.querySelector('#sendProposal').onclick = async () => {
    const text = root.querySelector('#proposal').value.trim();
    if (!text) return alert('Напиши текст.');
    await sync('proposal', { text, by: S.user.username });
    root.querySelector('#proposal').value = '';
    alert('Отправлено в редакцию.');
  };

  if (canPublish) {
    root.querySelector('#publish').onclick = async () => {
      const title = root.querySelector('#pubTitle').value.trim();
      const text = root.querySelector('#pubText').value.trim();
      if (!title || !text) return alert('Заполни все поля.');
      S.gazette.push({ title, text, author: `@${S.user.username}`, date: Date.now() });
      save();
      gazetteView();
      await sync('publish', { title, text, author: S.user.username, notify: S.notifyGazette });
    };
  }
}

function lessonsView() {
  const editable = can('lessons:edit') || can('*');
  const list = S.lessons[S.selectedCourse] || [];
  const root = document.getElementById('lessonsView');
  root.innerHTML = `
    <div class="hero"><h2>📅 Уроки</h2><p class="small">Курсы 1–7 • пока без предзаполнения</p></div>
    <div class="card">
      <div class="btn-row">${[1,2,3,4,5,6,7].map((n) => `<button class="btn" data-c="${n}">${n} курс</button>`).join('')}</div>
      ${list.length ? list.map((x, i) => `<div class="lesson"><b>${x.subject}</b><div class="tag">${x.teacher} • ${x.time} • ${x.place}</div>${editable ? `<button class="btn" data-del="${i}">Удалить</button>` : ''}</div>`).join('') : '<div class="lesson">Расписание пока пустое. Его заполнит администрация или преподаватели.</div>'}
    </div>
    ${editable ? '<div class="card controls"><h3 class="section-title">Добавить урок</h3><input id="lsub" placeholder="Предмет"/><input id="ltea" placeholder="Учитель"/><input id="ltime" placeholder="Время"/><input id="lplace" placeholder="Место"/><button class="btn" id="addLesson">Сохранить</button></div>' : ''}
  `;

  root.querySelectorAll('[data-c]').forEach((b) => { b.onclick = () => { S.selectedCourse = Number(b.dataset.c); lessonsView(); }; });

  if (editable) {
    root.querySelectorAll('[data-del]').forEach((b) => {
      b.onclick = async () => {
        list.splice(Number(b.dataset.del), 1);
        save();
        lessonsView();
        await sync('lessons', { course: S.selectedCourse, lessons: list });
      };
    });

    root.querySelector('#addLesson').onclick = async () => {
      const subject = root.querySelector('#lsub').value.trim();
      const teacher = root.querySelector('#ltea').value.trim();
      const time = root.querySelector('#ltime').value.trim();
      const place = root.querySelector('#lplace').value.trim();
      if (!subject || !teacher || !time || !place) return alert('Заполни все поля.');
      list.push({ subject, teacher, time, place });
      save();
      lessonsView();
      await sync('lessons', { course: S.selectedCourse, lessons: list });
    };
  }
}

function libraryView() {
  const root = document.getElementById('libraryView');
  const data = S.books.filter((b) => {
    const matchesText = `${b.title} ${b.categoryLabel} ${b.author}`.toLowerCase().includes(S.query.toLowerCase());
    const matchesSection = S.librarySection === 'all' || b.section === S.librarySection;
    return matchesText && matchesSection;
  });

  root.innerHTML = `
    <div class="hero"><h2>📖 Библиотека Хогвартса</h2><p class="small">${S.books.length} книг в каталоге</p></div>
    <div class="card controls"><input id="q" placeholder="Поиск по названию, автору или теме..." value="${S.query}"/><div class="chip-row">${LIBRARY_SECTIONS.map((s) => `<button class="chip ${S.librarySection === s.id ? 'active' : ''}" data-sec="${s.id}">${s.label}</button>`).join('')}</div></div>
    <div class="books">${data.map((b) => `<article class="book-tile" style="--cover:${b.cover}"><div class="book-spine">${b.categoryLabel}</div><h4>${b.title}</h4><div class="tag">${b.author}</div>${b.image ? `<img class="book-thumb" src="${b.image}" alt="${b.title}" loading="lazy"/>` : ''}<button class="btn" data-book="${b.id}">Открыть книгу</button></article>`).join('')}</div>
  `;

  root.querySelector('#q').oninput = (e) => { S.query = e.target.value; libraryView(); };
  root.querySelectorAll('[data-sec]').forEach((b) => { b.onclick = () => { S.librarySection = b.dataset.sec; libraryView(); }; });
  root.querySelectorAll('[data-book]').forEach((b) => { b.onclick = () => openBook(b.dataset.book); });
}

function openBook(id) {
  const book = S.books.find((x) => x.id === id);
  if (!book) return;
  const modal = document.getElementById('bookModal');
  const body = document.getElementById('bookInner');
  body.innerHTML = `
    <header class="reader-head"><div class="book-seal">✦</div><div><h2>${book.title}</h2><div class="tag">${book.author} • ${book.categoryLabel}</div></div></header>
    ${book.image ? `<img class="reader-image" src="${book.image}" alt="${book.title}" loading="lazy"/>` : ''}
    ${book.recipe ? `<div class="reader-note"><b>Рецепт:</b> ${book.recipe}</div>` : ''}
    ${book.appearance ? `<div class="reader-note"><b>Как выглядит:</b> ${book.appearance}</div>` : ''}
    ${book.chapters.map((ch) => `<section class="reader-chapter"><h3>${ch.title}</h3>${ch.paragraphs.map((p) => `<p>${p}</p>`).join('')}</section>`).join('')}
  `;
  modal.showModal();
}

function profileView() {
  const pointsControl = can('points:edit') || can('*');
  const root = document.getElementById('profileView');
  root.innerHTML = `
    <div class="hero"><h2>👤 Профиль</h2></div>
    <div class="card"><div><b>${S.user.name}</b> (@${S.user.username})</div><div class="tag">Telegram ID: ${S.user.id}</div><div class="tag">Роль: ${S.user.role}</div></div>
    <div class="card"><h3 class="section-title">🏆 Управление очками факультетов</h3>${pointsControl ? `<select id="phouse">${S.houses.map((h) => `<option value="${h.id}">${h.name}</option>`).join('')}</select><input id="pdelta" type="number" placeholder="Например 10 или -5"/><input id="preason" placeholder="Причина"/><button class="btn" id="setPoints">Применить</button>` : '<div class="tag">Нет прав на изменение очков.</div>'}</div>
    <div class="card controls"><h3 class="section-title">Интеграция с ботом</h3><input id="api" value="${S.botApiBase}" placeholder="https://your-backend/api"/><button class="btn" id="saveApi">Сохранить API</button><p class="small">Для общей синхронизации между всеми пользователями нужен backend.</p></div>
  `;

  if (pointsControl) {
    root.querySelector('#setPoints').onclick = async () => {
      const houseId = root.querySelector('#phouse').value;
      const delta = Number(root.querySelector('#pdelta').value || 0);
      if (!delta) return alert('Укажи значение, отличное от 0.');
      const reason = root.querySelector('#preason').value.trim() || 'manual';
      S.houses.find((h) => h.id === houseId).points += delta;
      save();
      home();
      await sync('points', { houseId, delta, reason, by: S.user.username });
      alert('Очки обновлены.');
    };
  }

  root.querySelector('#saveApi').onclick = () => {
    S.botApiBase = root.querySelector('#api').value.trim();
    save();
    alert('Сохранено.');
  };
}

document.getElementById('closeBook').onclick = () => document.getElementById('bookModal').close();

async function sync(endpoint, payload) {
  if (!S.botApiBase) return;
  try {
    await fetch(`${S.botApiBase}/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  } catch {
    // local mode
  }
}

const RAW_CREATURES = `
Абаримон
Абраксанский крылатый конь
Авгурей
Акромантул
Акромантулы Запретного леса
Апполосская пушишка
Банши
Белый речной монстр
Бес малый
Боггарт
Болтрушайка
Большая пурпурная жаба
Бундимун
Валлийский зелёный дракон
Вампир
Вампус
Василиск
Вейла
Великаны
Венгерский хвосторог
Веретенница
Взрывопотам
Виверна
Водяной из озера Лох-Ломонд
Гебридский чёрный дракон
Гелиопат
Гигантский кальмар
Гиппогриф
Гиппокамп
Глиноклок
Гном садовый
Гоблины
Горный тролль
Гранианский крылатый конь
Грим
Гриндилоу
Грифон
Двурог
Дементор
Демимаска
Джарви
Диринар
Докси
Домашние эльфы
Дракон
Дромарог
Единорог
Жмыр
Золотой сниджет
Зомби
Инфернал
Йети
Каппа
Каталонский огненный шар
Кельпи
Китайский огненный шар
Клабберт
Клювокрыл
Кокатрис
Красные колпаки
Крылатый конь
Лепрекон
Лесной тролль
Летучие мыши-вампиры
Лох-несское чудовище
Лукотрус
Лунный телец
Мантикора
Матагот
Мерроу
Мозгошмыг
Морской змей
Морщерогий кизляк
Наргл
Нарл
Норвежский горбатый дракон
Нунду
Нюхлер
Оборотень
Обскур
Огневица
Огненный краб
Огр
Оккамий
Опаловоглазый антипод
Пакваджи
Перуанский змеезуб
Пикирующий злыдень
Пикси
Погребин
Полтергейст
Португальский длиннорылый дракон
Почтовые совы
Птица-гром
Пушишка
Пятиног
Растопырник
Ре-эм
Речной тролль
Рогатый змей
Румынский длиннорог
Рунеспур
Русалки и тритоны
Саламандра
Сасквотч
Селки
Сирены
Скрытень
Смеркут
Сналлигастер
Соплохвост
Сфинкс
Трёхголовая собака
Тролль из Надрож
Украинский железнобрюхий дракон
Упырь
Фвупер
Феникс
Фестрал
Фея
Флоббер-червь
Химера
Ходаг
Цилинь
Чизпурфл
Чупакабра
Шведский короткорылый дракон
Штырехвост
Эрклинг
Этонский крылатый конь
Ядовитая утка
Ямбо
`;

const RAW_ITEMS = `
Часы Фабиана Пруэтта
Чаша Пенелопы Пуффендуй
Чемодан Ньюта Саламандера
Банкомат банка Гринготтс
Бисерная сумочка Гермионы Грейнджер
Бита загонщика
Бладжер
Бронзовый котёл
Волшебная палатка
Волшебное фото
Волшебные часы Уизли
Волшебные шахматы
Волшебный глаз Грюма
Воскрешающий камень
Вредноскоп
Громовещатель
Дары Смерти
Делюминатор
Детектор лжи
Диадема Кандиды Когтевран
Зачарованные монеты
Зеркало Еиналеж
Зеркало Сириуса
Золотое яйцо
Карта Мародёров
Книга доступа
Ковёр-самолёт
Котёл
Кубок Огня
Летучий порох
Луноскоп
Мантия-невидимка
Маска Пожирателя Смерти
Маховик времени
Медальон Слизерина
Меч Гриффиндора
Напоминалка
Невидимые чернила
Негаснущая свеча
Оловянный котёл
Омнинокль
Омут памяти
Остроконечная шляпа
Пергамент
Перо приёма
Песочные часы факультетов
Портал
Портрет
Проклятое ожерелье
Проявитель врагов
Прытко Пишущее Перо
Рука славы
Серебряная рука
Спектрально-астральные очки
Сундук Аластора Грюма
Философский камень
Фотоальбом Гарри Поттера
Фотография Ордена Феникса
Хрустальный шар
Часы Аластора Грюма
Часы Дамблдора
`;

const MAGIC_OVERVIEW = [
  'Магия недоступна маглам и сквибам, что и отличает их от волшебников; маглы развивают технологии там, где волшебники используют чары.',
  'Согласно Международному статуту о секретности (1689), магическое сообщество скрывает свою природу от магловского мира.',
  'Тёмные искусства считаются опасной областью: за применение запрещённых практик предусмотрены тяжёлые наказания вплоть до Азкабана.',
  'Древняя магия — редчайшая ветвь, к XIX веку почти утраченная; в истории Хогвартса она упоминается как основа древних защит замка.'
];

function uniqueList(raw) {
  return [...new Set(raw.split('\n').map((x) => x.trim()).filter(Boolean))];
}

function buildBooks() {
  const catalog = [
    book('sp1', 'spells', 'Стандартная книга заклинаний. 1 курс', 'Миранда Гошоук', '#5c2b1d', [
      chapter('Базовые чары', ['Lumos, Nox, Wingardium Leviosa и Alohomora относятся к базовой школьной программе.', 'Главное правило: чёткая формула + точная траектория палочки + стабильная концентрация.', 'Для новичков важнее аккуратность, чем скорость.']),
      chapter('Безопасность', ['Не направляй тренировочные чары в лицо ученика.', 'При срыве эффекта сразу используй Finite и зови преподавателя.'])
    ], { image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80' }),

    book('sp2', 'spells', 'Продвинутые защитные чары', 'Филиус Флитвик', '#4b2e5e', [
      chapter('Щитовые заклинания', ['Protego отражает часть атакующих чар, но не заменяет тактику.', 'В дуэльной практике важен тайминг: ставить щит до попадания, а не после.']),
      chapter('Патронус', ['Expecto Patronum требует устойчивого светлого воспоминания.', 'В учебной практике даже нетелесная форма уже считается успехом.'])
    ]),

    book('pt1', 'potions', 'Волшебные зелья и их приготовление', 'Арсениус Джиггер', '#365230', [
      chapter('Техника приготовления', ['Порядок ингредиентов критичен: ошибка в этапе может испортить весь котёл.', 'Температура и направление помешивания всегда идут по рецепту.']),
      chapter('Учебные составы', ['В школьной практике чаще всего изучают заживляющие, укрепляющие и диагностические составы.'])
    ], {
      image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=1200&q=80',
      recipe: 'Шаги: подготовить котёл → измельчить ингредиенты по инструкции → поддерживать нужный огонь → добавлять компоненты по таймеру.',
      appearance: 'Корректно сваренное зелье обычно имеет ровный цвет, без крупных хлопьев и резкого едкого дыма.'
    }),

    book('pt2', 'potions', 'Продвинутое зельеварение', 'Либатиус Борадж', '#40512d', [
      chapter('Амортеция', ['Амортеция известна как сильнейшее любовное зелье, но не создаёт настоящую любовь.', 'В каноне рассматривается как этически опасный инструмент манипуляции.']),
      chapter('Феликс Фелицис', ['Редкое зелье кратковременной удачи. Передозировка опасна и строго запрещена.'])
    ], {
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      appearance: 'Характерные признаки «удачной» варки: ровная консистенция и тонкое золотистое мерцание на поверхности.'
    }),

    book('cr1', 'creatures', 'Фантастические звери и места их обитания', 'Ньют Скамандер', '#4b3a2a', [
      chapter('Классификация Министерства', ['Существа получают категорию X–XXXXX по уровню опасности.', 'Категория отражает риск контакта, а не «злой характер» вида.']),
      chapter('Гиппогрифы', ['Подходить только после поклона и ожидания ответного жеста.', 'Неуважение трактуется как вызов.'])
    ], { image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80' }),

    book('cr2', 'creatures', 'Драконы мира', 'Чарли Уизли (сост.)', '#6d4024', [
      chapter('Известные породы', ['Венгерская хвосторога, норвежский горбатый и китайский огненный шар — одни из самых известных.', 'Работа с драконами допускается только специалистам заповедников.'])
    ], { image: 'https://images.unsplash.com/photo-1619468129361-605ebea04b44?auto=format&fit=crop&w=1200&q=80' }),

    book('it1', 'items', 'Волшебные палочки: древесина и сердцевина', 'Гаррик Олливандер', '#513722', [
      chapter('Выбор палочки', ['Палочка выбирает волшебника: учитываются темперамент, стиль магии и устойчивость характера.', 'Классические сердцевины: волос единорога, перо феникса, сердечная жила дракона.'])
    ], { image: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?auto=format&fit=crop&w=1200&q=80' }),

    book('it2', 'items', 'Карта Мародёров и магические карты', 'Школьный архив', '#3f2b29', [
      chapter('Живые карты', ['Магические карты могут показывать перемещения и скрытые проходы.', 'Подобные артефакты обычно ограничиваются правилами доступа из-за вопросов приватности.'])
    ]),

    book('it3', 'items', 'Квиддич: метлы, снитч и инвентарь', 'Библиотека Хогвартса', '#5d4121', [
      chapter('Основы', ['Команда состоит из семи игроков: 3 охотника, 2 загонщика, вратарь, ловец.', 'Поимка снитча приносит 150 очков и часто завершает матч.'])
    ], { image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80' }),

    book('sb1', 'subjects', 'Теория трансфигурации', 'Минерва Макгонагалл', '#314c6f', [
      chapter('Законы Гэмпа', ['Исключения элементарной трансфигурации ограничивают преобразование ряда категорий материи.', 'Сначала изучают неодушевлённые объекты, затем сложные формы.'])
    ]),

    book('hs1', 'history', 'История магии Британии', 'Батильда Бэгшот', '#493e35', [
      chapter('Статут о секретности', ['Статут о секретности закрепил разделение магического и немагического миров.', 'Современные школьные правила по скрытности опираются на эту основу.'])
    ]),

    book('tl1', 'tales', 'Сказки барда Бидля', 'Бард Бидль', '#5c3b4a', [
      chapter('Сказка о трёх братьях', ['Притча о Старшей палочке, Воскрешающем камне и Мантии-невидимке говорит о цене силы и выборе.', 'Считается культурным фундаментом магического фольклора Британии.'])
    ]),
    book('mg1', 'subjects', 'Магия: основы волшебного мира', 'Хогвартс, учебный архив', '#3e3651', [
      chapter('Общая теория', MAGIC_OVERVIEW),
      chapter('Содержание дисциплины', ['Магия людей', 'Стихийная магия и магия без палочки', 'Магия существ и предметов', 'Зельеварение и магические существа/растения'])
    ])
  ];

  const templates = [
    ['spells', 'Практикум по чарам', 'Кафедра Заклинаний', '#4a3056'],
    ['potions', 'Лаборатория зелий', 'Кафедра Зельеварения', '#35503a'],
    ['creatures', 'Полевой бестиарий', 'Кафедра УЗМС', '#5c4028'],
    ['items', 'Справочник артефактов', 'Кабинет истории магии', '#5b3e2a'],
    ['subjects', 'Учебный конспект', 'Совет преподавателей', '#3a4a66'],
    ['history', 'Исторические заметки', 'Школьный архив', '#5a4736'],
    ['tales', 'Сборник преданий', 'Библиотека Хогвартса', '#5a3447']
  ];

  const generated = [];
  const creatures = uniqueList(RAW_CREATURES);
  const items = uniqueList(RAW_ITEMS);

  creatures.forEach((name, idx) => {
    generated.push(
      book(`cre-${idx + 1}`, 'creatures', `Существо: ${name}`, 'Справочник магозоологии', '#4a3a2a', [
        chapter('Краткое описание', [
          `${name} упоминается в материалах магического мира как самостоятельный вид или подвид волшебных существ.`,
          'В учебной практике Хогвартса для каждого существа фиксируют среду обитания, уровень угрозы и правила безопасного контакта.'
        ]),
        chapter('Поведение и осторожность', [
          'Перед очным взаимодействием изучают повадки, реакцию на свет/шум и допустимую дистанцию.',
          'Контакт со сложными существами проводится только при сопровождении преподавателя УЗМС.'
        ])
      ])
    );
  });

  items.forEach((name, idx) => {
    generated.push(
      book(`itm-${idx + 1}`, 'items', `Предмет: ${name}`, 'Каталог волшебных артефактов', '#5a3d2a', [
        chapter('Назначение', [
          `${name} относится к волшебным предметам, используемым в быту, учебе, защите или истории магического сообщества.`,
          'В описаниях учитываются происхождение предмета, ограничения по применению и потенциальные риски.'
        ]),
        chapter('Практика и хранение', [
          'Артефакты с мощными чарами требуют отдельного хранения и журнала доступа.',
          'Использование школьных артефактов разрешается только по правилам кабинета и под надзором ответственного преподавателя.'
        ])
      ])
    );
  });

  for (let i = 1; i <= 30; i++) {
    const t = templates[i % templates.length];
    generated.push(book(`gen${i}`, t[0], `${t[1]} — том ${i}`, t[2], t[3], [
      chapter('Глава I. Контекст', ['Материал оформлен как библиотечный том Хогвартса: историческое вступление, терминология и заметки по безопасности.', 'Содержание адаптировано для уроков, ролевых сцен и самостоятельного чтения.']),
      chapter('Глава II. Практика', ['Раздел содержит учебные сценарии, типичные ошибки и способы их исправления.', 'Сложные действия рекомендуется согласовывать с преподавателем или администрацией.'])
    ], i % 6 === 0 ? { image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80' } : null));
  }

  return [...catalog, ...generated];
}

function book(id, section, title, author, cover, chapters, meta = null) {
  return { id, section, title, author, cover, chapters, categoryLabel: sectionLabel(section), ...(meta || {}) };
}

function chapter(title, paragraphs) {
  return { title, paragraphs };
}

function sectionLabel(section) {
  const x = LIBRARY_SECTIONS.find((s) => s.id === section);
  return x ? x.label : 'Разное';
}

function bindNav() {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.onclick = () => go(btn.dataset.view);
  });
}

function boot() {
  resolveUser();
  bindNav();
  home();
  rules();
  staffView();
  gazetteView();
  lessonsView();
  libraryView();
  profileView();
}

boot();
