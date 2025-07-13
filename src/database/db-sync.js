const { query } = require(".");

async function createTables() {
  await query(`CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      plan VARCHAR(100) DEFAULT 'basic',
      plan_expiry DATE NOT NULL,
      language VARCHAR(10) DEFAULT 'pt-BR',
      is_active BOOLEAN DEFAULT true,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`)

  await query(`CREATE TABLE IF NOT EXISTS profiles (
      Id VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
      profile_name VARCHAR(255) DEFAULT 'user',
      is_kid BOOLEAN DEFAULT false,
      avatar_url TEXT DEFAULT null,
      profile_pin VARCHAR(10),
      user_id VARCHAR(255) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`)

  await query(`CREATE TABLE IF NOT EXISTS favorites_movies (
      user_id VARCHAR(255) NOT NULL,
      tmdb_movie_id VARCHAR(255) NOT NULL,
      PRIMARY KEY (user_id, tmdb_movie_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`)

  await query(`CREATE TABLE IF NOT EXISTS watch_history (
      id VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
      profile_id VARCHAR(255) NOT NULL,
      tmdb_movie_id VARCHAR(255) NOT NULL,
      progress INT DEFAULT 0, 
      is_finished BOOLEAN DEFAULT false,
      last_watched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (profile_id) REFERENCES profiles(id)
    );`)

  console.log("Tabelas criadas com sucesso!");
}

createTables()