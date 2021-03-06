/* eslint-disable  no-console */
const readline = require('readline');
const { Homesung } = require('./src/homesung');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function input(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('IP address is required');
    return;
  }

  const config = {
    ip: args[0],
    appId: '721b6fce-4ee6-48ba-8045-955a539edadb',
    userId: '654321',
  };

  const homesung = new Homesung({ config });

  try {
    await homesung.deviceInfo();
  } catch (error) {
    throw new Error(
      'Unable to connect to the TV. Check if it is turned on and if the IP address is correct.',
    );
  }

  try {
    await homesung.startPairing();
  } catch (error) {
    throw new Error(`Unable to start pairing with the TV: ${error.message}`);
  }

  try {
    const pin = await input('Enter the pin displayed on the TV screen: ');
    const identity = await homesung.confirmPairing({ pin });
    console.log('Pairing succeeded. Use the following info in the config.json');
    console.log(`Identity: ${JSON.stringify(identity)}`);
  } catch (error) {
    throw new Error(`Unable to pair: ${error.message}`);
  }
}

module.exports = function execute() {
  main()
    .then(() => process.exit())
    .catch((err) => {
      console.error(err.message);
      process.exit();
    });
};
