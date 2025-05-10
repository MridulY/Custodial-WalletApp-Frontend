import {
  JsonRpcProvider,
  Wallet,
  Contract,
  parseUnits,
  formatUnits
} from "ethers";

const INFURA_URL =
  "https://sepolia.infura.io/v3/3b5892c7c5654215bf520b0e28e3ed52";
const PRIVATE_KEY =
  "ca2b7c89c92f93e4f733701f2dab75188ac6b46ec65ad14b392665a17da1d64b";

// Addresses (ERC-20 Tokens and Uniswap Router)
const TOKEN_A_ADDRESS = "0x06DDeeD3D2Eb3dEad723c037b89E4384BFb29Bf8"; // Replace with your ERC20 token A address
const TOKEN_B_ADDRESS = "0xe1cdd8F52FcBf06cb4582f4816a2634a842D5bBC"; // Replace with your ERC20 token B address
const ROUTER_ADDRESS = "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3"; // Uniswap V2 Router address
const FACTORY_ADDRESS = "0xF62c03E08ada871A0bEb309762E260a7a6a880E6";
// ABI for Uniswap V2 Router and ERC20 tokens

const UNISWAP_ROUTER_ABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
  "function addLiquidity(address tokenA, address tokenB, uint amountA, uint amountB, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function balanceOf(address account) public view returns (uint256)",
  "function allowance(address owner, address spender) public view returns (uint256)",
];

const UNISWAP_FACTORY_ABI = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)",
];

async function main() {
  const provider = new JsonRpcProvider(INFURA_URL);
  const wallet = new Wallet(PRIVATE_KEY, provider);
  console.log("Wallet address:", wallet.address);

  // Tokens and Router
  const tokenA = new Contract(TOKEN_A_ADDRESS, ERC20_ABI, wallet);
  const tokenB = new Contract(TOKEN_B_ADDRESS, ERC20_ABI, wallet);
  const router = new Contract(ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, wallet);
  const factory = new Contract(FACTORY_ADDRESS, UNISWAP_FACTORY_ABI, provider);

  // STEP 1: Approve token A to be spent by the Uniswap Router
  const amountIn = parseUnits("1", 18); // Swap 1 token

  // STEP 2: Check if the pair exists using the factory
  const pairAddress = await factory.getPair(TOKEN_A_ADDRESS, TOKEN_B_ADDRESS);
  console.log("Pair Address:", pairAddress);

  // If no pair exists, add liquidity
  if (pairAddress === "0x0000000000000000000000000000000000000000") {
    console.log(
      "No liquidity pool exists for this token pair. Adding liquidity..."
    );

    // Approve tokens for adding liquidity
    const amountA = parseUnits("100", 18); // 10 of Token A
    const amountB = parseUnits("100", 18); // 20 of Token B

    console.log("Approving token A...");
    let tx = await tokenA.approve(ROUTER_ADDRESS, amountA);
    await tx.wait();
    console.log("Token A approved for swap.");

    console.log("Approving token B...");
    let txB = await tokenB.approve(ROUTER_ADDRESS, amountB); // Adjust amountIn as needed for Token B
    await txB.wait();
    console.log("Token B approved for liquidity.");

    // Check token allowances and balances
    const allowanceA = await tokenA.allowance(wallet.address, ROUTER_ADDRESS);
    const allowanceB = await tokenB.allowance(wallet.address, ROUTER_ADDRESS);
    const balanceA = await tokenA.balanceOf(wallet.address);
    const balanceB = await tokenB.balanceOf(wallet.address);

    console.log("Token A Allowance:", allowanceA.toString());
    console.log("Token B Allowance:", allowanceB.toString());
    console.log("Token A Balance:", formatUnits(balanceA, 18));
    console.log("Token B Balance:", formatUnits(balanceB, 18));

    // Ensure the allowance and balance are sufficient (compare using BigInt)
    // if (
    //   BigInt(allowanceA.toString()) < BigInt(amountA.toString()) ||
    //   BigInt(allowanceB.toString()) < BigInt(amountB.toString())
    // ) {
    //   throw new Error("Token allowance is insufficient.");
    // }

    // if (
    //   BigInt(balanceA.toString()) < BigInt(amountA.toString()) ||
    //   BigInt(balanceB.toString()) < BigInt(amountB.toString())
    // ) {
    //   throw new Error("Token balance is insufficient.");
    // }

    // Add liquidity to Uniswap
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
    tx = await router.addLiquidity(
      TOKEN_A_ADDRESS,
      TOKEN_B_ADDRESS,
      amountA,
      amountB,
      amountA, // Slippage 0% for Token A
      amountB, // Slippage 0% for Token B
      wallet.address,
      deadline
    );

    const receipt = await tx.wait();
    console.log("Liquidity added! Tx:", receipt.transactionHash);
  } else {
    console.log("Pair already exists. Proceeding with the swap.");
  }

  // STEP 3: Get the estimated output amount for the swap
  const amountsOut = await router.getAmountsOut(amountIn, [
    TOKEN_A_ADDRESS,
    TOKEN_B_ADDRESS,
  ]);
  console.log("Estimated Amount Out:", formatUnits(amountsOut[1], 18));

  // Apply slippage tolerance
  const slippage = 1; // 1% slippage tolerance
  const amountOutMin =
    (BigInt(amountsOut[1].toString()) * BigInt(100 - slippage)) / BigInt(100); // Minimum output amount after slippage

  // STEP 4: Perform the token swap
  const swapDeadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
  const path = [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS];
  const to = wallet.address; // Swap tokens to the wallet address

  console.log("Swapping tokens...");
  tx = await router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    to,
    swapDeadline
  );

  const swapReceipt = await tx.wait();
  console.log("Swap transaction completed! Tx:", swapReceipt.transactionHash);
}

main().catch((err) => {
  console.error("Error:", err);
});