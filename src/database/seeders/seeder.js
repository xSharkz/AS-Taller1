const mongoose = require('mongoose');
const dotenv = require('dotenv');
const insertFakeUsers = require('./usersSeeder');
const insertFakeAuthLogs = require('./authSeeder');
const prisma = require('../prisma');

const { connect, connection, disconnect } = mongoose;
dotenv.config({ path: './.env' });

process.on('uncaughtException', (err) => {
    console.error('Error no controlado:', err.message);
    console.log(err.name,err.message);
    process.exit(1);
});

const MONGO_DB = process.env.MONGO_DATABASE.replace('<PASSWORD>', process.env.MONGO_PASSWORD).replace('<USER>', process.env.MONGO_USER);

async function mainSeedingFunction() {
    try {
        await connect(MONGO_DB);

        if (process.argv.includes('--fresh') || process.argv[1] !== __filename) {
            await connection.dropDatabase(); 
            await prisma.authLog.deleteMany(); 
        }

        await insertFakeUsers(10);
        await insertFakeAuthLogs(10);

        await disconnect();
   
    } catch (error) {
        console.error('Error:', error.message);
    }
    finally {
        await disconnect();
        await prisma.$disconnect();
    }
}

mainSeedingFunction().catch(console.error);