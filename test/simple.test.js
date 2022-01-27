// Requiring module
const assert = require('assert');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

after(() => {
	console.log( "This part executes once after all tests" );
});
	
// Inside describe we can add nested blocks for different tests
// First Test case check where we are getting All of the Video from the Database (Mongo DB)
describe( "Get all videos", () => {
	beforeEach(() => {
	console.log( "executes before every test" );
	});
	
	it('it should GET all the videos', (done) => {
        chai.request(server)
            .get('/api/videos')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
              done();
            });
      });
});

// Second Test case check whether the Signup is Actually working or not with Correct Validation.
describe( "Sign Up User", () => {
	beforeEach(() => {
	console.log( "executes before every test" );
	});
	
	it('it should sign up user', (done) => {
        chai.request(server)
            .post('/api/user/signup')
			.send({email: 'karan123@gmail.com' , name:'karan123', 'password':'123456' })
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
              done();
            });
      });
});



