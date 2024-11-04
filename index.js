// backend.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(cors());




app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});





// Create a new ticket entry
app.post('/api/items', async (req, res) => {
    const { studentTickets, parentTickets, tableTickets, studentNames, parentNames, total } = req.body;
    console.log(studentNames, parentNames)
    try {
        const result = await pool.query(
            'INSERT INTO tickets (student_tickets, parent_tickets, table_tickets, student_names, parent_names, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [studentTickets, parentTickets, tableTickets, studentNames, parentNames, total]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

// Retrieve all tickets
app.get('/api/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tickets');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a ticket entry
app.delete('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tickets WHERE id = $1', [id]);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
