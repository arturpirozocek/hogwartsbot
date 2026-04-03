const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.enableClosingConfirmation();
}

const staffDirectory = [
  { username: 'Demianovich', name: 'Демьян', role: 'admin_tech', title: 'Админ (технические вопросы)' },
  { username: 'Ananasik_ya', name: 'Анастасия', role: 'admin_edu', title: 'Админ (вопросы обучения)' },
  { username: 'sof_russo', name: 'Софа', role: 'dean_gryffindor', title: 'Декан Гриффиндора' },
  { username: 'cirquel', name: 'Апепя', role: 'dean_ravenclaw', title: 'Декан Когтеврана' },
  { username: 'kbaylife', name: 'Карина', role: 'dean_hufflepuff', title: 'Декан Пуффендуя' },
  { username: 'nikatinka_me', name: 'Ника', role: 'dean_slytherin', title: 'Декан Слизерина' },
  { username: 'nikatinka_me', name: 'Ника', role: 'quiz_master', title: 'Магистр викторин' },
  { username: 'StSatanDay', name: 'Мистер Филч', role: 'caretaker', title: 'Завхоз' },
  { username: 'Pandadrag', name: 'Эларион', role: 'teacher', title: 'Преподаватель / Староста Гриффиндора' },
  { username: 'Buna72', name: 'Проф. Таун', role: 'teacher', title: 'Преподаватель травологии' },
  { username: 'Olesionokc', name: 'Ир. Селестин Морвей', role: 'teacher', title: 'Преподаватель прорицаний' },
  { username: 'snepulik', name: 'Профессор Снейп', role: 'teacher', title: 'Преподаватель зельеварения' },
  { username: 'lenka_dm', name: 'Профессор Флитвик', role: 'teacher', title: 'Преподаватель заклинаний' },
  { username: 'Severus9969', name: 'Профессор', role: 'teacher', title: 'Преподаватель ЗоТИ' },
  { username: 'Lune474', name: 'Серафина Свитч', role: 'teacher', title: 'Преподаватель трансфигурации / факультативов' },
  { username: 'KristinaTAA', name: 'Профессор Нокстер', role: 'teacher', title: 'Преподаватель древних рун' },
  { username: 'ananasik_yar', name: 'Анастейра Гринвуд', role: 'teacher', title: 'Магическая ботаника' },
  { username: 'Sofikoo_o', name: 'Соффи Браун', role: 'teacher', title: 'Полёты на метле' }
];

const PERMISSIONS = {
  student: ['view_content', 'submit_gazette', 'toggle_notifications'],
  teacher: ['view_content', 'edit_lessons', 'manage_points', 'submit_gazette', 'toggle_notifications'],
  admin_tech: ['all'],
  admin_edu: ['all'],
  dean_gryffindor: ['all'],
  dean_ravenclaw: ['all'],
  dean_hufflepuff: ['all'],
  dean_slytherin: ['all'],
  caretaker: ['view_content'],
  quiz_master: ['manage_quizzes', 'submit_gazette']
};

const HOUSE_LIST = [
  { id: 'gryffindor', name: 'Гриффиндор', color: '#a92f2f', points: 1250, crest: '🦁' },
  { id: 'slytherin', name: 'Слизерин', color: '#1f7a47', points: 1180, crest: '🐍' },
  { id: 'ravenclaw', name: 'Когтевран', color: '#255b91', points: 1225, crest: '🦅' },
  { id: 'hufflepuff', name: 'Пуффендуй', color: '#9a7d1f', points: 1205, crest: '🦡' }
];

const RULES = [
  { title: '1. Уважение и RP-этика', text: 'Оскорбления, токсичность, унижения, травля и деанон запрещены. Играем в атмосферную ролевую, а не в конфликт ради конфликта.' },
  { title: '2. Посещаемость и активность', text: 'Если вы записались на урок/ивент, постарайтесь прийти. Если не можете — предупредите заранее преподавателя или администратора.' },
  { title: '3. Использование магии', text: 'Запрещены действия, ломаюшие баланс: авто-победы, неуязвимость, игнор последствий. Заклинания изучаются постепенно.' },
  { title: '4. Ролевая логика', text: 'Любое важное действие должно быть обосновано в рамках лора. Без метагейма, годмода и резких «телепортов сюжета».' },
  { title: '5. Внутришкольная дисциплина', text: 'Соблюдайте расписание, правила факультетов, уважайте решения преподавателей и деканов.' },
  { title: '6. Медиа и сплетник', text: 'Материалы газеты публикуются администрацией/разрешёнными авторами. Фейки и клевета без разбирательства запрещены.' },
  { title: '7. Вакансии', text: 'По вакансиям обращение к администратору Анастасии. При отсутствии мест кандидатура добавляется в лист ожидания.' }
];

