CREATE TABLE games (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    developer   VARCHAR(255),
    genre       VARCHAR(100),
    platform    VARCHAR(100),
    release_year INT,
    status      VARCHAR(50) NOT NULL DEFAULT 'backlog'
                CHECK (status IN ('playing', 'completed', 'dropped', 'backlog', 'wishlist')),
    hours_played DECIMAL(6,1) DEFAULT 0,
    cover_image TEXT DEFAULT NULL,
    notes       TEXT DEFAULT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ratings (
    id         SERIAL PRIMARY KEY,
    game_id    INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    score      DECIMAL(3,1) NOT NULL CHECK (score >= 0 AND score <= 10) DEFAULT 0,
    review     TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(game_id) -- un rating por juego
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_rating()
RETURNS TRIGGER AS $$
BEGIN
	INSERT INTO ratings (game_id)
	VALUES (NEW.id);
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER ratings_updated_at
    BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER create_rating
AFTER INSERT ON games
FOR EACH ROW EXECUTE FUNCTION log_rating();

INSERT INTO games (title, developer, genre, platform, release_year, status, hours_played, cover_image, notes)
VALUES
    ('Hollow Knight',    'Team Cherry',        'Metroidvania', 'PC',      2017, 'completed', 42.0, 'https://res.cloudinary.com/duzscodzj/image/upload/v1778091671/sv6xgeapmz9v2o5sy3jt.jpg','Obra maestra'),
    ('Celeste',          'Maddy Thorson',       'Platformer',   'PC',      2018, 'completed', 15.5,  'https://res.cloudinary.com/duzscodzj/image/upload/v1778092823/lhwspwehcchbvl9p7z47.jpg', 'Historia increíble'),
    ('Elden Ring',       'FromSoftware',        'RPG',          'PC',      2022, 'playing',   80.0,  'https://res.cloudinary.com/duzscodzj/image/upload/v1778092780/jwryoamzxalwxfdzur7t.jpg', 'Sigo muriendo en Malenia'),
    ('Hades',            'Supergiant Games',    'Roguelite',    'PC',      2020, 'backlog',    0.0,  'https://res.cloudinary.com/duzscodzj/image/upload/v1778092723/zwlqb7nrf9x1ovuqlqts.jpg', NULL),
    ('Stardew Valley',   'ConcernedApe',        'Simulation',   'PC',      2016, 'dropped',   30.0, 'https://res.cloudinary.com/duzscodzj/image/upload/v1778092185/gborbxbx6ytf7typw5ef.jpg','Me aburrió en año 3');