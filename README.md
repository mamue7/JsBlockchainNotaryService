# JSBlockchainStarNotaryService

This Project creates a simple JavaScript based Blockchain and offers a Web API to work with the Blockchain data and blocks for the registration of star data.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install dependencies with --save flag to save dependency to our package.json file
```
npm install express --save
npm install crypto-js --save
npm install body-parser --save
npm install bitcoinjs-lib --save
npm install bitcoinjs-message --save
npm install hex2ascii --save
npm install level --save
```

## Testing

To test code:
1: Open a command prompt or shell terminal after install node.js.

2: Start the Web API on Port 8000
```
node app.js
```

3: Use Postman or Browser to work with the API

Available Methods: 

- 'POST /api/requestValidation' : request a new validation

  BODY: send the bitcoin wallet address used for validation

  Example:
  { "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }
  
  RESPONSE: 
  
  200 OK: Validation request data

  Example:
  {
    "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "requestTimeStamp": "1544451269",
    "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544451269:starRegistry",
    "validationWindow": 300
  }

  500: Error

- 'POST /api/message-signature/validate' : validate a request

  BODY: send the bitcoin wallet address and the generated signature. The signature has to be generated in your wallet using the returned message and wallet address.

  Example:
  {
    "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
  }  

  RESPONSE: 
  
  200 OK: Valid Block data

  Example:
  {
      "registerStar": true,
      "status": {
          "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
          "requestTimeStamp": "1544454641",
          "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544454641:starRegistry",
          "validationWindow": 193,
          "messageSignature": true
      }
  }

  500: Error

- 'POST /api/block' : add new star object to blockchain

  BODY: send the star data.

  Example:
  {
      "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
      "star": {
                  "dec": "68° 52' 56.9",
                  "ra": "16h 29m 1.0s",
                  "story": "Found star using https://www.google.com/sky/"
              }
  } 

  RESPONSE: 
  
  200 OK: Created Block

  Example:
  {
      "hash": "8098c1d7f44f4513ba1e7e8ba9965e013520e3652e2db5a7d88e51d7b99c3cc8",
      "height": 1,
      "body": {
          "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
          "star": {
              "ra": "16h 29m 1.0s",
              "dec": "68° 52' 56.9",
              "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
          }
      },
      "time": "1544455399",
      "previousBlockHash": "639f8e4c4519759f489fc7da607054f50b212b7d8171e7717df244da2f7f2394"
  }

  500: Error

- 'GET /api/stars/hash:[HASH]' : get single block data by block hash

- 'GET /api/stars/address:[ADDRESS]' : get all blocks for a wallet address

- 'GET /api/block/height:[HEIGHT]' : get single block by height

  
## Built With

Express
Crypto-JS
BitcoinJS
hex2ascii
LevelDB

## Authors

Martin Müller
