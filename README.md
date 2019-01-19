# JSBlockchain

This Project creates a simple JavaScript based Blockchain and offers a Web API to work with the Blockchain data and blocks.

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

- 'GET /api/block/:index' : get a specific block by index

- 'POST /api/block' : post data to create a new block
  Body Data Format:
    {
      "data":"Some data example"
    }
  
## Built With

Express
Crypto-JS

## Authors

Martin Müller
