const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

describe('Firebase cloud function tests', function() {
    this.timeout(100000);
    it('Test /getLiveTrainData', async() => {
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
        expect(result.body.data[0]).haveOwnProperty('TrainType');
    }),

    this.timeout(100000);
    it('Test /getStationData', async() => {
        const result = await chai.request('https://us-central1-irishrailtracker.cloudfunctions.net')
        .get('/getStationData')
        expect(result.statusCode).to.equal(200);
        expect(result.body.data).to.be.an('Array');
        expect(result.body.data[0]).haveOwnProperty('StationDesc');
        expect(result.body.data[0]).haveOwnProperty('StationLatitude');
        expect(result.body.data[0]).haveOwnProperty('StationLongitude');
        expect(result.body.data[0]).haveOwnProperty('StationCode');
        expect(result.body.data[0]).haveOwnProperty('StationId');
        expect(result.body.data[0]).haveOwnProperty('StationType');
    }),

    this.timeout(100000);
    it('Test /postLiveTrainData', async() => {
        const result = await chai.request('https://us-central1-irishrailtracker.cloudfunctions.net')
        .get('/postLiveTrainData')
        expect(result.statusCode).to.equal(200);
    }),

    this.timeout(100000);
    it('Test /postStationData', async() => {
        const result = await chai.request('https://us-central1-irishrailtracker.cloudfunctions.net')
        .get('/postStationData')
        expect(result.statusCode).to.equal(200);
    })
})