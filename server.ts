// import dotenv from 'dotenv';
// dotenv.config({ path: './config.env' });

import { app } from './app';
import mongoose from 'mongoose';
//tem que colocar antes de tudo porque se não ele não pega as coisas
process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION 💥');
  console.log(err.name, err.message);
});
let DB: string;

if (process.env.DATABASE && process.env.DATABASE_PASSWORD) {
  DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
} else {
  throw new Error('Set the environment variables');
}

main().catch((err) => console.log(err));
async function main() {
  // if (process.env.DATABASE_LOCAL) {
  //   await mongoose.connect(process.env.DATABASE_LOCAL).then((con) => {
  //     // console.log(con.connections);
  //     console.log('DB connected');
  //   });
  // }
  await mongoose.connect(DB).then((con) => {
    // console.log(con.connections);
    console.log('DB connected');
  });
}

const server = app.listen(process.env.PORT, () => {
  console.log(`Running ${process.env.NODE_ENV} on port ${process.env.PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(err.name, err.message);
  console.log('UNHANDLE REJECTION 💥');
  server.close(() => {
    process.exit(1);
  });
});
