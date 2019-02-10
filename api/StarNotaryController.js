const MempoolClass = require("../blockchain/Mempool.js");


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
        self.requestValidation();
        self.validate();
    }

    /**
     * POST Endpoint to request a validation, url: "/api/requestValidation"
     */
    requestValidation() {
        let self = this;
        self.app.post("/api/requestValidation", (req, res) => {
            if(!req.body.address || req.body.address == "")
            {
                res.status(500).send('Error! No wallet address has been sent!');
            }
            else 
            {
                self.mempool.addRequestValidation(req.body.address)
                    .then(
                        function(requestObject) {
                            res.send(JSON.stringify(requestObject));    
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
        self.app.post("/api/validate", (req, res) => {
            if(!req.body.address || req.body.address == "" || !req.body.signature || req.body.signature == "")
            {
                res.status(500).send('Error! Wallet address and signature required!');
            }
            else {
                self.mempool.validateRequestByWallet(req.body.address, req.body.signature).then(
                    function(validRequest) {
                        res.send(JSON.stringify(validRequest));  
                    }
                );
            }
        });

    }

}
/*
* Exporting the MempoolController class
* @param {*} app 
*/
module.exports = (app) => { return new StarNotaryController(app);}