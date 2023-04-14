import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mssql',
        host: 'localhost',
        port: 1111,
        username: 'sa',
        password: 'Password1',
        database: 'Checkout',
        entities: [
          __dirname + '/../**/*.entities.js',
        ],
        synchronize: true,
        options: {encrypt: false},
      });

      return dataSource.initialize();
    },
  },
];