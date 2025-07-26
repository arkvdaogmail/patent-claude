const { Web3 } = require('web3');


module.exports = (req, res) => {
  // Get the VeChain node URL from environment variables
  const vechainNodeUrl = process.env.VECHAIN_NODE_URL;

  if (!vechainNodeUrl) {
    // If the environment variable is not set, return an error
    res.status(500).send('Server configuration error: VECHAIN_NODE_URL is not set.');
    return;
  }

  try {
    // Create a new Web3 instance with the VeChain node provider
const web3 = new Web3(vechainNodeUrl);

    
    // Send a success response
    res.status(200).send('API is running and configured correctly.');

  } catch (error) {
    // If there's an error initializing Web3, return the error message
    res.status(500).send(`An error occurred: ${error.message}`);
  }
};
