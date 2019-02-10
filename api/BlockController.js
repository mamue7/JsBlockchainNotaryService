const SHA256 = require('crypto-js/sha256');
const BlockClass = require('../model/Block.js');
const BlockchainClass = require("../blockchain/Blockchain.js");

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.initialize();
    }

    /**
     * set up blockchain data and api methods
     */
    async initialize() {
        let self = this;
        self.chain = new BlockchainClass.Blockchain();
        await self.chain.initialize();
        self.initializeMockData();
        self.getBlockByIndex();
        self.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/api/block/:index", (req, res) => {
            this.chain.getBlock(req.params.index).then(
                function(value) {
                    res.send(JSON.stringify(value));
                },
                function(err) {
                    res.status(500).send('Error! Invalid block index!')
                }
            )
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        let self = this;
        this.app.post("/api/block", (req, res) => {
            if(!req.body.data || req.body.data == "")
            {
                res.status(500). send('Error! Block contained no data!');
            }
            else 
            {
                self.chain.getBlockHeight().then(
                    function(height) {
                        let blockAux = new BlockClass.Block(req.body.data);
                        blockAux.height = height + 1;
                        blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                        self.chain.addBlock(blockAux).then(
                            res.send('Block successfully created!')
                        );  
                    }
                )          
            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    async initializeMockData() {
        let self = this;
        this.chain.getBlockHeight().then(
            async function(height) {
                // add mock data if blockchain is empty
                if(height === 0) 
                {
                    for (let index = 0; index < 10; index++) {
                        let blockAux = new BlockClass.Block(`Test Data #${index}`);
                        blockAux.height = index;
                        blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                        await self.chain.addBlock(blockAux);
                    }
                }  
            }
        )
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}