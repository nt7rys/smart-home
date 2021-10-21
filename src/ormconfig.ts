import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import * as path from 'path';

const {
  MONGO_HOST,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_NAME,
  TYPEORM_CLI
} = process.env;

const config: TypeOrmModuleOptions = {
  type: 'mongodb',
  host: MONGO_HOST,
  port: 27017,
  username: MONGO_USER,
  password: MONGO_PASSWORD,
  database: MONGO_NAME,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  entities: [TYPEORM_CLI === 'true' ? path.join(__dirname, '..', '**', '*.entity.ts') : path.join(__dirname, '**', '*.entity.js')],
  migrationsRun: false,
  logging: true,
  // logger: 'debug',
  maxQueryExecutionTime: 20000, // 20 sec

  name: 'mongo', // CONNECTION NAME!!!!!
};

// export default won't work
module.exports = config;
