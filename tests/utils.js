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
const crypto = require('crypto');
const config = require('../config/env');
const utils = require('../src/utils');

describe('Utils tests', () => {
    let secretStub, digestStub, updateStub, createHushStub, hash;
    beforeEach(()=>{
        secretStub = sendBox.stub(config, 'secret').returns('fake_secret');
        digestStub = sendBox.stub().returns('ABC123');
        updateStub = sendBox.stub().returns({
            digest: digestStub,
        });
        createHushStub = sendBox.stub(crypto, 'createHash').returns({
            update: updateStub
        });

        hash = utils.getHash('foo');
    });

    afterEach(()=> {
        sendBox.restore();
    });

    it('shuld return null if invalid string is pased', () => {
        sendBox.reset();

        let hash2 = utils.getHash(null);
        let hash3 = utils.getHash(123);
        let hash4 = utils.getHash({name: '123'});

        expect(hash2).to.be.null;
        expect(hash3).to.be.null;
        expect(hash4).to.be.null;

        expect(createHushStub).to.not.have.been.called
    });

    it('should get secret from config', ()=>{
        expect(secretStub).to.have.been.called;
    });

    it('should call crypto with correct string and retun hash', ()=> {
        expect(createHushStub).to.have.been.calledWith('md5');
        expect(updateStub).to.have.been.calledWith('foo_fake_secret');
        expect(digestStub).to.have.been.calledWith('hex');
        expect(hash).to.equal('ABC123');
    })
})