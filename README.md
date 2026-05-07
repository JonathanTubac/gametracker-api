# GameTracker API

REST API for tracking and rating video games. Manage a personal game library with status tracking, playtime logging, and reviews.

## Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5
- **Database**: PostgreSQL (Supabase-compatible)
- **Deployment**: Vercel (serverless)

## Project structure

```
gametracker-api/
├── index.js                  # Entry point — Express setup and route mounting
├── vercel.json               # Vercel deployment config
├── .env.example              # Environment variables template
└── src/
    ├── config/
    │   └── db.js             # PostgreSQL connection pool
    ├── routes/
    │   ├── game.routes.js
    │   └── rating.routes.js
    ├── controllers/
    │   ├── game.controller.js
    │   └── rating.controller.js
    ├── services/
    │   ├── game.service.js
    │   └── rating.service.js
    ├── repositories/
    │   ├── game.repository.js
    │   └── rating.repository.js
    ├── middlewares/
    │   └── error.middleware.js
    └── utils/
        └── errors.js         # Custom error classes
```

## Setup

Copy `.env.example` to `.env` and fill in your values:

```env
DB_USER=postgres
DB_PASS=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gametracker

# Alternative: full connection string (takes precedence over the variables above)
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

## Installation and running

```bash
npm install
npm run dev
```

## Running with Docker

Docker Compose starts both the API and a PostgreSQL 16 database. The schema is applied automatically on first boot.

### 1. Copy the environment and compose files

**PowerShell**
```powershell
Copy-Item .env.example .env
Copy-Item docker-compose.yml.example docker-compose.yml
```

**CMD**
```cmd
copy .env.example .env
copy docker-compose.yml.example docker-compose.yml
```

**Linux / macOS**
```bash
cp .env.example .env
cp docker-compose.yml.example docker-compose.yml
```

### 2. Start the services

```bash
docker compose up --build
```

The API will be available at `http://localhost:3000`.

### 3. Stop the services

```bash
docker compose down
```

To also remove the database volume (wipes all data):

```bash
docker compose down -v
```

## Database schema

```sql
-- Games
CREATE TABLE games (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  developer     TEXT,
  genre         TEXT,
  platform      TEXT,
  release_year  INT,
  status        TEXT DEFAULT 'backlog',
  hours_played  NUMERIC DEFAULT 0,
  cover_image   TEXT,
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Ratings (one per game)
CREATE TABLE ratings (
  id         SERIAL PRIMARY KEY,
  game_id    INT UNIQUE REFERENCES games(id) ON DELETE CASCADE,
  score      NUMERIC NOT NULL CHECK (score >= 0 AND score <= 10),
  review     TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Endpoints

### Health check

| Method | Route     | Description    |
|--------|-----------|----------------|
| GET    | `/health` | API status     |

### Games — `/api/v1/games`

| Method | Route  | Description       |
|--------|--------|-------------------|
| GET    | `/`    | List all games    |
| GET    | `/:id` | Get a game        |
| POST   | `/`    | Create a game     |
| PUT    | `/:id` | Update a game     |
| DELETE | `/:id` | Delete a game     |

#### Query params for `GET /`

| Param    | Type   | Description                                     |
|----------|--------|-------------------------------------------------|
| `page`   | number | Page number (default: 1)                        |
| `limit`  | number | Results per page (default: 10)                  |
| `q`      | string | Search by title                                 |
| `status` | string | Filter by status (`backlog`, `playing`, etc.)   |
| `sort`   | string | Sort field                                      |
| `order`  | string | `asc` or `desc`                                 |

#### Request body for `POST` / `PUT`

```json
{
  "title": "Hollow Knight",
  "dev": "Team Cherry",
  "genre": "Metroidvania",
  "platform": "PC",
  "release": 2017,
  "status": "completed",
  "hours": 42,
  "image": "https://...",
  "notes": "Amazing game"
}
```

### Ratings — `/api/v1/games/:id/rating`

| Method | Route         | Description                          |
|--------|---------------|--------------------------------------|
| GET    | `/:id/rating` | Get a game's rating                  |
| POST   | `/:id/rating` | Create or update a rating (upsert)   |
| DELETE | `/:id/rating` | Delete a rating                      |

#### Request body for `POST`

```json
{
  "score": 9.5,
  "review": "An incredible game with deep lore."
}
```

## CORS

CORS (Cross-Origin Resource Sharing) is the browser mechanism that blocks HTTP requests between different origins (different domain, protocol, or port); since the client and server run on different ports in development, `fetch()` calls would be blocked without this configuration. The server uses the `cors` package with `origin: '*'` to allow all origins during development.

## Deploying to Vercel

The project is configured to run as a serverless function on Vercel. Connect the repository and set the environment variables in the Vercel dashboard.

---

## Screenshot

![GameTracker API screenshot](./screenshots/games.PNG)

## Implemented Challenges

### Core API Requirements

| Challenge | Points | Status |
|-----------|--------|--------|
| OpenAPI/Swagger spec written in YAML or JSON | 20 | ⬜ |
| Swagger UI served from the backend (not just the file) | 20 | ⬜ |
| Correct HTTP status codes throughout the API (201 on create, 204 on delete, 404 if not found, 400 on invalid input) | 20 | ✅ |
| Server-side validation with descriptive JSON error responses | 20 | ✅ |
| Pagination on `GET /api/v1/games` via `?page=` and `?limit=` | 30 | ✅ |
| Name search via `?q=` | 15 | ✅ |
| Sorting via `?sort=` and `?order=asc\|desc` | 15 | ✅ |

### Bonus Challenges

| Challenge | Points | Status |
|-----------|--------|--------|
| Export game list to CSV — generated from JavaScript, no libraries | 20 | ⬜ |
| Export game list to Excel (.xlsx) — generated from JavaScript, no libraries (SpreadsheetML) | 30 | ⬜ |
| Rating system — dedicated DB table, own REST endpoints, visible in the client | 30 | ✅ |
| Image upload (max ~1 MB per image) | 30 | ⬜ |

## Reflection

<!-- Required — missing this section costs -20 points -->
<!-- Write 2–3 sentences: Would you use this tech stack again? What was the hardest part? What did you learn? -->

> _TODO: Add your reflection here._
