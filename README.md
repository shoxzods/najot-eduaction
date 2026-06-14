# 🎓 Education CRM

> CRM-система для управления студентами, курсами и коммуникацией на онлайн-платформах.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/react-18.x-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-15.x-336791.svg)

---

## 📖 About

**Education CRM** — веб-система управления взаимоотношениями с учениками, разработанная для онлайн-платформ и учебных курсов. Помогает администраторам и педагогам управлять студентами, отслеживать прогресс, обрабатывать заявки и автоматизировать коммуникацию — всё в одном месте.

Построена на **React** (фронтенд) и **Node.js** (бэкенд) — быстрый, масштабируемый и современный стек для управления полным жизненным циклом студента: от первого контакта до активного обучения.

---

## ✨ Key Features

- 👤 **Student & Lead Management** — управление базой студентов и входящими заявками
- 📚 **Course Enrollment** — запись на курсы и отслеживание прогресса обучения
- 💳 **Payments & Subscriptions** — обработка платежей и управление подписками
- 👩‍🏫 **Role System** — роли: администратор, преподаватель, менеджер
- 📊 **Analytics Dashboard** — аналитика и отчёты по успеваемости и продажам
---

## 🛠️ Tech Stack

### ⚛️ Frontend
| Технология | Описание |
|---|---|
| React 18+ | UI-библиотека с компонентным подходом |
| Java Script | Статическая типизация |
| Axios | HTTP-клиент для работы с API |
| Vite | Быстрый бандлер и dev-сервер |

### 🟢 Backend
| Технология | Описание |
|---|---|
| Node.js 18+ | Серверная среда выполнения JS |
| Nest.js | Веб-фреймворк для REST API |
| TypeScript | Типизация на уровне сервера |
| Prisma ORM | Работа с базой данных |


## 📁 Project Structure

```
education-crm/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI компоненты
│   │   ├── pages/          # Страницы приложения
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Глобальное состояние
│   │   └── api/            # API-клиент (Axios)
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Обработчики запросов
│   │   ├── routes/         # Маршруты API
│   │   ├── middleware/     # Middleware (auth, logging)
│   │   ├── models/         # Prisma модели
│   │   └── services/       # Бизнес-логика
│   └── package.json
├── prisma/
│   └── schema.prisma       # Схема базы данных
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 15
- npm или yarn

### Installation

```bash
# Клонировать репозиторий
git clone https://github.com/ShoxzodPrimov/najot_eduaction.git
cd education-crm

# Установить зависимости (frontend + backend)
npm install
cd client && npm install
```

### Run Development

```bash
# Запустить backend
npm run dev:server

# Запустить frontend (в отдельном терминале)
npm run dev:client

# Или запустить всё одновременно
npm run dev
```

Открыть в браузере: [http://localhost:5173](http://localhost:5173)


---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

<p align="center">Made with ❤️ for Education</p>
