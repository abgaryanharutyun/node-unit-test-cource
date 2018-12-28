const assert = require('assert');

describe('first file test', () => {
    context('first function test', () => {
        before(()=> {
            console.log('======before');
        });

        after(()=> {
            console.log('======after');
        });

        beforeEach(()=> {
            console.log('====beforeEach')
        });

        afterEach(()=> {
            console.log('==== afterEach')
        })


        it('shold do something', () => {
            assert.equal(1,1);
        });

        it('shold do something else', ()=>{

            assert.deepEqual({name: 'joe'}, {name: 'joe'});
        })
    })

})