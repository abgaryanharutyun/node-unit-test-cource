const chai = require('chai');
const expect = chai.expect;

var demo = require('../src/demo');


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
       
    })
})