const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('./db/quiz.db')

const create_quiz = `
    CREATE TABLE IF NOT EXISTS quiz (
    id TEXT PRIMARY KEY,
    author TEXT,
    title TEXT,
    content TEXT)`;

database.run(create_quiz);    

module.exports = {
    database
}