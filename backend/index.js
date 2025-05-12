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

// Přidat nový produkt
app.post('/produkty', async (req, res) => {
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
