// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;

    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountETH,
            uint256 liquidity
        );
}

interface IUniswapV2Factory {
    function createPair(address tokenA, address tokenB)
        external
        returns (address pair);
}

contract TGERC20 is ERC20VotesUpgradeable, ERC20PausableUpgradeable, OwnableUpgradeable {

    using SafeMath for uint;

    uint liquidity_tax;
    uint marketing_tax;
    address marketing_wallet;
    IUniswapV2Router02 uniswapV2Router;
    address uniswapV2Pair;

    mapping(address => bool) is_tax_excluded;

    function init(string memory name_, string memory symbol_, IUniswapV2Router02 uniswapV2Router_) external initializer {
        __ERC20_init(name_, symbol_);
        __Ownable_init();
        is_tax_excluded[msg.sender] = true;
        is_tax_excluded[address(this)] = true;
        uniswapV2Router = uniswapV2Router_;
        uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory()).createPair(
            address(this),
            uniswapV2Router.WETH()
        );
        _approve(address(this), address(uniswapV2Router), type(uint).max);
        marketing_wallet = msg.sender;
        liquidity_tax = 1;
        marketing_tax = 1;
        _mint(msg.sender, 1e9 * 1e18);
    }

    function set_marketing_wallet(address marketing_wallet_) external onlyOwner {
        marketing_wallet = marketing_wallet_;
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(from != address(0), 'ERC20: transfer from the zero address');
        require(to != address(0), 'ERC20: transfer to the zero address');
        require(amount > 0, 'Transfer amount must be greater than zero');

        bool takeFee = false;
        // buy
        if (from == uniswapV2Pair && to != address(uniswapV2Router) && !is_tax_excluded[to]) {
        }

        // take fee only on swaps
        if ( (from == uniswapV2Pair || to == uniswapV2Pair) && !(is_tax_excluded[from] || is_tax_excluded[to]) ) {
        takeFee = true;
        }

        _tokenTransfer(from, to, amount, takeFee);
    }

    function _tokenTransfer(
        address sender,
        address recipient,
        uint256 amount,
        bool takeFee
    ) internal {
        uint liquidity_tax_amount = amount.mul(liquidity_tax).div(100);
        uint marketing_tax_amount = amount.mul(marketing_tax).div(100);
        if (!takeFee || is_tax_excluded[sender] || is_tax_excluded[recipient]) {
        liquidity_tax_amount = 0;
        marketing_tax_amount = 0;
        }
        super._transfer(sender, recipient, amount - liquidity_tax_amount - marketing_tax_amount);
        if(marketing_tax_amount > 0) {
            super._transfer(sender, recipient, marketing_tax_amount);
        }
        if(liquidity_tax_amount > 0) {
            super._transfer(sender, address(this), liquidity_tax_amount);
            addLiquidity();
        }
    
    }

    function addLiquidity() internal {
        // approve token transfer to cover all possible scenarios
        swapTokensForEth(balanceOf(address(this)).div(2));
        // add the liquidity
        uniswapV2Router.addLiquidityETH{ value: address(this).balance }(
        address(this),
        balanceOf(address(this)),
        0, // slippage is unavoidable
        0, // slippage is unavoidable
        owner(),
        block.timestamp
        );
    }

    function swapTokensForEth(uint256 tokenAmount) internal {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();

        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this), // The contract
            block.timestamp
        );
    }

    //to recieve ETH from uniswapV2Router when swaping
    receive() external payable {}

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Upgradeable, ERC20PausableUpgradeable) {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address account, uint256 amount) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._mint(account, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._burn(account, amount);
    }
}