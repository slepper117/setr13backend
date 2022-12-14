const dbconfig = {
  client: 'pg',
  connection: process.env.CONNECTION_STRING,
  searchPath: ['setr'],
};

export default dbconfig;
