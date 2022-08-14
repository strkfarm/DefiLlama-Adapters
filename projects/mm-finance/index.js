const { calculateUniTvl } = require('../helper/calculateUniTvl')
const { staking } = require('../helper/staking')
const { getUniTVL } = require('../helper/unknownTokens')

const factoryPoly = '0x7cFB780010e9C861e03bCbC7AC12E013137D47A5'
const mmfTokenPoly = '0x22a31bD4cB694433B6de19e0aCC2899E553e9481'
const masterChefPoly = '0xa2B417088D63400d211A4D5EB3C4C5363f834764'

async function polyTvl(timestamp, block, chainBlocks) {
  const balances = await calculateUniTvl(
    (address) => `polygon:${address}`,
    chainBlocks.polygon,
    "polygon",
    factoryPoly,
    0,
    true
  );
  return balances
}

const factory = '0xd590cC180601AEcD6eeADD9B7f2B7611519544f4'
const mmfToken = '0x97749c9B61F878a880DfE312d2594AE07AEd7656'
const masterChef = '0x6bE34986Fdd1A91e4634eb6b9F8017439b7b5EDc'

module.exports = {
  timetravel: true,
  misrepresentedTokens: true,
  methodology: 'TVL accounts for the liquidity on all AMM pools, using the TVL chart on https://mm.finance as the source. Staking accounts for the MMF locked in MasterChef (0x6bE34986Fdd1A91e4634eb6b9F8017439b7b5EDc)',
  cronos: {
    staking: staking(masterChef, mmfToken, 'cronos'),
    tvl: getUniTVL({
      chain: 'cronos',
      factory,
      coreAssets: [
        '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', // wcro
      ],
      blacklist:[
        "0xd8d40dcee0c2b486eebd1fedb3f507b011de7ff0", // 10SHARE, token went to 0 and liq collapsed
        "0xa60943a1B19395C999ce6c21527b6B278F3f2046", // HKN
        "0x388c07066aa6cea2be4db58e702333df92c3a074", // hakuna too
      ]
    }),
  },
  polygon: {
    staking: staking(mmfTokenPoly, masterChefPoly, 'polygon'),
    tvl: polyTvl,
  },
}