const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Získat všechny produkty
app.get('/produkty', async (req, res) => {
  const result = await pool.query('SELECT * FROM produkt ORDER BY id');
  res.json(result.rows);
});

app.post('/produkty', overAdmina, async (req, res) => {
  const { nazev, popis } = req.body;
  await pool.query('INSERT INTO produkt (nazev, popis) VALUES ($1, $2)', [nazev, popis]);
  res.sendStatus(201);
});

// Smazat produkt
app.delete('/produkty/:id', async (req, res) => {
  await pool.query('DELETE FROM produkt WHERE id = $1', [req.params.id]);
  res.sendStatus(204);
});

// Přidat poznámku k produktu
app.post('/poznamky', async (req, res) => {
  const { uzivatel_id, produkt_id, text } = req.body;
  await pool.query('INSERT INTO poznamka (uzivatel_id, produkt_id, text) VALUES ($1, $2, $3)', [uzivatel_id, produkt_id, text]);
  res.sendStatus(201);
});

app.post('/login', async (req, res) => {
  const { jmeno } = req.body;

  const result = await pool.query('SELECT * FROM uzivatel WHERE jmeno = $1', [jmeno]);
  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ error: 'Uživatel nenalezen' });
  }

  // Jednoduchý token – v praxi by se použil JWT
  res.json({ id: user.id, jmeno: user.jmeno, role_id: user.role_id });
});

async function overAdmina(req, res, next) {
  const { id } = req.body;
  const result = await pool.query('SELECT role_id FROM uzivatel WHERE id = $1', [id]);
  const user = result.rows[0];

  if (!user || user.role_id !== 1) {
    return res.status(403).json({ error: 'Přístup zamítnut. Jen admin může upravovat.' });
  }

  next();
}


app.delete('/produkty/:id', overAdmina, async (req, res) => {
  await pool.query('DELETE FROM produkt WHERE id = $1', [req.params.id]);
  res.sendStatus(204);
});


// Získat poznámky k produktu
app.get('/poznamky/:produkt_id', async (req, res) => {
  const result = await pool.query(`
    SELECT u.jmeno, p.text FROM poznamka p
    JOIN uzivatel u ON p.uzivatel_id = u.id
    WHERE p.produkt_id = $1`, [req.params.produkt_id]);
  res.json(result.rows);
});

app.listen(port, () => {
  console.log(`🚀 Server běží na http://localhost:${port}`);
});
