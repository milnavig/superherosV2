const app = require('./index').app;
//const sequelize = require('./db');
const request = require('supertest');
const fs = require('fs');
const data = require('./test_data/superheros').data;

const fillDb = () => {
  for (let record of data) {
    request(app).post('/api/superhero/')
      .field('nickname', record.nickname)
      .field('real_name', record.real_name)
      .field('origin_description', record.origin_description)
      .field('superpowers', JSON.stringify(record.superpowers))
      .field('catch_phrase', record.catch_phrase)
      .field('image1', fs.createReadStream(`./test_data/images/${record.images[0]}`))
      .field('image2', fs.createReadStream(`./test_data/images/${record.images[1]}`))
      .end(function (err, resp) {
        console.log('Record was added in DB');
      });
  }
}

fillDb();

// request(app).get('/api/superhero/')
//   .set('Accept', 'application/json')
//   .end(function (err, resp) {
//     console.log(resp);
//   });