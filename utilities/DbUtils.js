const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

async function getContactAndEmail(contact,email){
    try {
        const res = await pool.query(
            "SELECT * FROM contacts WHERE email = $1 OR phoneNumber = $2 order by createdat",
            [email, contact]
        );
        
        return res.rows;

    } catch (err) {
        console.error('Error executing query', err.stack);
    }
    
}

async function insertContact(contact,email,linkedid,linkprecedence){
    try {
        const res = await pool.query(
            "INSERT INTO contacts(phonenumber,email,linkedid,linkprecedence,createdAt, updatedAt) VALUES($1,$2,$3,$4,NOW(),NOW()) RETURNING *",
            [contact, email, linkedid, linkprecedence]
        );
        
        return res.rows[0];

    } catch (err) {
        console.error('Error executing query', err.stack);
    }
}

async function updateContact(id,linkedid){
    try {
        const res = await pool.query(
            "UPDATE contacts SET linkedid = $1, linkprecedence = $2, updatedat = NOW() where id = $3 RETURNING *",
            [linkedid,'secondary',id]
        );
        
        return res.rows[0];

    } catch (err) {
        console.error('Error executing query', err.stack);
    }
}

async function getContactById(linkedid){
    try {
        const res = await pool.query(
            "SELECT * from contacts where id = $1",
            [linkedid]
        );
        
        return res.rows[0];

    } catch (err) {
        console.error('Error executing query', err.stack);
    }
}

async function getSecondaryContacts(id){
    try {
        const res = await pool.query(
            "SELECT * from contacts where linkedid = $1 order by createdat",
            [id]
        );
        
        return res.rows;

    } catch (err) {
        console.error('Error executing query', err.stack);
    }
}

module.exports={
    getContactAndEmail,
    insertContact,
    updateContact,
    getContactById,
    getSecondaryContacts
}