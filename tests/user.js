const chai = require('chai');
const expect = chai.expect;


var User = require('../src/models/users');

describe('User model', ()=>{
    it('should return error is requared ares are missing', (done)=> {
        let user = new User();

        user.validate((error)=> {
            expect(error.errors.name).to.exist;
            expect(error.errors.email).to.exist;
            expect(error.errors.age).to.not.exist;

            done();
        })
    });
    it('should have optional age field', (done)=> {
        let user = new User({
            name: 'test_name',
            email: 'test@email.com',
            age: 35,
        });

        expect(user).to.have.property('age').to.equal(35);

        done();
    })
})