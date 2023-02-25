const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Firebase cloud function tests', function() {
    this.timeout(100000);
    it('Test getting live train data', async() => {
        const result = await chai.request('https://us-central1-irishrailtracker.cloudfunctions.net')
        .get('/getLiveTrainData')
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.an('Array');
        expect(result.body.data[0]).haveOwnProperty('TrainStatus');
        expect(result.body.data[0]).haveOwnProperty('PublicMessage');
        expect(result.body.data[0]).haveOwnProperty('TrainLatitude');
        expect(result.body.data[0]).haveOwnProperty('Direction');
        expect(result.body.data[0]).haveOwnProperty('TrainLongitude');
        expect(result.body.data[0]).haveOwnProperty('TrainCode');
        expect(result.body.data[0]).haveOwnProperty('TrainDate');
    }),

    this.timeout(100000);
    it('Test updating the database with live train data', async() => {
        const result = await chai.request('https://us-central1-irishrailtracker.cloudfunctions.net')
        .get('/postLiveTrainData')
        expect(result.statusCode).to.equal(200);
    })
})