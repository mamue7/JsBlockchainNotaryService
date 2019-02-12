const MempoolClass = require("../blockchain/Mempool.js");
const BlockchainClass = require("../blockchain/Blockchain.js");
const BlockClass = require("../model/Block.js");
const hex2ascii = require('hex2ascii')

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class StarNotaryController {

    /**
     * Constructor to create a new MempoolController, you need to initialize here all your endpoints
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
        self.mempool = new MempoolClass.Mempool();
        self.blockchain = new BlockchainClass.Blockchain();
        await self.blockchain.initialize();
        self.requestValidation();
        self.validate();
        self.addBlock();
        self.getBlockByHash();
        self.getBlockByWalletAddress();
        self.getBlockByHeight();
    }

    /**
     * POST Endpoint to request a validation, url: "/api/requestValidation"
     */
    requestValidation() {
        let self = this;
        self.app.post("/requestValidation", (req, res) => {
            if(!req.body.address || req.body.address == "")
            {
                res.status(500).send('Error! No wallet address has been sent!');
            }
            else 
            {
                self.mempool.addRequestValidation(req.body.address)
                .then(
                    function(requestObject) {
                        res.send(requestObject);    
                    }
                );
            }
        });
    }

    /**
     * POST request to start a validation
     */
    validate() {
        let self = this;
        self.app.post("/message-signature/validate", (req, res) => {
            if(!req.body.address || req.body.address == "" || !req.body.signature || req.body.signature == "")
            {
                res.status(500).send('Error! Wallet address and signature required!');
            }
            else {
                self.mempool.validateRequestByWallet(req.body.address, req.body.signature).then(
                    function(validRequest) {
                        res.send(validRequest);  
                    },
                    function() {
                        res.status(500).send('Error! Request could not be validated!');
                    }
                );
            }
        });
    }

     /**
     * POST request to add a new block
     */
    addBlock() {
        let self = this;
        self.app.post("/block", (req, res) => {

            if(!req.body.address || req.body.address == "" || !req.body.star)
            {
                res.status(500).send('Error! Wallet address and signature required!');
            }
            else {

                self.mempool.verifyAddressRequest(req.body.address).then(
                    function() {
                        let body = {
                            address: req.body.address,
                            star: {
                                  ra: req.body.star.ra,
                                  dec: req.body.star.dec,
                                  mag: '',
                                  cen: '',
                                  story: Buffer.from(req.body.star.story).toString('hex')
                            }
                        }
                        let block = new BlockClass.Block(body)
                        self.blockchain.addBlock(block).then(
                            function(block) {
                                block.body.star['storyDecoded'] = hex2ascii(block.body.star.story);
                                res.send(block);  
                            },
                            function() {
                                res.status(500).send('Error! Block could not be added!');
                            }
                        );
                    },
                    function() {
                        res.status(500).send('Error! There is no valid validation request!');
                    }
                );
            }
        });
    }

    /**
     * POST Endpoint to request star data, url: "/api/star/hash:value"
     */
    getBlockByHash() {
        let self = this;
        this.app.get("/stars/hash:value", (req, res) => {
            self.blockchain.getBlockByHash(req.params.value.substr(1)).then(
                function(block) {
                    block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                    res.send(block);
                },
                function(err) {
                    res.status(500).send('Error! Invalid block hash!')
                }
            )
        });
    }

    /**
     * POST Endpoint to request star data, url: "/api/star/address:value"
     */
    getBlockByWalletAddress() {
        let self = this;
        this.app.get("/stars/address:value", (req, res) => {
            self.blockchain.getBlockByWalletAddress(req.params.value.substr(1)).then(
                function(blocks) {
                    for(let i = 0; i < blocks.length; i++)
                    {
                        blocks[i].body.star.storyDecoded = hex2ascii(blocks[i].body.star.story);
                    }
                    res.send(blocks);
                },
                function(err) {
                    res.status(500).send('Error! No existing blocks for given wallet address!')
                }
            )
        });
    }

    /**
     * POST Endpoint to request star data, url: "/api/star/height:value"
     */
    getBlockByHeight() {
        let self = this;
        this.app.get("/block/height:value", (req, res) => {
            self.blockchain.getBlock(req.params.value.substr(1)).then(
                function(block) {
                    block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                    res.send(block);
                },
                function(err) {
                    res.status(500).send('Error! No existing block for given height!')
                }
            )
        });
    }

}
/*
* Exporting the MempoolController class
* @param {*} app 
*/
module.exports = (app) => { return new StarNotaryController(app);}