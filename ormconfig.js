module.exports = {
  // name: 'postgresDefault',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'platzi-store',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/repository/migrations/*{.ts,.js}'],
  seeds: ['src/db/seeds/*{.ts,.js}'],
  factories: ['src/db/factories/*{.ts,.js}'],
  // migrationsDir: 'src/repository/migrations',
  synchronize: false,
};
// , 'src/repository/entities/*.entity.ts'
