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
        // console.log('RES',res.body[0]);
        expect(res.body).to.have.length(5);
        done();
    });
});

it('Should verify the response has all mandatory expected properties', function(done) {
    request(uri
    ).get('/beers/1')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, res) {
        if (err) return done(err);
        // console.log('RES',res.body[0]);
        const body = res.body[0];
        // console.log(JSON.stringify(res.body[0],null,1));
        expect(res.body).to.have.length(1);
        expect(body).to.have.property('id');
        expect(body.id).to.not.equal(null);
        expect(body).to.have.property('name');
        expect(body.name).to.not.equal(null);
        expect(body).to.have.property('tagline');
        expect(body.tagline).to.not.equal(null);
        expect(body).to.have.property('first_brewed');
        expect(body.first_brewed).to.not.equal(null);
        expect(body).to.have.property('description');
        expect(body.description).to.not.equal(null);
        expect(body).to.have.property('image_url');
        expect(body.image_url).to.not.equal(null);
        expect(body).to.have.property('abv');
        expect(body.abv).to.not.equal(null);
        expect(body).to.have.property('ibu');
        expect(body.ibu).to.not.equal(null);
        expect(body).to.have.property('target_fg');
        expect(body.target_fg).to.not.equal(null);
        expect(body).to.have.property('target_og');
        expect(body.target_og).to.not.equal(null);
        expect(body).to.have.property('ebc');
        expect(body.ebc).to.not.equal(null);
        expect(body).to.have.property('srm');
        expect(body.srm).to.not.equal(null);
        expect(body).to.have.property('ph');
        expect(body.ph).to.not.equal(null);
        expect(body).to.have.property('attenuation_level');
        expect(body.attenuation_level).to.not.equal(null);
        expect(body).to.have.property('volume');
        expect(body).to.have.property('boil_volume');
        expect(body).to.have.property('food_pairing');
        expect(body.food_pairing).to.not.equal(null);
        expect(body).to.have.property('brewers_tips');
        expect(body.brewers_tips).to.not.equal(null);
        expect(body).to.have.property('contributed_by');
        expect(body.contributed_by).to.not.equal(null);
        done();
    });
});

it('Should verify the result is the result user expects', function(done) {
    request(uri
    ).get('/beers/1')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, res) {
        if (err) return done(err);
        // console.log('RES',res.body[0]);
        const body = res.body[0];
        // console.log(JSON.stringify(res.body[0],null,1));
        expect(res.body).to.have.length(1);
        expect(body.id).to.equal(1);
        expect(body.name).to.equal('Buzz');
        expect(body.tagline).to.equal('A Real Bitter Experience.');
        expect(body.first_brewed).to.equal('09/2007');
        expect(body.description).to.equal('A light, crisp and bitter IPA brewed with English and American hops. A small batch brewed only once.');
        expect(body.image_url).to.equal('https://images.punkapi.com/v2/keg.png');
        expect(body.abv).to.equal(4.5);
        expect(body.ibu).to.equal(60);
        expect(body.target_fg).to.equal(1010);
        expect(body.target_og).to.equal(1044);
        expect(body.ebc).to.equal(20);
        expect(body.srm).to.equal(10);
        expect(body.ph).to.equal(4.4);
        expect(body.attenuation_level).to.equal(75);
        expect(body.volume).to.deep.equal({"value":20,"unit":"liters"});
        expect(body.boil_volume).to.deep.equal({"value":25,"unit":"liters"});
        expect(body.method).to.deep.equal({"mash_temp":[{"temp":{"value":64,"unit":"celsius"},"duration":75}],"fermentation":{"temp":{"value":19,"unit":"celsius"}},"twist":null});
        expect(body.ingredients).to.deep.equal({"malt":[{"name":"Maris Otter Extra Pale","amount":{"value":3.3,"unit":"kilograms"}},{"name":"Caramalt","amount":{"value":0.2,"unit":"kilograms"}},{"name":"Munich","amount":{"value":0.4,"unit":"kilograms"}}],"hops":[{"name":"Fuggles","amount":{"value":25,"unit":"grams"},"add":"start","attribute":"bitter"},{"name":"First Gold","amount":{"value":25,"unit":"grams"},"add":"start","attribute":"bitter"},{"name":"Fuggles","amount":{"value":37.5,"unit":"grams"},"add":"middle","attribute":"flavour"},{"name":"First Gold","amount":{"value":37.5,"unit":"grams"},"add":"middle","attribute":"flavour"},{"name":"Cascade","amount":{"value":37.5,"unit":"grams"},"add":"end","attribute":"flavour"}],"yeast":"Wyeast 1056 - American Ale™"});
        expect(body.food_pairing).to.deep.equal(["Spicy chicken tikka masala","Grilled chicken quesadilla","Caramel toffee cake"]);
        expect(body.brewers_tips).to.equal('The earthy and floral aromas from the hops can be overpowering. Drop a little Cascade in at the end of the boil to lift the profile with a bit of citrus.');
        expect(body.contributed_by).to.equal('Sam Mason <samjbmason>');
        done();
    });
  });


});