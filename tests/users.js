const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
chai.use(sinonChai);

var mongoose = require('mongoose');

var users = rewire('../src/users');

var User = require('../src/models/users');
var mailer = require('../src/mailer');
var sendBox = sinon.createSandbox();
describe('User test', ()=> {
    let findStub;
    let deleteStub;
    let samplArgs;
    let sampleUser; 
    let mailerStub;
    beforeEach(()=>{
        sampleUser = {
            id: 123,
            name: 'foo',
            email: 'ex@gmail.com'
        }
        findStub = sendBox.stub(mongoose.Model, 'findById').resolves(sampleUser);
        deleteStub = sendBox.stub(mongoose.Model, 'remove').resolves('fake_remove_result');
        mailerStub = sendBox.stub(mailer, 'sendWelcomeEmail').resolves('fake_email');
    });

    afterEach(()=>{
        sendBox.restore()
        users = rewire('../src/users');
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
        });

        it('should cetch errror if there is one ', (done) => {
            sendBox.restore();
            let stub = sendBox.stub(mongoose.Model, 'findById').yields(new Error('fake'));

            users.get(123, (error, response) => {
                expect(response).to.not.exist;
                expect(error).to.exist;
                expect(error).to.be.instanceOf(Error);
                expect(stub).to.have.been.calledWith(123);
                expect(error.message).to.equal('fake');

                done();
            })
        })
    })

    context('delete user', ()=>{
        it('should check for an id usin retur', () => {
            return users.delete().then((result)=> {
                throw new Error('unexpected success');
            }).catch((ex) => {
                expect(ex).to.be.instanceOf(Error);
                expect(ex.message).to.equal('invalid id')
            })
        });

        it('should check for error eventually', () => {
            return expect(users.delete()).to.eventually.be.rejectedWith('invalid id')
        });

        it('shold call User.delete', async () => {
            let result = await users.delete(123);
            expect(result).to.equal('fake_remove_result');
            expect(deleteStub).to.have.been.calledWith({_id: 123});
        })
    });


    context('create user', ()=>{
        let FakeUserClass, saveStub, results;

        beforeEach(async ()=>{
            saveStub = sendBox.stub().resolves(sampleUser);
            FakeUserClass = sendBox.stub().returns({save: saveStub});

            users.__set__('User', FakeUserClass);

            results = await users.create(sampleUser);
        })
        it('should reject invalid args', async ()=>{
            await expect(users.create()).to.eventually.be.rejectedWith('Invalid arguments');
            await expect(users.create({name: 'foo'})).to.eventually.be.rejectedWith('Invalid arguments');
            await expect(users.create({email: 'ex@gmail.com'})).to.eventually.be.rejectedWith('Invalid arguments');
        })

        it('shold call User with new', () => {
            expect(FakeUserClass).to.have.been.calledWithNew;
            expect(FakeUserClass).to.have.been.calledWith(sampleUser);
        });

        it('Sholud save user', ()=>{
            expect(saveStub).to.have.been.called;
        });

        it('Should call mailer', () => {
            expect(mailerStub).to.have.been.calledWith(sampleUser.email, sampleUser.name);
        })

        it('Should reject with error', async ()=>{
            saveStub.rejects(new Error('fake'));
            await expect(users.create(sampleUser)).to.eventually.be.rejectedWith('fake')
        })

    })
})