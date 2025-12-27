const db = require("../db/db");

async function createRequest(data) {
  const { title, description, status, request_type } = data;

  const query = `
    INSERT INTO maintenance_request 
    (subject, description, status, request_type)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    title,
    description,
    status || "new",
    request_type || "corrective",
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}

async function getAllRequests() {
  const result = await db.query(
    "SELECT * FROM maintenance_request ORDER BY created_at DESC"
  );
  return result.rows;
}

module.exports = {
  createRequest,
  getAllRequests,
};
