const pg = require("pg");
const { Client } = pg;
const uuid = require("uuid/v4");
const client = new pg.Client("postgres://localhost/words");
const faker = require("faker");
client.connect();
const sync = async () => {
  const SQL = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      DROP TABLE IF EXISTS nouns;
      DROP TABLE IF EXISTS verbs;
      DROP TABLE IF EXISTS adjectives;
      CREATE TABLE nouns
      (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        word VARCHAR NOT NULL unique,
        CHECK (char_length(word) > 0)
      );
      CREATE TABLE verbs
      (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        word VARCHAR NOT NULL unique,
        CHECK (char_length(word) > 0)
      );
      CREATE TABLE adjectives
      (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        word VARCHAR NOT NULL unique,
        CHECK (char_length(word) > 0)
      );
      INSERT INTO nouns (word) VALUES
      (
        'dog'
      )
  `;
  await client.query(SQL);
};

//////////////create
const createNoun = async () => {
  const SQL = `INSERT INTO nouns (word) VALUES ($1) returning *;`;
  const word = faker.random.word();
  const response = await client.query(SQL, [word]);
  return response.rows[0];
};

/////////////////read
const readNouns = async () => {
  const SQL = `SELECT * FROM nouns;`;
  const response = await client.query(SQL);
  return response.rows;
};

////////////delete
const deleteNoun = async id => {
  const SQL = `DELETE FROM nouns WHERE (id) = ($1);`;
  await client.query(SQL, [id]);
};

module.exports = {
  sync
  // createNoun,
  // createVerb,
  // createAdjective,
  // readNouns,
  // readVerbs,
  // readAdjectives,
  // updateNoun,
  // updateVerb,
  // updateAdjective,
  // deleteNoun,
  // deleteVerb,
  // deleteAdjective
};
