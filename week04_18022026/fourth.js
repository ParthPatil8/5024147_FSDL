const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter numbers separated by spaces: ', answer => {
  const evens = answer.split(/\s+/).map(Number).filter(n => n % 2 === 0);
  console.log('Evens:', evens);
  rl.close();
});