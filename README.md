
<!-- ABOUT THE PROJECT -->
## About The Project

This is an dApp that it's made to interract with Metamask via Web3. In this app one can create his own artworks, edit and delete them. One can also buy an artwork from another user as long as he is willing to pay for the price of it (in Ether). All the photos of the artworks created on the dApp are stored on an IPFS server usign Infura node network.



### Built With

This section lists all the major frameworks/libraries used to create the project.

* [Solidity](https://solidity-es.readthedocs.io/es/latest/)
* [Web3.js](https://web3js.readthedocs.io/en/v1.5.2/)
* [Truffle](https://trufflesuite.com/truffle/)
* [Ganache](https://trufflesuite.com/ganache/)
* [React.js](https://reactjs.org/)
* [Bootstrap](https://getbootstrap.com)
* [Babel.js](https://babeljs.io)


<!-- GETTING STARTED -->
## Getting Started


### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```
* Install Ganache
  
### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Valentin23/Artwork-dApp.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Install Truffle
   ```sh
   npm install truffle@4.1.15 -g
   ``` 
4. Compile contracts (Create /build)
   ```sh
   truffle compile
   ```
5.1. Deploy contract (localhost)
   ```sh
   truffle deploy --network development
   ```
5.2. Deploy contract (Ropsten TestNet)
   ```sh
   truffle deploy --network ropsten
   ```
6. Start project
   ```sh
   npm start
   ```
   
### Additional Info

1. In order to make the project work we need to have Ganache running.
2. We should add adresses from our Ganache server to Metamask in order to interact with the dApp. (localhost)
3. To test the dApp on the testnet of Ethereum(Ropsten in our case) we need to set out Metamask network to the Ropsten. We also need test Ethereum in out account in order to be able to interact with the contract. Get test Ether for Rospsten network [here](https://faucet.ropsten.be).
