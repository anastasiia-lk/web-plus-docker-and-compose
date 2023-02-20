// export default () => ({
//   saltRound: 10,
//   secretKey: process.env.SECRET_KEY || 'secret',
// });

import * as path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,

  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'student',
    password: 'student',
    database: 'kupipodariday',
    entities: [path.resolve(`${__dirname}/../../**/*.entity{.ts,.js}`)],
    synchronize: true,
  } as PostgresConnectionOptions,

  saltRound: parseInt(process.env.SALT, 10) || 10,
  secretKey: process.env.JWT_SECRET || 'secret-key',
});
