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

## Deploying to Vercel

The project is configured to run as a serverless function on Vercel. Connect the repository and set the environment variables in the Vercel dashboard.
