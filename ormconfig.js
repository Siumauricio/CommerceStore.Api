module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'platzi-store',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/repository/migrations/*{.ts,.js}'],
  migrationsDir: 'src/repository/migrations',
  synchronize: false,
};
