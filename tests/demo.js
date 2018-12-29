const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
chai.use(sinonChai);
var demo = rewire('../src/demo');
describe('test demo', ()=> {
    context('add function', ()=> {
        it('shold add two numbers', () => {
            expect(demo.add(1, 2)).to.equal(3);
        })
    });
    context('shold test callback', ()=>{
        it('testing callback function', (done)=>{
            demo.addCalback(1, 2, (err, result)=>{
                expect(err).to.not.exist;
                expect(result).to.equal(3);
                done();
            })
        })
       
    });

    context('shold test promise function', ()=>{
        it('testing promise function', (done)=>{
            demo.addPromise(1, 2).then((result)=> {
                expect(result).to.equal(3);
                done();
            }).catch((err)=> {
                console.log('error promise ----')
                done(err);
            })
        });

        it('testing return promise', ()=>{
            return demo.addPromise(1, 2).then((result)=>{
                expect(result).to.equal(3);
            })
        });

        it('shold tests promise awit/async', async ()=>{
            const result = await demo.addPromise(1, 2);
            expect(result).to.equal(3);
        });

        it('shold test promise with chai as promised', async ()=>{
            await expect(demo.addPromise(1,2)).to.eventually.equal(3);
        })
    });

    context('test doubles', ()=> {
        it('Should spy on logs', () => {
            let spy = sinon.spy(console, 'log');
            demo.foo();

            expect(spy.calledOnce).to.be.true;
            expect(spy).to.have.been.calledOnce;
            spy.restore();
        });

        it('Shold stub console.warn', ()=>{
            let stub = sinon.stub(console, 'warn').callsFake(()=>{
                console.log('message from stub');
            });
            
            demo.foo();
            expect(stub).to.have.been.calledOnce;
            expect(stub).to.have.been.calledWith('console.warn was called');
            stub.restore();
        })
    });

    context('stub private function', ()=>{
        it('should stub createFile', async ()=>{
            let createStub = sinon.stub(demo, 'createFile').resolves('create_stub');
            let callStub = sinon.stub().resolves('calledDb_stub');

            demo.__set__('callDb', callStub);

            let result = await demo.bar('test.txt');

            expect(result).to.equal('calledDb_stub');
            expect(createStub).to.have.been.calledOnce;
            expect(createStub).to.have.been.calledWith('test.txt');
            expect(callStub).to.have.been.calledOnce;
        })
    })
})