const STAFF_SECTIONS = {
  'Администрация и деканы': [
    'Демьян — Админ (технические вопросы) — @Demianovich',
    'Анастасия — Админ (обучение) — @Ananasik_ya',
    'Софа — Декан Гриффиндора — @sof_russo',
    'Апепя — Декан Когтеврана — @cirquel',
    'Карина — Декан Пуффендуя — @kbaylife',
    'Ника — Декан Слизерина — @nikatinka_me',
    'Ника — Магистр викторин — @nikatinka_me',
    'Мистер Филч — Завхоз — @StSatanDay'
  ],
  'Преподаватели': [
    'Эларион — УЗМС, История магии, История миров — @Pandadrag',
    'Проф. Таун — Травология — @Buna72',
    'Ир. Селестин Морвей — Прорицания — @Olesionokc',
    'Профессор Снейп — Зельеварение — @snepulik',
    'Лери / Мисс Лери, Флитвик — Заклинания — @Lerusik_lalaR / @lenka_dm',
    'Серафина Свитч — Трансфигурация — @Lune474',
    'Профессор Нокстер — Древние руны — @KristinaTAA',
    'Анастейра Гринвуд — Магическая ботаника — @ananasik_yar'
  ],
  'Старосты и комиссии': [
    'Эларион, Лера — Гриффиндор',
    'Marlen — Когтевран',
    'Дарья, Эмилия — Пуффендуй',
    'Лиза, Элизабет — Слизерин',
    'Комиссия по проверке викторин: @StSatanDay, @emiliaairapetyan, @Sofikoo_o, @Angela_Wuxiang'
  ]
};

const spells = [
  { name: 'Люмос', type: 'Свет', level: '1 курс', effect: 'Создаёт свет на конце палочки.' },
  { name: 'Экспеллиармус', type: 'Боевые', level: '2 курс', effect: 'Выбивает палочку из рук противника.' },
  { name: 'Протего', type: 'Защита', level: '2 курс', effect: 'Базовый защитный щит.' },
  { name: 'Редукто', type: 'Боевые', level: '3 курс', effect: 'Разрушает цель мощным импульсом.' },
  { name: 'Ступефай', type: 'Контроль', level: '3 курс', effect: 'Оглушает противника.' },
  { name: 'Риддикулус', type: 'Защита', level: '3 курс', effect: 'Ослабляет боггарта смехом.' },
  { name: 'Эпискей', type: 'Целительство', level: '4 курс', effect: 'Заживляет несложные травмы.' }
];

const potions = [
  { name: 'Феликс Фелицис', difficulty: 'Очень сложно', effect: 'Кратковременная удача.', recipe: 'Златоглазка, настойка чабреца, яйцо ашвиндера.' },
  { name: 'Оборотное зелье', difficulty: 'Сложно', effect: 'Временная смена внешности.', recipe: 'Кружевница, пиявки, рог двурога, шерсть нужного человека.' },
  { name: 'Костерост', difficulty: 'Средне', effect: 'Восстановление костей.', recipe: 'Экстракт скелегро-травы, настой белладонны.' },
  { name: 'Животворящий эликсир', difficulty: 'Средне', effect: 'Возвращает силы после истощения.', recipe: 'Мята, лунная вода, капля слизи флоббер-червя.' }
];

