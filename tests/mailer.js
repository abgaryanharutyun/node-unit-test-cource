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
var mailer = rewire('../src/mailer');
var sendBox = sinon.createSandbox();

describe('Testing email functionality', ()=> {
    let emailStub;
    beforeEach(()=>{
        emailStub = sendBox.stub().resolves('done');
        mailer.__set__('sendEmail', emailStub);
    });

    afterEach(()=>{
        sendBox.restore();
        mailer = rewire('../src/mailer');
    });

    context('sendWelcomeEmail', ()=>{
        it('should check for email and name', async ()=> {
            await expect(mailer.sendWelcomeEmail()).to.eventually.be.rejectedWith('Invalid input');
            await expect(mailer.sendWelcomeEmail('foo@ex.com')).to.eventually.be.rejectedWith('Invalid input');
        });

        it('should call sendEmail with email and message', async()=>{
            await mailer.sendWelcomeEmail('foo@ex.com', 'foo');
            expect(emailStub).to.have.been.calledWith('foo@ex.com', 'Dear foo, welcome to our family!');
        })
    });

    context('sendPasswordResetEmail', ()=>{
        it('should check for email', async ()=> {
            await expect(mailer.sendPasswordResetEmail()).to.eventually.be.rejectedWith('Invalid input');
        });

        it('should call sendEmail with email', async()=>{
            await mailer.sendPasswordResetEmail('foo@ex.com');
            expect(emailStub).to.have.been.calledWith('foo@ex.com', 'Please click http://some_link to reset your password.');
        })
    });

    context('sendEmail', ()=> {
        let sendEmail;
        beforeEach(()=>{
            mailer = rewire('../src/mailer');
            sendEmail = mailer.__get__('sendEmail');
        })

        it('should check email and body', async ()=>{
            await expect(sendEmail()).to.eventually.be.rejectedWith('Invalid input');
            await expect(sendEmail('foo@gmail.com')).to.eventually.be.rejectedWith('Invalid input');
        });

        it('should call sendEmail with email and message', async ()=> {
            let result = await sendEmail('foo@gmail.com', 'welcome');
            expect(result).to.equal('Email sent');
        })
    })
})