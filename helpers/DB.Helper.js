const dbConnection = require('./Config/InitDatabase')

async function query(sql, params) {
  const [results, ] = await dbConnection.execute(sql, params);
  return results;
}

module.exports = {
  query
}