const creatures = [
  { name: 'Нюхль', danger: 'Низкая', description: 'Любит блестящие вещи и ворует монеты.', image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=900&q=80' },
  { name: 'Гиппогриф', danger: 'Средняя', description: 'Благороден, требует уважения при контакте.', image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=80' },
  { name: 'Дементор', danger: 'Критическая', description: 'Питается радостью, вызывает отчаяние.', image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=900&q=80' },
  { name: 'Фестрал', danger: 'Низкая', description: 'Виден только тем, кто видел смерть.', image: 'https://images.unsplash.com/photo-1497206365907-f5e630693df0?auto=format&fit=crop&w=900&q=80' }
];

const baseBookThemes = [
  ['Заклинания', 'Книга заклинаний', 'Филиус Флитвик'],
  ['Зелья', 'Справочник зельеварения', 'Северус Снейп'],
  ['Существа', 'Каталог магических существ', 'Ньют Скамандер'],
  ['История', 'Хроники магического мира', 'Батильда Бэгшот'],
  ['Трансфигурация', 'Практика трансфигурации', 'Минерва МакГонагалл'],
  ['Руны', 'Древние руны и символы', 'Септима Вектор'],
  ['Прорицания', 'Теория прорицаний', 'Кассандра Трелони'],
  ['Гербология', 'Волшебные растения', 'Помона Спраут'],
  ['ЗоТИ', 'Щиты и контрчары', 'Ремус Люпин'],
  ['Артефакты', 'Магические артефакты Британии', 'Гаррик Олливандер']
];

function createBooks(count = 110) {
  const books = [];
  for (let i = 1; i <= count; i += 1) {
    const theme = baseBookThemes[(i - 1) % baseBookThemes.length];
    const grade = ((i - 1) % 7) + 1;
    const [category, baseTitle, author] = theme;
    books.push({
      id: `book-${i}`,
      title: `${baseTitle} • Том ${Math.ceil(i / 3)}`,
      author,
      category,
      cover: `https://picsum.photos/seed/hogwarts-book-${i}/640/900`,
      chapters: [
        {
          title: 'Глава I. Теория и основы',
          text: [
            `Этот том посвящён дисциплине «${category}» и адаптирован для ${grade} курса. Материал построен так, чтобы студент мог учиться без перегрузки и постепенно укреплять магическую технику.`,
            'Каждый раздел начинается с исторического контекста, затем идут практические приёмы, типовые ошибки и блок безопасности. Это помогает избежать травм и конфликтов в ролевых сценах.',
            'В конце главы добавлены мини-упражнения для самостоятельной практики и заметки преподавателей Хогвартса.'
          ]
        },
        {
          title: 'Глава II. Практика в замке и на территории',
          text: [
            'Глава описывает, как применять знания на уроках, факультативных активностях и в командной игре факультета. Все упражнения привязаны к лору Поттерианы и школьным правилам.',
            'Особое внимание уделяется этике: нельзя использовать знания для унижения участников, нарушения дисциплины и сюжетного дисбаланса.',
            'Если дисциплина связана с риском, добавлены рекомендации по взаимодействию с деканами, старостами и преподавателями.'
          ]
        },
        {
          title: 'Глава III. Справочник и расширенные заметки',
          text: [
            'В справочнике собраны таблицы: термины, ключевые заклинания/реакции, ингредиенты или существа, а также удобные подсказки для быстрых ролевых ответов.',
            'Материалы согласованы под формат Telegram-школы: короткие уроки, задания в чате, недельные активности и межфакультетские события.',
            'После изучения главы рекомендуется пройти мини-квиз или практикум с проверкой преподавателя.'
          ]
        }
      ]
    });
  }

  books.unshift(
    {
      id: 'canon-1',
      title: 'Стандартная книга заклинаний (1 курс)',
      author: 'Миранда Гошоук',
      category: 'Заклинания',
      cover: 'https://picsum.photos/seed/spellbook-canon/640/900',
      chapters: [
        {
          title: 'Базовые чары',
          text: [
            'Вводный курс объясняет устройство палочковых жестов, акценты в произношении и контроль магического импульса.',
            'Студент обязан отработать Люмос, Нокс и Вингардиум Левиоса перед переходом к более сложным чарам.'
          ]
        },
        {
          title: 'Дисциплина и безопасность',
          text: [
            'Чары нельзя использовать для запугивания, порчи чужих вещей и конфликтов между факультетами.',
            'Во время занятий преподаватель фиксирует ошибки и назначает корректирующие упражнения.'
          ]
        }
      ]
    },
    {
      id: 'canon-2',
      title: 'Волшебные зелья и их приготовление',
      author: 'Арсениус Джиггер',
      category: 'Зелья',
      cover: 'https://picsum.photos/seed/potion-canon/640/900',
      chapters: [
        {
          title: 'Точность рецептуры',
          text: [
            'Даже лишняя секунда кипения может изменить свойства зелья и превратить лечебный отвар в токсичную смесь.',
            'Порядок внесения ингредиентов важнее скорости и зрелищности.'
          ]
        },
        {
          title: 'Классические ошибки',
          text: [
            'Самые частые ошибки: перегрев, некорректная нарезка ингредиентов и пропуск стабилизирующих компонентов.',
            'Перед каждым практикумом необходимо сверять рецепт с преподавательскими пометками.'
          ]
        }
      ]
    }
  );

  return books;
}

const state = {
  houses: load('houses', HOUSE_LIST),
  lessonsByCourse: load('lessonsByCourse', {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []
  }),
  articles: load('articles', [
    {
      title: 'Еженедельный сплетник открыт',
      text: 'Основной выпуск выходит по воскресеньям. В течение недели администрация может публиковать дополнительные статьи о важных событиях.',
      author: 'Редколлегия',
      createdAt: new Date().toISOString()
    }
  ]),
  authorizedGazetteAuthors: load('authorizedGazetteAuthors', []),
  notifyGazette: load('notifyGazette', false),
  quidditch: load('quidditch', {
    isOpen: false,
    registrations: [],
    matches: [],
    lastAutoGenerated: null
  }),
  selectedCourse: 1,
  books: createBooks(),
  libraryFilter: '',
  currentBookId: null,
  user: null,
  botApiBase: load('botApiBase', 'https://your-backend.example.com/api')
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(`hogwarts:${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(`hogwarts:${key}`, JSON.stringify(value));
}

function persistState() {
  save('houses', state.houses);
  save('lessonsByCourse', state.lessonsByCourse);
  save('articles', state.articles);
  save('authorizedGazetteAuthors', state.authorizedGazetteAuthors);
  save('notifyGazette', state.notifyGazette);
  save('quidditch', state.quidditch);
  save('botApiBase', state.botApiBase);
}

function getTelegramUser() {
  const tgUser = tg?.initDataUnsafe?.user;
  if (tgUser) {
    return {
      id: tgUser.id,
      username: tgUser.username || `id${tgUser.id}`,
      first_name: tgUser.first_name || 'Студент',
      last_name: tgUser.last_name || ''
    };
  }
  return {
    id: 999001,
    username: 'demo_student',
    first_name: 'Демо',
    last_name: 'Пользователь'
  };
}

function mapRoleByUsername(username) {
  const normalized = (username || '').replace('@', '').toLowerCase();
  const found = staffDirectory.find((p) => p.username.toLowerCase() === normalized);
  if (!found) {
    return { role: 'student', title: 'Студент', canWriteGazette: false };
  }
  const canWriteGazette =
    ['admin_tech', 'admin_edu', 'dean_gryffindor', 'dean_ravenclaw', 'dean_hufflepuff', 'dean_slytherin'].includes(found.role)
    || state.authorizedGazetteAuthors.includes(found.username.toLowerCase());
  return { role: found.role, title: found.title, canWriteGazette };
}

function hasPerm(perm) {
  const role = state.user.role;
  const perms = PERMISSIONS[role] || PERMISSIONS.student;
  return perms.includes('all') || perms.includes(perm);
}

async function syncToBot(action, payload) {
  if (!state.botApiBase || state.botApiBase.includes('your-backend')) return;
  try {
    await fetch(`${state.botApiBase}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('syncToBot failed', err);
  }
}

function renderHome() {
  const root = document.getElementById('homeView');
  root.innerHTML = `
    <div class="card">
      <h2>Кубок школы — песочные часы факультетов</h2>
      <p class="muted">Очки можно менять из приложения (по ролям) и синхронизировать с ботом @school_hog_bot через backend API.</p>
      <div class="grid houses">
        ${state.houses.map((h) => `
          <div class="card house" style="border-color:${h.color}88">
            <div class="house-name">${h.crest} ${h.name}</div>
            <div class="points">${h.points} очков</div>
          </div>`).join('')}
      </div>
      <div class="quick-links">
        <button class="pill" data-jump="rulesView">Устав школы</button>
        <button class="pill" data-jump="staffView">Персонал Хогвартса</button>
        <button class="pill" data-jump="gazetteView">Еженедельный сплетник</button>
      </div>
    </div>
  `;

  root.querySelectorAll('[data-jump]').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.jump));
  });
}

