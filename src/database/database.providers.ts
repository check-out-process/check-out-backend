import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mssql',
        host: '193.106.55.23',
        port: 1433,
        username: 'cs118',
        password: 'Honor@Cs21',
        database: 'CheckOut',
        entities: [
          __dirname + '/../**/*.entities.js',
        ],
        options: {encrypt: false},
      });

      return dataSource.initialize();
    },
  },
];