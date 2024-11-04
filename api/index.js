// api/items.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Create a new ticket entry
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust to your allowed origin(s) if needed
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Handle preflight requests
        res.status(204).end();
        return;
    }

    if (req.method === 'POST') {
        const { studentTickets, parentTickets, tableTickets, studentNames, parentNames, total } = req.body;
        try {
            const result = await pool.query(
                'INSERT INTO tickets (student_tickets, parent_tickets, table_tickets, student_names, parent_names, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [studentTickets, parentTickets, tableTickets, studentNames, parentNames, total]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'GET') {
        try {
            const result = await pool.query('SELECT * FROM tickets');
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query; // Use query parameters in Vercel
        try {
            await pool.query('DELETE FROM tickets WHERE id = $1', [id]);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
