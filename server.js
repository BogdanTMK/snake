const path = require('path');
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const postgres = require('@fastify/postgres');
const staticPlugin = require('@fastify/static');
 
fastify.register(cors, {
  origin: '*'
});
 
// Раздача snake.html и любых других файлов из папки public
fastify.register(staticPlugin, {
  root: path.join(__dirname, 'public')
});
 
fastify.register(postgres, {
  connectionString: process.env.DATABASE_URL
});
 
// Создание таблицы при запуске
fastify.ready(async () => {
  try {
    await fastify.pg.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        player_name VARCHAR(50) NOT NULL,
        score INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "leaderboard" is ready');
  } catch (err) {
    console.error('Error creating table:', err);
  }
});
 
// Получить топ-10
fastify.get('/api/leaderboard', async (request, reply) => {
  try {
    const { rows } = await fastify.pg.query(
      'SELECT player_name, score, created_at FROM leaderboard ORDER BY score DESC LIMIT 10'
    );
    return rows;
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});
 
// Сохранить новый рекорд
fastify.post('/api/leaderboard', async (request, reply) => {
  const { playerName, score } = request.body;
 
  if (!playerName || playerName.length > 50 || playerName.length < 1) {
    return reply.status(400).send({ error: 'Invalid player name (1-50 characters)' });
  }
 
  if (score === undefined || typeof score !== 'number' || score < 0) {
    return reply.status(400).send({ error: 'Invalid score' });
  }
 
  try {
    const { rows } = await fastify.pg.query(
      'INSERT INTO leaderboard (player_name, score) VALUES ($1, $2) RETURNING *',
      [playerName.trim(), score]
    );
    return rows[0];
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});
 
// Проверка, вошел ли игрок в топ-10
fastify.post('/api/leaderboard/check', async (request, reply) => {
  const { score } = request.body;
 
  try {
    const { rows } = await fastify.pg.query(
      'SELECT COUNT(*) as count FROM leaderboard WHERE score > $1',
      [score]
    );
    const higherScores = parseInt(rows[0].count);
    const isTop10 = higherScores < 10;
    return { isTop10, position: higherScores + 1 };
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
});
 
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.log('Server running');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
 
start();