function renderRules() {
  const root = document.getElementById('rulesView');
  root.innerHTML = `
    <div class="card">
      <h2>Устав школы</h2>
      ${RULES.map((r) => `<div class="rule-item"><strong>${r.title}</strong><div class="small muted">${r.text}</div></div>`).join('')}
    </div>
  `;
}

function renderStaff() {
  const root = document.getElementById('staffView');
  root.innerHTML = `
    <div class="card">
      <h2>Персонал Хогвартса</h2>
      <p class="muted">Директор пока не назначен. Софа — декан Гриффиндора.</p>
      ${Object.entries(STAFF_SECTIONS).map(([section, items]) => `
        <h3>${section}</h3>
        ${items.map((item) => `<div class="staff-item">${item}</div>`).join('')}
      `).join('')}
    </div>
  `;
}

function renderGazette() {
  const root = document.getElementById('gazetteView');
  const canWrite = state.user.canWriteGazette || hasPerm('submit_gazette');

  root.innerHTML = `
    <div class="two-col">
      <div class="card">
        <h2>Еженедельный сплетник</h2>
        <p class="muted">Основной выпуск — каждое воскресенье. Внеплановые статьи выходят при важных событиях.</p>
        <label><input id="notifyToggle" type="checkbox" ${state.notifyGazette ? 'checked' : ''}/> Уведомлять о новых выпусках</label>
        <div id="articlesList">
          ${state.articles.slice().reverse().map((a) => `
            <div class="article-item">
              <strong>${a.title}</strong>
              <p>${a.text}</p>
              <div class="small muted">${a.author} • ${new Date(a.createdAt).toLocaleString('ru-RU')}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <h3>Подача материала</h3>
        <p class="small muted">Любой студент может отправить предложение в редакцию. Публикация — после проверки администрацией.</p>
        <textarea id="proposalText" placeholder="Текст заметки / сплетни / репортажа"></textarea>
        <button id="proposalBtn" class="action-btn">Отправить в редакцию</button>
        ${canWrite ? `
          <hr/>
          <h3>Публикация (админ/автор)</h3>
          <input id="articleTitle" placeholder="Заголовок"/>
          <textarea id="articleBody" placeholder="Текст статьи"></textarea>
          <button id="publishBtn" class="action-btn">Опубликовать</button>
        ` : '<p class="notice small">Права публикации выдаются администрацией.</p>'}
      </div>
    </div>
  `;

  root.querySelector('#notifyToggle').addEventListener('change', (e) => {
    state.notifyGazette = e.target.checked;
    persistState();
  });

  root.querySelector('#proposalBtn').addEventListener('click', async () => {
    const text = root.querySelector('#proposalText').value.trim();
    if (!text) return alert('Введите текст.');
    await syncToBot('gazette-proposal', { user: state.user, text });
    root.querySelector('#proposalText').value = '';
    alert('Предложение отправлено в редакцию.');
  });

  if (canWrite) {
    root.querySelector('#publishBtn').addEventListener('click', async () => {
      const title = root.querySelector('#articleTitle').value.trim();
      const text = root.querySelector('#articleBody').value.trim();
      if (!title || !text) return alert('Заполните заголовок и текст.');

      state.articles.push({ title, text, author: `@${state.user.username}`, createdAt: new Date().toISOString() });
      persistState();
      renderGazette();
      await syncToBot('gazette-publish', { title, text, author: state.user.username, notify: state.notifyGazette });
    });
  }
}

function renderLibrary() {
  const root = document.getElementById('libraryView');
  const filter = state.libraryFilter.toLowerCase();
  const books = state.books.filter((b) =>
    [b.title, b.author, b.category].join(' ').toLowerCase().includes(filter)
  );
  root.innerHTML = `
    <div class="card">
      <h2>Библиотека Хогвартса</h2>
      <p class="muted">Полноценные тома по лору Поттерианы: ${state.books.length} книг, а также разделы заклинаний, зелий и существ.</p>
      <div class="library-controls">
        <input id="librarySearch" placeholder="Поиск: заклинания, зелья, автор..." value="${state.libraryFilter}" />
      </div>
      <div class="grid books">
        ${books.slice(0, 120).map((b) => `
          <article class="card book-card">
            <div class="book-title">${b.title}</div>
            <p class="small muted">${b.author}</p>
            <p class="small">Раздел: ${b.category} • Глав: ${b.chapters.length}</p>
            <button class="action-btn" data-book="${b.id}">Открыть книгу</button>
          </article>
        `).join('')}
      </div>
      <h3>Справочники</h3>
      <div class="grid books">
        <article class="card">${spells.map((s) => `<div class="small"><strong>${s.name}</strong> — ${s.effect} (${s.level})</div>`).join('')}</article>
        <article class="card">${potions.map((p) => `<div class="small"><strong>${p.name}</strong> — ${p.effect}<br><span class="muted">${p.recipe}</span></div>`).join('')}</article>
        <article class="card">${creatures.map((c) => `<div class="small"><strong>${c.name}</strong> — ${c.description} <span class="muted">Опасность: ${c.danger}</span></div>`).join('')}</article>
      </div>
    </div>
  `;

  root.querySelector('#librarySearch').addEventListener('input', (e) => {
    state.libraryFilter = e.target.value;
    renderLibrary();
  });

  root.querySelectorAll('[data-book]').forEach((btn) => {
    btn.addEventListener('click', () => openBook(btn.dataset.book));
  });
}

function openBook(bookId) {
  const book = state.books.find((b) => b.id === bookId);
  if (!book) return;
  const dialog = document.getElementById('bookDialog');
  const content = document.getElementById('bookContent');
  content.innerHTML = `
    <h2>${book.title}</h2>
    <p class="muted">Автор: ${book.author} • Раздел: ${book.category}</p>
    ${book.chapters.map((c) => `
      <h3>${c.title}</h3>
      ${c.text.map((t) => `<p>${t}</p>`).join('')}
    `).join('')}
  `;
  dialog.showModal();
}

document.getElementById('closeBookBtn').addEventListener('click', () => {
  document.getElementById('bookDialog').close();
});

function renderLessons() {
  const root = document.getElementById('lessonsView');
  const canEdit = hasPerm('edit_lessons');
  const lessons = state.lessonsByCourse[state.selectedCourse] || [];

  root.innerHTML = `
    <div class="card">
      <h2>Расписание уроков</h2>
      <p class="muted">Переключение по курсам 1–7. Заполняют администрация и преподаватели.</p>
      <div class="quick-links">
        ${[1,2,3,4,5,6,7].map((c) => `<button class="pill ${c===state.selectedCourse?'active':''}" data-course="${c}">${c} курс</button>`).join('')}
      </div>
      <div>
        ${lessons.length ? lessons.map((l, i) => `
          <div class="lesson-item">
            <strong>${l.subject}</strong>
            <div class="small muted">${l.teacher} • ${l.time} • ${l.place}</div>
            ${canEdit ? `<button class="ghost-btn" data-del="${i}">Удалить</button>` : ''}
          </div>
        `).join('') : '<p class="notice">Пока расписание не заполнено.</p>'}
      </div>
      ${canEdit ? `
        <h3>Добавить урок</h3>
        <input id="subjectInput" placeholder="Предмет" />
        <input id="teacherInput" placeholder="Преподаватель" />
        <input id="timeInput" placeholder="Время" />
        <input id="placeInput" placeholder="Место" />
        <button id="addLessonBtn" class="action-btn">Сохранить урок</button>
      ` : '<p class="small muted">Изменение расписания доступно преподавателям/администрации.</p>'}
    </div>
  `;

  root.querySelectorAll('[data-course]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.selectedCourse = Number(btn.dataset.course);
      renderLessons();
    });
  });

  if (canEdit) {
    root.querySelector('#addLessonBtn').addEventListener('click', async () => {
      const subject = root.querySelector('#subjectInput').value.trim();
      const teacher = root.querySelector('#teacherInput').value.trim();
      const time = root.querySelector('#timeInput').value.trim();
      const place = root.querySelector('#placeInput').value.trim();
      if (!subject || !teacher || !time || !place) return alert('Заполните все поля.');
      state.lessonsByCourse[state.selectedCourse].push({ subject, teacher, time, place });
      persistState();
      renderLessons();
      await syncToBot('lessons-update', { course: state.selectedCourse, lessons: state.lessonsByCourse[state.selectedCourse] });
    });

    root.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        state.lessonsByCourse[state.selectedCourse].splice(Number(btn.dataset.del), 1);
        persistState();
        renderLessons();
        await syncToBot('lessons-update', { course: state.selectedCourse, lessons: state.lessonsByCourse[state.selectedCourse] });
      });
    });
  }
}

function generateMatches() {
  const ids = state.houses.map((h) => h.id);
  const shuffled = ids.sort(() => Math.random() - 0.5);
  const pairings = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    pairings.push([shuffled[i], shuffled[i + 1]]);
  }
  return pairings.map((p, idx) => ({
    id: `m-${Date.now()}-${idx}`,
    houseA: p[0],
    houseB: p[1],
    winner: null,
    playedAt: null
  }));
}

function renderQuidditch() {
  const root = document.getElementById('quidditchView');
  const canManage = hasPerm('all');
  const status = state.quidditch.isOpen ? 'Открыт' : 'Закрыт';
  const statusCls = state.quidditch.isOpen ? 'status-open' : 'status-closed';

  root.innerHTML = `
    <div class="card">
      <h2>Квиддич-турнир</h2>
      <p>Статус: <strong class="${statusCls}">${status}</strong></p>
      <p class="muted">Игроки записываются, когда турнир открыт. Пары факультетов генерируются автоматически.</p>
      ${canManage ? `
        <button id="toggleQuidditch" class="action-btn">${state.quidditch.isOpen ? 'Закрыть турнир' : 'Открыть турнир'}</button>
        <button id="generateMatches" class="ghost-btn">Сгенерировать пары</button>
      ` : ''}

      ${state.quidditch.isOpen ? `
        <h3>Запись игроков</h3>
        <input id="quidditchRole" placeholder="Ваша роль (ловец, охотник...)" />
        <button id="registerQuidditch" class="action-btn">Записаться</button>
      ` : '<p class="small muted">Запись будет доступна после открытия турнира администрацией.</p>'}

      <h3>Текущие матчи</h3>
      ${(state.quidditch.matches || []).length ? state.quidditch.matches.map((m) => {
        const a = state.houses.find((h) => h.id === m.houseA)?.name;
        const b = state.houses.find((h) => h.id === m.houseB)?.name;
        return `<div class="lesson-item">
          <strong>${a} vs ${b}</strong><br>
          <span class="small muted">${m.winner ? `Победитель: ${state.houses.find((h) => h.id === m.winner)?.name}` : 'Матч не завершён'}</span>
          ${canManage && !m.winner ? `
            <div class="quick-links">
              <button class="pill" data-win="${m.id}:${m.houseA}">Победа ${a}</button>
              <button class="pill" data-win="${m.id}:${m.houseB}">Победа ${b}</button>
            </div>
          ` : ''}
        </div>`;
      }).join('') : '<p class="muted">Пары ещё не сгенерированы.</p>'}
    </div>
  `;

  if (canManage) {
    root.querySelector('#toggleQuidditch')?.addEventListener('click', async () => {
      state.quidditch.isOpen = !state.quidditch.isOpen;
      persistState();
      renderQuidditch();
      await syncToBot('quidditch-status', { open: state.quidditch.isOpen });
    });

    root.querySelector('#generateMatches')?.addEventListener('click', async () => {
      state.quidditch.matches = generateMatches();
      state.quidditch.lastAutoGenerated = new Date().toISOString();
      persistState();
      renderQuidditch();
      await syncToBot('quidditch-matches', { matches: state.quidditch.matches });
    });

    root.querySelectorAll('[data-win]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const [matchId, winner] = btn.dataset.win.split(':');
        const match = state.quidditch.matches.find((m) => m.id === matchId);
        if (!match) return;
        match.winner = winner;
        match.playedAt = new Date().toISOString();
        const house = state.houses.find((h) => h.id === winner);
        house.points += 35;
        persistState();
        renderHome();
        renderQuidditch();
        await syncToBot('house-points', { houseId: winner, delta: 35, reason: 'quidditch_win' });
      });
    });
  }

  root.querySelector('#registerQuidditch')?.addEventListener('click', async () => {
    const role = root.querySelector('#quidditchRole').value.trim();
    if (!role) return alert('Укажите роль.');
    state.quidditch.registrations.push({ user: state.user.username, role, createdAt: new Date().toISOString() });
    persistState();
    await syncToBot('quidditch-register', { username: state.user.username, role });
    alert('Вы записаны в турнирный список.');
  });
}

function renderProfile() {
  const root = document.getElementById('profileView');
  root.innerHTML = `
    <div class="two-col">
      <div class="card">
        <h2>Профиль</h2>
        <div><strong>${state.user.first_name} ${state.user.last_name || ''}</strong> (@${state.user.username})</div>
        <div class="small muted">Telegram ID: ${state.user.id}</div>
        <div class="role-badge">${state.user.title}</div>
        <h3>Права в приложении</h3>
        ${(PERMISSIONS[state.user.role] || []).map((p) => `<div class="permission-line small">• ${p}</div>`).join('')}
      </div>
      <div class="card">
        <h3>Управление школой</h3>
        ${hasPerm('manage_points') || hasPerm('all') ? `
          <p class="small muted">Добавление/снятие очков факультетов:</p>
          <select id="houseSelect">${state.houses.map((h) => `<option value="${h.id}">${h.name}</option>`).join('')}</select>
          <input id="pointsDelta" type="number" placeholder="Например: 10 или -5" />
          <input id="pointsReason" placeholder="Причина" />
          <button id="savePoints" class="action-btn">Применить</button>
        ` : '<p class="muted">Недоступно для вашей роли.</p>'}

        ${hasPerm('all') ? `
          <h3>Выдача прав автора сплетника</h3>
          <input id="gazetteAuthor" placeholder="username без @" />
          <button id="addGazetteAuthor" class="ghost-btn">Добавить автора</button>
          <div class="small muted">Текущие авторы: ${state.authorizedGazetteAuthors.join(', ') || 'нет'}</div>
          <h3>Интеграция с ботом</h3>
          <input id="botApiInput" value="${state.botApiBase}" placeholder="https://..." />
          <button id="saveBotApi" class="ghost-btn">Сохранить API URL</button>
        ` : ''}
      </div>
    </div>
  `;

  if (hasPerm('manage_points') || hasPerm('all')) {
    root.querySelector('#savePoints').addEventListener('click', async () => {
      const houseId = root.querySelector('#houseSelect').value;
      const delta = Number(root.querySelector('#pointsDelta').value || 0);
      const reason = root.querySelector('#pointsReason').value.trim() || 'manual_adjustment';
      if (!delta) return alert('Укажите значение отличное от 0.');
      const house = state.houses.find((h) => h.id === houseId);
      house.points += delta;
      persistState();
      renderHome();
      await syncToBot('house-points', { houseId, delta, reason, by: state.user.username });
      alert('Очки обновлены.');
    });
  }

  if (hasPerm('all')) {
    root.querySelector('#addGazetteAuthor').addEventListener('click', () => {
      const username = root.querySelector('#gazetteAuthor').value.trim().toLowerCase().replace('@', '');
      if (!username) return;
      if (!state.authorizedGazetteAuthors.includes(username)) {
        state.authorizedGazetteAuthors.push(username);
        persistState();
        renderProfile();
      }
    });
    root.querySelector('#saveBotApi').addEventListener('click', () => {
      const url = root.querySelector('#botApiInput').value.trim();
      state.botApiBase = url;
      persistState();
      alert('API URL сохранён.');
    });
  }
}

function navigate(viewId) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.route === viewId));
}

function initUser() {
  const tgUser = getTelegramUser();
  const roleData = mapRoleByUsername(tgUser.username);
  state.user = { ...tgUser, ...roleData };
}

function renderAll() {
  renderHome();
  renderRules();
  renderStaff();
  renderGazette();
  renderLibrary();
  renderLessons();
  renderQuidditch();
  renderProfile();
}

function initEvents() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.route));
  });

  document.getElementById('openProfileBtn').addEventListener('click', () => navigate('profileView'));
}

function boot() {
  initUser();
  initEvents();
  renderAll();
  navigate('homeView');
}

boot();
