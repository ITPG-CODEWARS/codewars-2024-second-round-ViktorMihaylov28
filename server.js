// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Връзка с MySQL база данни
const db = mysql.createConnection({
  host: 'localhost', // Промени с твоя хост
  user: 'root', // Промени с потребителското си име за MySQL
  password: 'admin', // Промени с паролата си за MySQL
  database: 'competition' // Промени с името на базата данни
});

db.connect((err) => {
  if (err) {
    console.error('Грешка при свързване с базата данни:', err);
    return;
  }
  console.log('Свързано с MySQL базата данни');
});

// Маршрут за изтриване на всички записи в базата данни
app.post('/api/clear-urls', (req, res) => {
  const deleteQuery = 'DELETE FROM urls';
  db.query(deleteQuery, (err, result) => {
    if (err) {
      console.error('Грешка при изтриване на записи от базата данни:', err);
      return res.status(500).json({ error: 'Грешка при изтриване на данни' });
    }
    res.json({ message: 'Всички записи бяха изтрити' });
  });
});

//Маршрут за запазване на URL в база данни с ограничение за брой записи
app.post('/api/save-url', (req, res) => {
  const { longUrl, shortUrl } = req.body;

  if (!longUrl || !shortUrl) {
    return res.status(400).json({ error: 'Липсва дълъг или кратък URL адрес' });
  }

  // Проверка за броя на записаните URL-ове
  const countQuery = 'SELECT COUNT(*) AS count FROM urls';
  db.query(countQuery, (err, results) => {
    if (err) {
      console.error('Грешка при проверка за броя записи:', err);
      return res.status(500).json({ error: 'Грешка при проверка в базата данни' });
    }

    const urlCount = results[0].count;

    // Проверка дали потребителят вече има 3 дълги и 3 къси URL-а
    if (urlCount >= 3) {
      return res.status(400).json({ error: 'Можете да запазите само 3 URL адреса с безплатен абонамент.' });
    }

    // Проверка за уникалност на URL-овете
    const checkQuery = 'SELECT * FROM urls WHERE long_url = ? OR short_url = ?';
    db.query(checkQuery, [longUrl, shortUrl], (err, results) => {
      if (err) {
        console.error('Грешка при проверка за уникалност:', err);
        return res.status(500).json({ error: 'Грешка при проверка в базата данни' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'Дългият или краткият URL вече съществуват в базата данни.' });
      }

      // Ако броят на URL-овете е под 3 и URL-ът е уникален, запазваме новия URL
      const insertQuery = 'INSERT INTO urls (long_url, short_url) VALUES (?, ?)';
      db.query(insertQuery, [longUrl, shortUrl], (err, results) => {
        if (err) {
          console.error('Грешка при запис в базата данни:', err);
          return res.status(500).json({ error: 'Грешка при запис в базата данни' });
        }
        res.json({ message: 'URL адресите бяха успешно записани', id: results.insertId });
      });
    });
  });
});

// Маршрут за извличане на последните 3 кратки URL-а с дългите им URL-и
app.get('/api/get-short-urls', (req, res) => {
  const query = 'SELECT short_url, long_url FROM urls ORDER BY id DESC LIMIT 3';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Грешка при извличане на URL-ите от базата данни:', err);
      return res.status(500).json({ error: 'Грешка при извличане на данни' });
    }
    res.json(results);
  });
});

// Маршрут за обновяване на краткия URL в базата данни
app.post('/api/update-url', (req, res) => {
  const { longUrl, shortUrl } = req.body;

  if (!longUrl || !shortUrl) {
    return res.status(400).json({ error: 'Липсва дълъг или кратък URL адрес' });
  }

  const query = 'UPDATE urls SET short_url = ? WHERE long_url = ?';
  db.query(query, [shortUrl, longUrl], (err, results) => {
    if (err) {
      console.error('Грешка при обновяване на URL-а:', err);
      return res.status(500).json({ error: 'Грешка при обновяване на данни' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'URL адресът не беше намерен' });
    }

    res.json({ message: 'Краткият URL беше успешно обновен' });
  });
});


// Стартиране на сървъра
app.listen(PORT, () => {
  console.log(`Сървърът работи на http://localhost:${PORT}`);
});
