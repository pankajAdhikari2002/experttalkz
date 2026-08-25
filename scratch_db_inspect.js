const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const sql = "DESCRIBE courses; DESCRIBE categories; SELECT * FROM categories LIMIT 10; SELECT * FROM courses LIMIT 2;";
  const cmd = `export $(cat /home/deploy/experttalkz/backend/.env | grep -E "^DB_" | xargs) && mysql -u$DB_USERNAME -p$DB_PASSWORD $DB_NAME -e "${sql}"`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', (code) => {
      console.log(out);
      conn.end();
      process.exit(code || 0);
    })
    .on('data', (d) => out += d.toString())
    .stderr.on('data', (d) => out += '[STDERR] ' + d.toString());
  });
}).connect({ host: '103.117.51.83', port: 22, username: 'deploy', password: 'Password@2026' });
