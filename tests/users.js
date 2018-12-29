const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
chai.use(sinonChai);

var mongoose = require('mongoose');

var users = require('../src/users');

var User = require('../src/models/users');
var sendBox = sinon.createSandbox();
describe('User test', ()=> {
    let findStub;
    let samplArgs;
    let sampleUser; 
    beforeEach(()=>{
        sampleUser = {
            id: 123,
            name: 'foo'
        }
        findStub = sendBox.stub(mongoose.Model, 'findById').resolves(sampleUser);
    });

    afterEach(()=>{
        sendBox.restore()
    });

    context('get', ()=> {
        it('check for id', (done) => {
            users.get(null, (err, response) => {
                expect(err).to.exist;
                expect(err.message).to.equal('Invalid user id')
                done();
            })
        });

        it('shold call findById', (done) => {
            sendBox.restore();
            let stub = sendBox.stub(mongoose.Model, 'findById').yields(null, {name: 'foo'});
            users.get(123, (error, response)=> {
                expect(error).to.not.exist;
                expect(stub).to.have.been.calledOnce;
                expect(stub).to.have.been.calledWith(123);
                expect(response).to.be.a('object');
                expect(response).to.property('name').to.equal('foo');

                done();
            })
        })
    })
})