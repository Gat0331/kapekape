const mysql = require('mysql2/promise');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' }),
    };
  }

  const data = JSON.parse(event.body || '{}');
  if (!data.items || !data.total) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'No data received.' }),
    };
  }

  // Update with your remote MySQL credentials
  const connection = await mysql.createConnection({
    host: 'your-mysql-host',
    user: 'your-mysql-user',
    password: 'your-mysql-password',
    database: 'metung',
  });

  try {
    const [result] = await connection.execute(
      'INSERT INTO orders (items, total) VALUES (?, ?)',
      [JSON.stringify(data.items), data.total]
    );
    await connection.end();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, orderId: result.insertId }),
    };
  } catch (err) {
    await connection.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};