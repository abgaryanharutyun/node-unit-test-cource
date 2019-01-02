const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
chai.use(sinonChai);


var users = require('../src/users');

var sendBox = sinon.createSandbox();
const auth = require('../config/auth');
const request = require('supertest');

let app = rewire('../src/app');


describe('app', () => {
    afterEach(() => {
        // app = rewire('../src/app');
        sendBox.restore();
    });

    context('GET /', () => {
        it('should get /', (done) => {
            request(app).get('/')
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('name').to.equal('Foo Fooing Bar');
                    done(err);
                })

        })
    });
    context('POST /user', () => {
        let createStub, errorStub;
        it('Should call user.create', (done) => {
            createStub = sendBox.stub(users, 'create').resolves({ name: 'foo', email: 'aaa@gmail.com' });
            request(app).post('/user')
                .send({ name: 'fake', email: 'aaa@gmail.com' })
                .expect(200)
                .end((err, response) => {
                    expect(createStub).to.have.been.calledOnce;
                    expect(response.body).to.have.property('name').to.equal('foo');
                    done(err);
                })
        });

        it('should call handleErrorr', (done) => {
            createStub = sendBox.stub(users, 'create').rejects(new Error('fake_errror'));
            errorStub = sendBox.stub().callsFake((res, error) => {
                return res.status(400).json({
                    error: 'fake'
                });
            });

            app.__set__('handleError', errorStub);
            request(app).post('/user')
                .send({ name: 'fake', email: 'aaa@gmail.com' })
                .expect(400)
                .end((err, response) => {
                    expect(createStub).to.have.been.calledOnce;
                    expect(errorStub).to.have.been.calledOnce;
                    expect(response.body).to.have.property('error').to.equal('fake');
                    done(err)
                });
        })
    });
    context('DELETE /user/:id', () => {
        let authStub, deleteStub;
        beforeEach(() => {
            fakeAuth = (req, res, next) => {
                return next();
            }
            authStub = sendBox.stub(auth, 'isAuthorized').resolves('sssss');
            // app = rewire('../src/app');
        });

        // it('Should call auth check function and user.delete on success', (done) => {
        //     deleteStub = sendBox.stub(users, 'delete').resolves('fake_delete');
        //     request(app).delete('/user/123')
        //         .expect(200)
        //         .end((err, response)=> {
        //             expect(authStub).to.have.been.calledOnce;
        //             expect(deleteStub).to.have.been.calledWithMatch(123);
        //             expect(response.body).to.equal('fake_delete');
        //             done(err);
        //         })
        // })
    });
    context('handleError', () => {
        let handleError;
        let res;
        let statusStub;
        let jsonStub;
        let instanceofSpy;

        beforeEach(() => {
            jsonStub = sendBox.stub().returns('done');
            statusStub = sendBox.stub().returns({
                json: jsonStub
            });
            res = {
                status: statusStub
            };

            handleError = app.__get__('handleError');
        });

        // it('should return object without changing it if not instance of an error', (done) => {
            
        //     let result = handleError(res, {
        //         id: 1,
        //         message: 'fake error'
        //     });

        //     expect(statusStub).to.have.been.calledWith(400);
        //     expect(jsonStub).to.have.been.calledWith({
        //         id: 1,
        //         message: 'fake error'
        //     });

        //     done();
        // });
        it('should check for error instance and format message', (done) => {
            let result = handleError(res, new Error('fake'));

            expect(statusStub).to.have.been.calledWith(400);
            expect(jsonStub).to.have.been.calledWith({
                error: 'fake'
            });

            done();
        });

        
    });
})