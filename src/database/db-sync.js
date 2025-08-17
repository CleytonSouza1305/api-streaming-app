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

  await query(`CREATE TABLE IF NOT EXISTS avatars (
      id SERIAL PRIMARY KEY,
      avatar_link TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
  )

  await query(`CREATE TABLE IF NOT EXISTS profiles (
      id VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
      profile_name VARCHAR(255) DEFAULT 'user',
      is_kid BOOLEAN DEFAULT false,
      avatar_id INT DEFAULT 1,
      profile_pin VARCHAR(10),
      user_id VARCHAR(255) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (avatar_id) REFERENCES avatars (id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`)

  await query(`CREATE TABLE IF NOT EXISTS favorites_movies (
      user_id VARCHAR(255) NOT NULL,
      tmdb_movie_id VARCHAR(255) NOT NULL,
      PRIMARY KEY (user_id, tmdb_movie_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`)

  await query(`CREATE TABLE IF NOT EXISTS profile_list (
      profile_id VARCHAR(255) NOT NULL,
      movie_id INT NOT NULL,
      PRIMARY KEY (profile_id, movie_id),
      FOREIGN KEY (profile_id) REFERENCES profiles(id)
    );`)

  console.log("Tabelas criadas com sucesso!");
}

createTables()