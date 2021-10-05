import * as fs from 'fs';
import * as path from 'path';
import { program } from 'commander';
import log from 'loglevel';
import {
    convertToCompatibleFormat,
    totalItemCounts,
    removeFromList,
    calculatePerWallet,
    verifyBalance,
    sendSolToWallet,
    countTotalWallet
} from './handler'

import { processAirdrop }  from './giveaway-token';

program.version('0.0.1');


log.setLevel(log.levels.INFO);

programCommand('create_compatible_format').option(
    '-p, --path <path>',
    `Path to file`,
    '--file not provided',
  ).action(async (directory, cmd) => {
    const { path } = cmd.opts();
    convertToCompatibleFormat(path);
});

programCommand('count_total_items').action(async (directory, cmd) => {
    totalItemCounts();
});

programCommand('count_wallets').action(async (directory, cmd) => {
  countTotalWallet();
});

programCommand('remove_from_list').option(
    '-r, --path <path>',
    `Path to file`,
    '--file not provided',
  ).action(async (directory, cmd) => {
    const { path } = cmd.opts();
    removeFromList(path);
});

programCommand('calculate_per_wallet_drop').action(async (directory, cmd) => {
    const { path, keypair,env } = cmd.opts();
    calculatePerWallet(keypair,env);
});

programCommand('verify_balance').action(async (directory, cmd) => {
    const { path, keypair, env } = cmd.opts();
    verifyBalance(keypair,env);
});


programCommand('do_airdrop').option(
    '-p, --price <string>',
    `Price per item`,
    '--price  not provided',
  ).action(async (directory, cmd) => {
    const { path, keypair, price , env} = cmd.opts();
    processAirdrop(keypair,price,env);
});


programCommand('send_sol').option(
  '-p, --price <string>',
  `Price per item`,
  '--price  not provided',
).action(async (directory, cmd) => {
  const { path, keypair, price } = cmd.opts();
  sendSolToWallet(price,keypair);
});


function programCommand(name: string) {
    return program
      .command(name)
      .option(
        '-e, --env <string>',
        'Solana cluster env name',
        'devnet', //mainnet-beta, testnet, devnet
      )
      .option(
        '-k, --keypair <path>',
        `Solana wallet location`,
        '--keypair not provided',
      )
  }

program.parse(process.argv);