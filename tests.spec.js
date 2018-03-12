// const app = require('./server');
const chai = require('chai');
const request = require('supertest');

const uri = 'https://api.punkapi.com/v2';

const expect = chai.expect;

describe('API Tests', function(done) {

  it('should return version number', function(done) {
    request(uri)
      .get('/beers')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('Should verify the error when the URL does not exist', function(done) {
      request(uri
    ).get('/soda')
    .set('Accept', 'application/json')
    .expect(404)
    .end(function(err, res) {
        if (err) return done(err);
        const jsonErr =  JSON.parse(res.error.text);
        expect(jsonErr.message).to.be.equal("No endpoint found that matches '/v2/soda'");
        done();
    });
  });

  it('Should verify the lower limit of the param to get a page', function(done) {
      request(uri
      ).get('/beers?page=0&per_page=10')
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err, res) {
          if (err) return done(err);
          const jsonErr =  JSON.parse(res.error.text);
        expect(jsonErr.message).to.be.equal("Invalid query params");
        expect(jsonErr.data[0].param).to.be.equal('page');
        expect(jsonErr.data[0].msg).to.be.equal("Must be a number greater than 0");
        expect(jsonErr.data[0].value).to.be.equal('0');
        done();
    });
  });

  it('Should verify the lower limit of the param to defined the number of result per page', function(done) {
      request(uri
      ).get('/beers?page=1&per_page=0')
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err, res) {
          if (err) return done(err);
          const jsonErr =  JSON.parse(res.error.text);
        expect(jsonErr.message).to.be.equal("Invalid query params");
        expect(jsonErr.data[0].param).to.be.equal('per_page');
        expect(jsonErr.data[0].msg).to.be.equal("Must be a number greater than 0 and less than 80");
        expect(jsonErr.data[0].value).to.be.equal('0');
        done();
    });
  });

  it('Should verify the upper limit of the param to defined the number of result per page', function(done) {
      request(uri
      ).get('/beers?page=1&per_page=81')
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        const jsonErr =  JSON.parse(res.error.text);
        expect(jsonErr.message).to.be.equal("Invalid query params");
        expect(jsonErr.data[0].param).to.be.equal('per_page');
        expect(jsonErr.data[0].msg).to.be.equal("Must be a number greater than 0 and less than 80");
        expect(jsonErr.data[0].value).to.be.equal('81');
        done();
    });
});

it('Should verify the user can get a correct result using the correct params', function(done) {
    request(uri
    ).get('/beers?page=1&per_page=5')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, res) {
        if (err) return done(err);
        console.log('RES',res.body[0]);
        expect(res.body).to.have.length(5);
        done();
    });
  });

  
});