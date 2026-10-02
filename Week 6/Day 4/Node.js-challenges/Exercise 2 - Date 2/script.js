const { createInterface } = require('node:readline/promises');
const { stdin, stdout } = require('node:process');
const minutesLived = require('./date');

async function main() {
  let birthdate = '2000-01-01';

  if (process.argv.includes('--prompt')) {
    const readline = createInterface({ input: stdin, output: stdout });
    birthdate = await readline.question('Enter your birthdate (YYYY-MM-DD): ');
    readline.close();
  }

  console.log(`You have lived ${minutesLived(birthdate).toLocaleString()} minutes.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});