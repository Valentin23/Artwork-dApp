const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = 'symbol donor treat bring reveal liberty course vibrant torch nature weird decade';

module.exports = {
    networks: {
        development: {
            host: 'localhost',
            port: 7545,
            network_id: '*',
            gas: 5000000
        },
        ropsten: {
            provider: () => new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/v3/586e43127dee4722a41a4972aedc19b2'),
            network_id: 3
        }
    },
    mocha: {
        enableTimeouts: false,
        before_timeout: 120000 // 2min
    }
}