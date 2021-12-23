# Artwork - An Ethereum learning DAPP (Verisart Blockchain challenge)

<!-- ABOUT THE PROJECT -->
## About The Project

This is an dApp that it's made to interract with Metamask via Web3. In this app one can create his own artworks, edit them and delete them if one wishes to. One can also buy an artwork from another user as long as he is willing to pay for the price of it (in Ether). All the photos of the artworks created on the dApp are stored on an IPFS server usign Infura node network.



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

Instructions on setting up the project locally.

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
3. Compile contracts (Create /build)
   ```sh
   truffle compile
   ```
4.1. Deploy contract (localhost)
   ```sh
   truffle deploy --network development
   ```
4.2. Deploy contract (Ropsten TestNet)
   ```sh
   truffle deploy --network ropsten
   ```
4. Start project
   ```sh
   npm start
   ```
