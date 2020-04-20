// export const API_endpoint = "http://localhost:9003"
export const API_endpoint = "https://api-bancor.cotrader.com"
export const StableSymbol = "USDB(USDB)"

// MAINNET
export const CoTraderPoolPortal = "0x3f49fEddB3c63E36552679BC972857312dC8b4b7"
export const BancorRegistryMAIN = "0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4"
export const ETHBNT = "0xb1cd6e4153b2a390cf00a6556b0fc1458c4a5533"
export const BNTToken = "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
export const USDBToken = "0x309627af60f0926daa6041b8279484312f2bf060"
export const USDBBNTToken = "0xd1146B08e8104EeDBa44a73B7bda1d102c6ceDC9"
export const BancorETH = "0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315"
export const EtherscanLink = "https://etherscan.io/"
export const gasPrice = 2000000000 // 2 gwei low gas price by default
export const netId = 1

// ROPSTEN
// export const CoTraderPoolPortal = "0x427564A5Cc6E7402F97759C7B5d6A91974a82621"
// export const BancorRegistryMAIN = "0xFD95E724962fCfC269010A0c6700Aa09D5de3074"
// export const ETHBNT = "0xDD78D22F53441b6B6216cE69E6dCAe6F7c9252b6"
// export const BNTToken = "0x62bd9D98d4E188e281D7B78e29334969bbE1053c"
// export const USDBToken = ""
// export const USDBBNTToken = ""
// export const BancorETH = "0xD368b98d03855835E2923Dc000b3f9c2EBF1b27b"
// export const EtherscanLink = "https://ropsten.etherscan.io/"
// export const gasPrice = 2000000000 // 2 gwei low gas price by default
// export const netId = 3


export const ABIBancorRegistryMAIN = [
	{"constant":true,"inputs":[{"name":"_contractName","type":"bytes32"}],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_contractName","type":"bytes32"}],"name":"unregisterAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"contractNames","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_contractName","type":"bytes32"},{"name":"_contractAddress","type":"address"}],"name":"registerAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"itemCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_contractName","type":"bytes32"}],"name":"addressOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_contractName","type":"bytes32"},{"indexed":false,"name":"_contractAddress","type":"address"}],"name":"AddressUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_prevOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"OwnerUpdate","type":"event"}]

export const BancorRegistryABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_adminOnly",
				"type": "bool"
			}
		],
		"name": "restrictRegistryUpdate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getSmartTokens",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_smartTokens",
				"type": "address[]"
			}
		],
		"name": "getConvertersBySmartTokens",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_value",
				"type": "address"
			}
		],
		"name": "isConvertibleToken",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_value",
				"type": "address"
			}
		],
		"name": "isSmartToken",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "updateRegistry",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getConvertibleTokens",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "prevRegistry",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getConvertibleTokenCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_converter",
				"type": "address"
			}
		],
		"name": "addConverter",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_convertibleToken",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "address"
			}
		],
		"name": "isConvertibleTokenSmartToken",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "acceptOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getLiquidityPoolCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "registry",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getLiquidityPools",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_reserveTokens",
				"type": "address[]"
			},
			{
				"name": "_reserveRatios",
				"type": "uint256[]"
			}
		],
		"name": "getLiquidityPoolByReserveConfig",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getConvertibleToken",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_converter",
				"type": "address"
			}
		],
		"name": "isConverterValid",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_converter",
				"type": "address"
			}
		],
		"name": "removeConverter",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getSmartToken",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_convertibleToken",
				"type": "address"
			}
		],
		"name": "getConvertibleTokenSmartTokenCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getLiquidityPool",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "restoreRegistry",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "adminOnly",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "newOwner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_convertibleToken",
				"type": "address"
			},
			{
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getConvertibleTokenSmartToken",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getSmartTokenCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_value",
				"type": "address"
			}
		],
		"name": "isLiquidityPool",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_convertibleToken",
				"type": "address"
			}
		],
		"name": "getConvertibleTokenSmartTokens",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_registry",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_smartToken",
				"type": "address"
			}
		],
		"name": "SmartTokenAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_smartToken",
				"type": "address"
			}
		],
		"name": "SmartTokenRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_liquidityPool",
				"type": "address"
			}
		],
		"name": "LiquidityPoolAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_liquidityPool",
				"type": "address"
			}
		],
		"name": "LiquidityPoolRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_convertibleToken",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_smartToken",
				"type": "address"
			}
		],
		"name": "ConvertibleTokenAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_convertibleToken",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_smartToken",
				"type": "address"
			}
		],
		"name": "ConvertibleTokenRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_prevOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "OwnerUpdate",
		"type": "event"
	}
]

export const ABISmartToken = [
	{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_disable","type":"bool"}],"name":"disableTransfers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"withdrawTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"issue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_amount","type":"uint256"}],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"transfersEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_token","type":"address"}],"name":"NewSmartToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Issuance","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Destruction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_prevOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"OwnerUpdate","type":"event"}]

export const ABIConverter = [
	{"constant":false,"inputs":[{"name":"_adminOnly","type":"bool"}],"name":"restrictRegistryUpdate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_connectorToken","type":"address"},{"name":"","type":"uint32"},{"name":"","type":"bool"},{"name":"_virtualBalance","type":"uint256"}],"name":"updateConnector","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"connectors","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint32"},{"name":"","type":"bool"},{"name":"","type":"bool"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bancorX","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_reserveToken","type":"address"}],"name":"getReserveBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"connectorTokens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_fromToken","type":"address"},{"name":"_toToken","type":"address"},{"name":"_amount","type":"uint256"}],"name":"getReturn","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferTokenOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_block","type":"uint256"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"quickConvertPrioritized","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_disable","type":"bool"}],"name":"disableConversions","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_fromToken","type":"address"},{"name":"_toToken","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"}],"name":"convertInternal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_reserveToken","type":"address"}],"name":"getReserveRatio","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_minReturn","type":"uint256"},{"name":"_conversionId","type":"uint256"},{"name":"_signature","type":"uint256[]"}],"name":"completeXConversion2","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"acceptTokenOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_amount","type":"uint256"},{"name":"_magnitude","type":"uint8"}],"name":"getFinalAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"converterType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_weight","type":"uint32"},{"name":"","type":"bool"}],"name":"addConnector","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"liquidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"withdrawFromToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"newManager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"manager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"updateRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_whitelist","type":"address"}],"name":"setConversionWhitelist","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_minReturn","type":"uint256"},{"name":"_conversionId","type":"uint256"},{"name":"_block","type":"uint256"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"completeXConversion","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"conversionFee","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"withdrawTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_fromToken","type":"address"},{"name":"_toToken","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"}],"name":"change","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"prevRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_scaleFactor","type":"uint16"}],"name":"enableVirtualBalances","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_ratio","type":"uint32"}],"name":"addReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_fromToken","type":"address"},{"name":"_toToken","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_affiliateAccount","type":"address"},{"name":"_affiliateFee","type":"uint256"}],"name":"convert2","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"connectorTokenCount","outputs":[{"name":"","type":"uint16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_reserveToken","type":"address"},{"name":"_sellAmount","type":"uint256"}],"name":"getSaleReturn","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fromToken","type":"address"},{"name":"_toToken","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"}],"name":"convert","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"registry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_fromConnectorToken","type":"address"},{"name":"_toConnectorToken","type":"address"},{"name":"_amount","type":"uint256"}],"name":"getCrossConnectorReturn","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"CONVERTER_CONVERSION_WHITELIST","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_reserveToken","type":"address"},{"name":"_virtualBalance","type":"uint256"}],"name":"updateReserveVirtualBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxConversionFee","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"reserveTokenCount","outputs":[{"name":"","type":"uint16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_connectorToken","type":"address"},{"name":"_disable","type":"bool"}],"name":"disableConnectorSale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_reserveToken","type":"address"},{"name":"_depositAmount","type":"uint256"}],"name":"getPurchaseReturn","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_reserveToken","type":"address"},{"name":"_disable","type":"bool"}],"name":"disableReserveSale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_signature","type":"uint256[]"},{"name":"_affiliateAccount","type":"address"},{"name":"_affiliateFee","type":"uint256"}],"name":"quickConvertPrioritized2","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"restoreRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"conversionsEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"conversionWhitelist","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptManagement","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"adminOnly","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"fund","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_fromReserveToken","type":"address"},{"name":"_toReserveToken","type":"address"},{"name":"_amount","type":"uint256"}],"name":"getCrossReserveReturn","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reserveTokens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"upgrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"reserves","outputs":[{"name":"virtualBalance","type":"uint256"},{"name":"ratio","type":"uint32"},{"name":"isVirtualBalanceEnabled","type":"bool"},{"name":"isSaleEnabled","type":"bool"},{"name":"isSet","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_connectorToken","type":"address"}],"name":"getConnectorBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_bancorX","type":"address"}],"name":"setBancorX","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_affiliateAccount","type":"address"},{"name":"_affiliateFee","type":"uint256"}],"name":"quickConvert2","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_newManager","type":"address"}],"name":"transferManagement","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_conversionFee","type":"uint32"}],"name":"setConversionFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"}],"name":"quickConvert","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_amount","type":"uint256"}],"name":"claimTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_token","type":"address"},{"name":"_registry","type":"address"},{"name":"_maxConversionFee","type":"uint32"},{"name":"_reserveToken","type":"address"},{"name":"_reserveRatio","type":"uint32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_fromToken","type":"address"},{"indexed":true,"name":"_toToken","type":"address"},{"indexed":true,"name":"_trader","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"},{"indexed":false,"name":"_return","type":"uint256"},{"indexed":false,"name":"_conversionFee","type":"int256"}],"name":"Conversion","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_connectorToken","type":"address"},{"indexed":false,"name":"_tokenSupply","type":"uint256"},{"indexed":false,"name":"_connectorBalance","type":"uint256"},{"indexed":false,"name":"_connectorWeight","type":"uint32"}],"name":"PriceDataUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_prevFee","type":"uint32"},{"indexed":false,"name":"_newFee","type":"uint32"}],"name":"ConversionFeeUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_conversionsEnabled","type":"bool"}],"name":"ConversionsEnable","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_enabled","type":"bool"}],"name":"VirtualBalancesEnable","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_prevManager","type":"address"},{"indexed":true,"name":"_newManager","type":"address"}],"name":"ManagerUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_prevOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"OwnerUpdate","type":"event"}]

export const ABIBancorNetwork = [
	{"constant":true,"inputs":[],"name":"BANCOR_CONVERTER_UPGRADER","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BNT_TOKEN","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"CONTRACT_REGISTRY","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BANCOR_CONVERTER_FACTORY","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"signerAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxAffiliateFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"withdrawTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"BANCOR_FORMULA","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"registry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"etherTokens","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"CONTRACT_FEATURES","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"conversionHashes","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BANCOR_NETWORK","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BANCOR_GAS_PRICE_LIMIT","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"CONVERTER_CONVERSION_WHITELIST","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BANCOR_X","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BANCOR_X_UPGRADER","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"NON_STANDARD_TOKEN_REGISTRY","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_registry","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_prevOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"OwnerUpdate","type":"event"},{"constant":false,"inputs":[{"name":"_maxAffiliateFee","type":"uint256"}],"name":"setMaxAffiliateFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_registry","type":"address"}],"name":"setRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_signerAddress","type":"address"}],"name":"setSignerAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_register","type":"bool"}],"name":"registerEtherToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_for","type":"address"},{"name":"_affiliateAccount","type":"address"},{"name":"_affiliateFee","type":"uint256"}],"name":"convertFor2","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_for","type":"address"},{"name":"_signature","type":"uint256[]"},{"name":"_affiliateAccount","type":"address"},{"name":"_affiliateFee","type":"uint256"}],"name":"convertForPrioritized4","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_toBlockchain","type":"bytes32"},{"name":"_to","type":"bytes32"},{"name":"_conversionId","type":"uint256"},{"name":"_affiliateAccount","type":"address"},{"name":"_affiliateFee","type":"uint256"}],"name":"xConvert2","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_toBlockchain","type":"bytes32"},{"name":"_to","type":"bytes32"},{"name":"_conversionId","type":"uint256"},{"name":"_signature","type":"uint256[]"},{"name":"_affiliateAccount","type":"address"},{"name":"_affiliateFee","type":"uint256"}],"name":"xConvertPrioritized3","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"}],"name":"getReturnByPath","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_for","type":"address"},{"name":"_affiliateAccount","type":"address"},{"name":"_affiliateFee","type":"uint256"}],"name":"claimAndConvertFor2","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_affiliateAccount","type":"address"},{"name":"_affiliateFee","type":"uint256"}],"name":"convert2","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_affiliateAccount","type":"address"},{"name":"_affiliateFee","type":"uint256"}],"name":"claimAndConvert2","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"}],"name":"convert","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"}],"name":"claimAndConvert","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_for","type":"address"}],"name":"convertFor","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_for","type":"address"}],"name":"claimAndConvertFor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_toBlockchain","type":"bytes32"},{"name":"_to","type":"bytes32"},{"name":"_conversionId","type":"uint256"}],"name":"xConvert","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_toBlockchain","type":"bytes32"},{"name":"_to","type":"bytes32"},{"name":"_conversionId","type":"uint256"},{"name":"_signature","type":"uint256[]"}],"name":"xConvertPrioritized2","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_toBlockchain","type":"bytes32"},{"name":"_to","type":"bytes32"},{"name":"_conversionId","type":"uint256"},{"name":"_block","type":"uint256"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"xConvertPrioritized","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_for","type":"address"},{"name":"_customVal","type":"uint256"},{"name":"_block","type":"uint256"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"convertForPrioritized3","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_for","type":"address"},{"name":"_block","type":"uint256"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"convertForPrioritized2","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_for","type":"address"},{"name":"_block","type":"uint256"},{"name":"_nonce","type":"uint256"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"convertForPrioritized","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"}]

export const ERC20Bytes32ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_spender",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_symbol",
				"type": "bytes32"
			},
			{
				"name": "_decimals",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			},
			{
				"name": "_spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_who",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

export const ABIBancorGasPriceLimit = [
	{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"gasPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_gasPrice","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_prevOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"OwnerUpdate","type":"event"},{"constant":false,"inputs":[{"name":"_gasPrice","type":"uint256"}],"name":"setGasPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_gasPrice","type":"uint256"}],"name":"validateGasPrice","outputs":[],"payable":false,"stateMutability":"view","type":"function"}]

export const CoTraderPoolPortalABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_amount",
				"type": "uint256"
			},
			{
				"name": "_type",
				"type": "uint256"
			},
			{
				"name": "_poolToken",
				"type": "address"
			}
		],
		"name": "buyPool",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_amount",
				"type": "uint256"
			},
			{
				"name": "_type",
				"type": "uint256"
			},
			{
				"name": "_poolToken",
				"type": "address"
			}
		],
		"name": "sellPool",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_bancorRegistryWrapper",
				"type": "address"
			},
			{
				"name": "_bancorRatio",
				"type": "address"
			},
			{
				"name": "_bancorEtherToken",
				"type": "address"
			},
			{
				"name": "_uniswapFactory",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "BancorEtherToken",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "bancorRatio",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "bancorRegistry",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_relay",
				"type": "address"
			}
		],
		"name": "getBacorConverterAddressByRelay",
		"outputs": [
			{
				"name": "converter",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_amount",
				"type": "uint256"
			},
			{
				"name": "_relay",
				"type": "address"
			}
		],
		"name": "getBancorConnectorsAmountByRelayAmount",
		"outputs": [
			{
				"name": "bancorAmount",
				"type": "uint256"
			},
			{
				"name": "connectorAmount",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_relay",
				"type": "address"
			}
		],
		"name": "getBancorConnectorsByRelay",
		"outputs": [
			{
				"name": "BNTConnector",
				"type": "address"
			},
			{
				"name": "ERCConnector",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "getBancorRatio",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_exchange",
				"type": "address"
			}
		],
		"name": "getTokenByUniswapExchange",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_amount",
				"type": "uint256"
			},
			{
				"name": "_exchange",
				"type": "address"
			}
		],
		"name": "getUniswapConnectorsAmountByPoolAmount",
		"outputs": [
			{
				"name": "ethAmount",
				"type": "uint256"
			},
			{
				"name": "ercAmount",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_token",
				"type": "address"
			},
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "getUniswapTokenAmountByETH",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "uniswapFactory",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]


export const BYTECODESmartToken = "60c0604052600360808190527f302e33000000000000000000000000000000000000000000000000000000000060a09081526200004091600891906200015a565b506009805460ff191660011790553480156200005b57600080fd5b5060405162000f1a38038062000f1a833981016040908152815160208301519183015160008054600160a060020a03191633178155918401805190949390930192909184918491849181108015620000b4575060008351115b1515620000c057600080fd5b8351620000d59060029060208701906200015a565b508251620000eb9060039060208601906200015a565b506004805460ff191660ff939093169290921790915560058190553360009081526006602090815260409182902092909255805130815290517ff4cd1f8571e8d9c97ffcb81558807ab73f9803d54de5da6a0420593c82a4a9f09450908190039091019150a1505050620001ff565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200019d57805160ff1916838001178555620001cd565b82800160010185558215620001cd579182015b82811115620001cd578251825591602001919060010190620001b0565b50620001db929150620001df565b5090565b620001fc91905b80821115620001db5760008155600101620001e6565b90565b610d0b806200020f6000396000f3006080604052600436106101065763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde03811461010b578063095ea7b3146101955780631608f18f146101cd57806318160ddd146101e957806323b872dd14610210578063313ce5671461023a57806354fd4d50146102655780635e35359e1461027a57806370a08231146102a457806379ba5097146102c5578063867904b4146102da5780638da5cb5b146102fe57806395d89b411461032f578063a24835d114610344578063a9059cbb14610368578063bef97c871461038c578063d4ee1d90146103a1578063dd62ed3e146103b6578063f2fde38b146103dd575b600080fd5b34801561011757600080fd5b506101206103fe565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561015a578181015183820152602001610142565b50505050905090810190601f1680156101875780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156101a157600080fd5b506101b9600160a060020a0360043516602435610489565b604080519115158252519081900360200190f35b3480156101d957600080fd5b506101e76004351515610542565b005b3480156101f557600080fd5b506101fe61056b565b60408051918252519081900360200190f35b34801561021c57600080fd5b506101b9600160a060020a0360043581169060243516604435610571565b34801561024657600080fd5b5061024f61059f565b6040805160ff9092168252519081900360200190f35b34801561027157600080fd5b506101206105a8565b34801561028657600080fd5b506101e7600160a060020a0360043581169060243516604435610603565b3480156102b057600080fd5b506101fe600160a060020a03600435166106f9565b3480156102d157600080fd5b506101e761070b565b3480156102e657600080fd5b506101e7600160a060020a0360043516602435610793565b34801561030a57600080fd5b5061031361089c565b60408051600160a060020a039092168252519081900360200190f35b34801561033b57600080fd5b506101206108ab565b34801561035057600080fd5b506101e7600160a060020a0360043516602435610906565b34801561037457600080fd5b506101b9600160a060020a03600435166024356109ef565b34801561039857600080fd5b506101b9610a1b565b3480156103ad57600080fd5b50610313610a24565b3480156103c257600080fd5b506101fe600160a060020a0360043581169060243516610a33565b3480156103e957600080fd5b506101e7600160a060020a0360043516610a50565b6002805460408051602060018416156101000260001901909316849004601f810184900484028201840190925281815292918301828280156104815780601f1061045657610100808354040283529160200191610481565b820191906000526020600020905b81548152906001019060200180831161046457829003601f168201915b505050505081565b600082600160a060020a03811615156104a157600080fd5b8215806104cf5750336000908152600760209081526040808320600160a060020a0388168452909152902054155b15156104da57600080fd5b336000818152600760209081526040808320600160a060020a03891680855290835292819020879055805187815290519293927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a35060019392505050565b600054600160a060020a0316331461055957600080fd5b6009805460ff19169115919091179055565b60055481565b60095460009060ff16151561058257fe5b61058d848484610ab1565b151561059557fe5b5060019392505050565b60045460ff1681565b6008805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156104815780601f1061045657610100808354040283529160200191610481565b600054600160a060020a0316331461061a57600080fd5b82600160a060020a038116151561063057600080fd5b82600160a060020a038116151561064657600080fd5b83600160a060020a03811630141561065d57600080fd5b85600160a060020a031663a9059cbb86866040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050600060405180830381600087803b1580156106d957600080fd5b505af11580156106ed573d6000803e3d6000fd5b50505050505050505050565b60066020526000908152604090205481565b600154600160a060020a0316331461072257600080fd5b60015460008054604051600160a060020a0393841693909116917f343765429aea5a34b3ff6a3785a98a5abb2597aca87bfbb58632c173d585373a91a3600180546000805473ffffffffffffffffffffffffffffffffffffffff19908116600160a060020a03841617909155169055565b600054600160a060020a031633146107aa57600080fd5b81600160a060020a03811615156107c057600080fd5b82600160a060020a0381163014156107d757600080fd5b6005546107ea908463ffffffff610bda16565b600555600160a060020a038416600090815260066020526040902054610816908463ffffffff610bda16565b600160a060020a03851660009081526006602090815260409182902092909255805185815290517f9386c90217c323f58030f9dadcbc938f807a940f4ff41cd4cead9562f5da7dc3929181900390910190a1604080518481529051600160a060020a038616913091600080516020610cc08339815191529181900360200190a350505050565b600054600160a060020a031681565b6003805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156104815780601f1061045657610100808354040283529160200191610481565b33600160a060020a03831614806109275750600054600160a060020a031633145b151561093257600080fd5b600160a060020a03821660009081526006602052604090205461095b908263ffffffff610bf316565b600160a060020a038316600090815260066020526040902055600554610987908263ffffffff610bf316565b6005556040805182815290513091600160a060020a03851691600080516020610cc08339815191529181900360200190a36040805182815290517f9a1b418bc061a5d80270261562e6986a35d995f8051145f277be16103abd34539181900360200190a15050565b60095460009060ff161515610a0057fe5b610a0a8383610c08565b1515610a1257fe5b50600192915050565b60095460ff1681565b600154600160a060020a031681565b600760209081526000928352604080842090915290825290205481565b600054600160a060020a03163314610a6757600080fd5b600054600160a060020a0382811691161415610a8257600080fd5b6001805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b600083600160a060020a0381161515610ac957600080fd5b83600160a060020a0381161515610adf57600080fd5b600160a060020a0386166000908152600760209081526040808320338452909152902054610b13908563ffffffff610bf316565b600160a060020a038716600081815260076020908152604080832033845282528083209490945591815260069091522054610b54908563ffffffff610bf316565b600160a060020a038088166000908152600660205260408082209390935590871681522054610b89908563ffffffff610bda16565b600160a060020a0380871660008181526006602090815260409182902094909455805188815290519193928a1692600080516020610cc083398151915292918290030190a350600195945050505050565b600082820183811015610bec57600080fd5b9392505050565b600081831015610c0257600080fd5b50900390565b600082600160a060020a0381161515610c2057600080fd5b33600090815260066020526040902054610c40908463ffffffff610bf316565b3360009081526006602052604080822092909255600160a060020a03861681522054610c72908463ffffffff610bda16565b600160a060020a038516600081815260066020908152604091829020939093558051868152905191923392600080516020610cc08339815191529281900390910190a350600193925050505600ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa165627a7a72305820ce51519b7f4e3128abe81f88a7ef774780cd8fec3f3a7fe7e2cd72f7ce44e58d0029"


export const BYTECODEConverter = "60806040526005805460a860020a61ffff021916751b000000000000000000000000000000000000000000179055600980546c010000000000000000000000006001606860020a031990911617606860020a60ff02191690553480156200006557600080fd5b5060405160a080620047258339810160409081528151602083015191830151606084015160809094015160008054600160a060020a0319163317815592949192848680600160a060020a0381161515620000be57600080fd5b5060028054600160a060020a031916600160a060020a03928316179055819081161515620000eb57600080fd5b5060048054600160a060020a03909216600160a060020a031992831681179091556005805490921617905583600063ffffffff821610801590620001385750620f424063ffffffff821611155b15156200014457600080fd5b620001787f436f6e74726163744665617475726573000000000000000000000000000000006401000000006200025f810204565b9150600160a060020a038216156200020d57604080517f2c7077c000000000000000000000000000000000000000000000000000000000815260016004820181905260248201529051600160a060020a03841691632c7077c091604480830192600092919082900301818387803b158015620001f357600080fd5b505af115801562000208573d6000803e3d6000fd5b505050505b6009805467ffffffff00000000191664010000000063ffffffff881602179055600160a060020a038416156200025257620002528484640100000000620002fb810204565b505050505050506200053f565b60048054604080517fbb34534c00000000000000000000000000000000000000000000000000000000815292830184905251600092600160a060020a039092169163bb34534c91602480830192602092919082900301818787803b158015620002c757600080fd5b505af1158015620002dc573d6000803e3d6000fd5b505050506040513d6020811015620002f357600080fd5b505192915050565b600054600160a060020a031633146200031357600080fd5b600254604080517f8da5cb5b00000000000000000000000000000000000000000000000000000000815290513092600160a060020a031691638da5cb5b9160048083019260209291908290030181600087803b1580156200037357600080fd5b505af115801562000388573d6000803e3d6000fd5b505050506040513d60208110156200039f57600080fd5b5051600160a060020a03161415620003b657600080fd5b81600160a060020a0381161515620003cd57600080fd5b82600160a060020a038116301415620003e557600080fd5b8260008163ffffffff16118015620004065750620f424063ffffffff821611155b15156200041257600080fd5b600254600160a060020a03868116911614801590620004575750600160a060020a0385166000908152600860205260409020600101546601000000000000900460ff16155b8015620004765750600954620f424063ffffffff918216860190911611155b15156200048257600080fd5b505050600160a060020a03919091166000818152600860205260408120600180820180549284905566010000000000006501000000000063ffffffff1994851663ffffffff808a169190911765ffff0000000019169190911766ff0000000000001916919091179091556007805492830181559093527fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c688018054600160a060020a0319169093179092556009805492831692821690930116179055565b6141d6806200054f6000396000f3006080604052600436106102a55763ffffffff60e060020a600035041663024c7ec781146102aa5780630ca78923146102c65780630e53aae9146102f85780631120a7761461034d57806315226b541461037e57806319b64015146103b15780631e1401f8146103c957806321e6b53d1461040c578063227425641461042d5780632a2e2f0c146104955780632c12b446146104c25780632fe8a6ad146104e357806338a5e0161461050c5780633aa0145a146105215780633f4d2fc21461053f578063415f12401461056e57806341a5b33d1461058657806349d10b64146105b05780634af80f0e146105c557806350057351146105e657806354fd4d501461065b578063579cd3ca146106875780635e35359e146106b55780635e5144eb146106df57806361cd756e1461070c5780636520d6fb146107215780636a49d2c4146107365780636ebf36c01461076057806371f52bf31461079857806372b44b2c146107ad57806375892cf1146107d157806379ba5097146107fe5780637b103999146108135780638da5cb5b146108285780638e3047e01461083d57806392d1abb714610867578063935e2ae11461087c57806394c275ad146108a05780639b99a8e2146108b5578063a2c4c336146108ca578063b3a426d5146108ee578063b4a176d31461098f578063bf754558146109a4578063c45d3d92146109b9578063ca1d209d146109ce578063cf73266a146109e6578063d031370b14610a10578063d4ee1d9014610a28578063d55ec69714610a3d578063d66bd52414610a52578063d895951214610a73578063d924f0c314610a94578063e4dd22f614610ab5578063ebf9470014610b18578063ecbca55d14610b76578063f0843ba914610b94578063f2fde38b14610be5578063fc0c546a14610c06578063fe417fa514610c1b575b600080fd5b3480156102b657600080fd5b506102c46004351515610c3f565b005b3480156102d257600080fd5b506102c4600160a060020a036004351663ffffffff602435166044351515606435610c96565b34801561030457600080fd5b50610319600160a060020a0360043516610ca6565b6040805195865263ffffffff9094166020860152911515848401521515606084015215156080830152519081900360a00190f35b34801561035957600080fd5b50610362610cf8565b60408051600160a060020a039092168252519081900360200190f35b34801561038a57600080fd5b5061039f600160a060020a0360043516610d07565b60408051918252519081900360200190f35b3480156103bd57600080fd5b50610362600435610dbb565b3480156103d557600080fd5b506103f3600160a060020a0360043581169060243516604435610de7565b6040805192835260208301919091528051918290030190f35b34801561041857600080fd5b506102c4600160a060020a0360043516610e64565b6040805160206004803580820135838102808601850190965280855261039f95369593946024949385019291829185019084908082843750949750508435955050506020830135926040810135925060ff606082013516915060808101359060a00135610eb4565b3480156104a157600080fd5b5061039f600160a060020a0360043581169060243516604435606435610ed0565b3480156104ce57600080fd5b5061039f600160a060020a036004351661132a565b3480156104ef57600080fd5b506104f8611386565b604080519115158252519081900360200190f35b34801561051857600080fd5b506102c46113a7565b34801561052d57600080fd5b5061039f60043560ff6024351661145d565b34801561054b57600080fd5b506102c4600160a060020a036004351663ffffffff6024351660443515156114bb565b34801561057a57600080fd5b506102c46004356114ca565b34801561059257600080fd5b506102c4600160a060020a0360043581169060243516604435611829565b3480156105bc57600080fd5b506102c46118d3565b3480156105d157600080fd5b506102c4600160a060020a0360043516611a64565b3480156105f257600080fd5b506040805160206004803580820135838102808601850190965280855261039f95369593946024949385019291829185019084908082843750949750508435955050506020830135926040810135925060ff606082013516915060808101359060a00135611ab5565b34801561066757600080fd5b50610670611ac2565b6040805161ffff9092168252519081900360200190f35b34801561069357600080fd5b5061069c611ae5565b6040805163ffffffff9092168252519081900360200190f35b3480156106c157600080fd5b506102c4600160a060020a0360043581169060243516604435611afd565b3480156106eb57600080fd5b5061039f600160a060020a0360043581169060243516604435606435611c0e565b34801561071857600080fd5b50610362611c25565b34801561072d57600080fd5b5061069c611c34565b34801561074257600080fd5b506102c4600160a060020a036004351663ffffffff60243516611c40565b34801561076c57600080fd5b5061039f600160a060020a0360043581169060243581169060443590606435906084351660a435611e78565b3480156107a457600080fd5b50610670611f1e565b3480156107b957600080fd5b506103f3600160a060020a0360043516602435611f2d565b3480156107dd57600080fd5b5061039f600160a060020a036004358116906024351660443560643561220d565b34801561080a57600080fd5b506102c461221e565b34801561081f57600080fd5b50610362612299565b34801561083457600080fd5b506103626122a8565b34801561084957600080fd5b506103f3600160a060020a03600435811690602435166044356122b7565b34801561087357600080fd5b5061039f6122c5565b34801561088857600080fd5b506102c4600160a060020a03600435166024356122ca565b3480156108ac57600080fd5b5061069c61237f565b3480156108c157600080fd5b50610670612393565b3480156108d657600080fd5b506103f3600160a060020a0360043516602435612399565b6040805160206004803580820135838102808601850190965280855261039f953695939460249493850192918291850190849080828437505060408051818801358901803560208181028481018201909552818452989b8a359b8a8c01359b919a9099506060909101975092955090820193509182918501908490808284375094975050508335600160a060020a031694505050602090910135905061262c565b34801561099b57600080fd5b506102c4612646565b3480156109b057600080fd5b506104f8612681565b3480156109c557600080fd5b5061036261269a565b3480156109da57600080fd5b506102c46004356126a9565b3480156109f257600080fd5b506103f3600160a060020a0360043581169060243516604435612a07565b348015610a1c57600080fd5b50610362600435612c37565b348015610a3457600080fd5b50610362612c5f565b348015610a4957600080fd5b506102c4612c6e565b348015610a5e57600080fd5b50610319600160a060020a0360043516612d4a565b348015610a7f57600080fd5b5061039f600160a060020a0360043516612d90565b348015610aa057600080fd5b506102c4600160a060020a0360043516612da1565b6040805160206004803580820135838102808601850190965280855261039f9536959394602494938501929182918501908490808284375094975050843595505050602083013592600160a060020a036040820135169250606001359050612dda565b348015610b2457600080fd5b506040805160206004803580820135838102808601850190965280855261039f953695939460249493850192918291850190849080828437509497505084359550505060209092013591506130589050565b348015610b8257600080fd5b506102c463ffffffff60043516613385565b6040805160206004803580820135838102808601850190965280855261039f953695939460249493850192918291850190849080828437509497505084359550505060209092013591506134539050565b348015610bf157600080fd5b506102c4600160a060020a036004351661346b565b348015610c1257600080fd5b506103626134bf565b348015610c2757600080fd5b506102c4600160a060020a03600435166024356134ce565b600054600160a060020a03163314610c5657600080fd5b60058054911515740100000000000000000000000000000000000000000274ff000000000000000000000000000000000000000019909216919091179055565b610ca084826122ca565b50505050565b600160a060020a031660009081526008602052604090208054600190910154909163ffffffff82169160ff64010000000082048116926501000000000083048216926601000000000000900490911690565b600354600160a060020a031681565b600160a060020a03811660009081526008602052604081206001015482906601000000000000900460ff161515610d3d57600080fd5b6040805160e060020a6370a082310281523060048201529051600160a060020a038516916370a082319160248083019260209291908290030181600087803b158015610d8857600080fd5b505af1158015610d9c573d6000803e3d6000fd5b505050506040513d6020811015610db257600080fd5b50519392505050565b6000600782815481101515610dcc57fe5b600091825260209091200154600160a060020a031692915050565b600080600160a060020a038581169085161415610e0357600080fd5b600254600160a060020a0385811691161415610e2c57610e238584612399565b91509150610e5c565b600254600160a060020a0386811691161415610e4c57610e238484611f2d565b610e57858585612a07565b915091505b935093915050565b600054600160a060020a03163314610e7b57600080fd5b60008051602061416b833981519152610e93816135c7565b600160a060020a03163314610ea757600080fd5b610eb082613660565b5050565b6000610ec4888888600080612dda565b98975050505050505050565b6000806000806000806009600d9054906101000a900460ff16151515610ef557600080fd5b600980546dff0000000000000000000000000019166d01000000000000000000000000001790557f42616e636f724e6574776f726b00000000000000000000000000000000000000610f46816135c7565b600160a060020a03163314610f5a57600080fd5b8760008111610f6857600080fd5b600160a060020a038c8116908c161415610f8157600080fd5b600254600160a060020a038c811691161415610fa957610fa28c8b8b6136f9565b9750611303565b600254600160a060020a038d811691161415610fca57610fa28b8b8b613917565b610fd58c8c8c612a07565b90975095508615801590610fe95750888710155b1515610ff457600080fd5b600160a060020a03808d16600090815260086020526040808220928e168252902090955093506110238b610d07565b925082871061102e57fe5b61103a8c33308d613cd2565b6110468b30338a613cd2565b6110538c8c8c8a8a613f10565b8b600160a060020a031660008051602061418b833981519152600260009054906101000a9004600160a060020a0316600160a060020a03166318160ddd6040518163ffffffff1660e060020a028152600401602060405180830381600087803b1580156110bf57600080fd5b505af11580156110d3573d6000803e3d6000fd5b505050506040513d60208110156110e957600080fd5b81019080805190602001909291905050508e600160a060020a03166370a08231306040518263ffffffff1660e060020a0281526004018082600160a060020a0316600160a060020a03168152602001915050602060405180830381600087803b15801561115557600080fd5b505af1158015611169573d6000803e3d6000fd5b505050506040513d602081101561117f57600080fd5b5051600189015460408051938452602084019290925263ffffffff1682820152519081900360600190a28a600160a060020a031660008051602061418b833981519152600260009054906101000a9004600160a060020a0316600160a060020a03166318160ddd6040518163ffffffff1660e060020a028152600401602060405180830381600087803b15801561121557600080fd5b505af1158015611229573d6000803e3d6000fd5b505050506040513d602081101561123f57600080fd5b81019080805190602001909291905050508d600160a060020a03166370a08231306040518263ffffffff1660e060020a0281526004018082600160a060020a0316600160a060020a03168152602001915050602060405180830381600087803b1580156112ab57600080fd5b505af11580156112bf573d6000803e3d6000fd5b505050506040513d60208110156112d557600080fd5b5051600188015460408051938452602084019290925263ffffffff1682820152519081900360600190a28697505b5050600980546dff0000000000000000000000000019169055509398975050505050505050565b600160a060020a03811660009081526008602052604081206001015482906601000000000000900460ff16151561136057600080fd5b5050600160a060020a031660009081526008602052604090206001015463ffffffff1690565b60055474010000000000000000000000000000000000000000900460ff1681565b600054600160a060020a031633146113be57600080fd5b600254604080517f18160ddd0000000000000000000000000000000000000000000000000000000081529051600092600160a060020a0316916318160ddd91600480830192602092919082900301818787803b15801561141d57600080fd5b505af1158015611431573d6000803e3d6000fd5b505050506040513d602081101561144757600080fd5b50511161145357600080fd5b61145b613f93565b565b6009546000906114b49060ff8416620f424081810a67ffffffffffffffff908116936114a893899363ffffffff680100000000000000009093048316900383160a9091169061401116565b9063ffffffff61404a16565b9392505050565b6114c58383611c40565b505050565b60008060008060008060006009600d9054906101000a900460ff161515156114f157600080fd5b600980546dff0000000000000000000000000019166d010000000000000000000000000017905560075460011061152757600080fd5b600260009054906101000a9004600160a060020a0316600160a060020a03166318160ddd6040518163ffffffff1660e060020a028152600401602060405180830381600087803b15801561157a57600080fd5b505af115801561158e573d6000803e3d6000fd5b505050506040513d60208110156115a457600080fd5b505196506115bf60008051602061414b8339815191526135c7565b6002546040805160e060020a63a24835d1028152336004820152602481018c90529051929850600160a060020a039091169163a24835d19160448082019260009290919082900301818387803b15801561161857600080fd5b505af115801561162c573d6000803e3d6000fd5b50505050600091505b60075461ffff83161015611808576007805461ffff841690811061165557fe5b60009182526020808320909101546040805160e060020a6370a082310281523060048201529051600160a060020a03909216985088936370a082319360248084019491939192918390030190829087803b1580156116b257600080fd5b505af11580156116c6573d6000803e3d6000fd5b505050506040513d60208110156116dc57600080fd5b5051600954604080517fabfd231d000000000000000000000000000000000000000000000000000000008152600481018b90526024810184905263ffffffff9092166044830152606482018b905251919550600160a060020a0388169163abfd231d916084808201926020929091908290030181600087803b15801561176157600080fd5b505af1158015611775573d6000803e3d6000fd5b505050506040513d602081101561178b57600080fd5b5051600160a060020a038616600090815260086020526040902090935090506117b685303386613cd2565b6001810154604080518a8a038152858703602082015263ffffffff9092168282015251600160a060020a0387169160008051602061418b833981519152919081900360600190a2600190910190611635565b5050600980546dff0000000000000000000000000019169055505050505050565b600054600160a060020a0316331461184057600080fd5b600254604080517f5e35359e000000000000000000000000000000000000000000000000000000008152600160a060020a03868116600483015285811660248301526044820185905291519190921691635e35359e91606480830192600092919082900301818387803b1580156118b657600080fd5b505af11580156118ca573d6000803e3d6000fd5b50505050505050565b60008054600160a060020a0316331480611908575060055474010000000000000000000000000000000000000000900460ff16155b151561191357600080fd5b61193c7f436f6e74726163745265676973747279000000000000000000000000000000006135c7565b600454909150600160a060020a038083169116148015906119655750600160a060020a03811615155b151561197057600080fd5b604080517fbb34534c0000000000000000000000000000000000000000000000000000000081527f436f6e747261637452656769737472790000000000000000000000000000000060048201529051600091600160a060020a0384169163bb34534c9160248082019260209290919082900301818787803b1580156119f457600080fd5b505af1158015611a08573d6000803e3d6000fd5b505050506040513d6020811015611a1e57600080fd5b5051600160a060020a03161415611a3457600080fd5b6004805460058054600160a060020a03808416600160a060020a0319928316179092559091169216919091179055565b600054600160a060020a03163314611a7b57600080fd5b80600160a060020a038116301415611a9257600080fd5b5060068054600160a060020a031916600160a060020a0392909216919091179055565b6000610ec4888888613058565b6005547501000000000000000000000000000000000000000000900461ffff1681565b60095468010000000000000000900463ffffffff1681565b6000611b1660008051602061416b8339815191526135c7565b600160a060020a0385166000908152600860205260409020600101549091506601000000000000900460ff161580611be05750600254604080517f8da5cb5b00000000000000000000000000000000000000000000000000000000815290513092600160a060020a031691638da5cb5b9160048083019260209291908290030181600087803b158015611ba857600080fd5b505af1158015611bbc573d6000803e3d6000fd5b505050506040513d6020811015611bd257600080fd5b5051600160a060020a031614155b80611bf85750600054600160a060020a038281169116145b1515611c0357600080fd5b610ca084848461406d565b6000611c1c85858585610ed0565b95945050505050565b600554600160a060020a031681565b60095463ffffffff1681565b600054600160a060020a03163314611c5757600080fd5b600254604080517f8da5cb5b00000000000000000000000000000000000000000000000000000000815290513092600160a060020a031691638da5cb5b9160048083019260209291908290030181600087803b158015611cb657600080fd5b505af1158015611cca573d6000803e3d6000fd5b505050506040513d6020811015611ce057600080fd5b5051600160a060020a03161415611cf657600080fd5b81600160a060020a0381161515611d0c57600080fd5b82600160a060020a038116301415611d2357600080fd5b8260008163ffffffff16118015611d435750620f424063ffffffff821611155b1515611d4e57600080fd5b600254600160a060020a03868116911614801590611d925750600160a060020a0385166000908152600860205260409020600101546601000000000000900460ff16155b8015611db05750600954620f424063ffffffff918216860190911611155b1515611dbb57600080fd5b505050600160a060020a03919091166000818152600860205260408120600180820180549284905566010000000000006501000000000063ffffffff1994851663ffffffff808a169190911765ffff0000000019169190911766ff0000000000001916919091179091556007805492830181559093527fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c688018054600160a060020a0319169093179092556009805492831692821690930116179055565b6040805160038082526080820190925260009160609190602082018380388339505060025482519293508a92600160a060020a039091169150899084906000908110611ec057fe5b906020019060200201846001815181101515611ed857fe5b906020019060200201856002815181101515611ef057fe5b600160a060020a0394851660209182029092010152928216909252919091169052610ec48187878787612dda565b6000611f28612393565b905090565b60008060008060008060008030600160a060020a0316600260009054906101000a9004600160a060020a0316600160a060020a0316638da5cb5b6040518163ffffffff1660e060020a028152600401602060405180830381600087803b158015611f9657600080fd5b505af1158015611faa573d6000803e3d6000fd5b505050506040513d6020811015611fc057600080fd5b5051600160a060020a031614611fd557600080fd5b600160a060020a038a166000908152600860205260409020600101548a906601000000000000900460ff16151561200b57600080fd5b600160a060020a03808c16600090815260086020908152604080832060025482517f18160ddd0000000000000000000000000000000000000000000000000000000081529251919c50909416936318160ddd93600480840194938390030190829087803b15801561207b57600080fd5b505af115801561208f573d6000803e3d6000fd5b505050506040513d60208110156120a557600080fd5b50516040805160e060020a6370a082310281523060048201529051919750600160a060020a038d16916370a08231916024808201926020929091908290030181600087803b1580156120f657600080fd5b505af115801561210a573d6000803e3d6000fd5b505050506040513d602081101561212057600080fd5b5051945061213b60008051602061414b8339815191526135c7565b6001880154604080517f49f9b0f7000000000000000000000000000000000000000000000000000000008152600481018a90526024810189905263ffffffff9092166044830152606482018d905251919550600160a060020a038616916349f9b0f7916084808201926020929091908290030181600087803b1580156121c057600080fd5b505af11580156121d4573d6000803e3d6000fd5b505050506040513d60208110156121ea57600080fd5b505192506121f983600161145d565b9b928c90039a509198505050505050505050565b6000611c1c85858585600080611e78565b600154600160a060020a0316331461223557600080fd5b60015460008054604051600160a060020a0393841693909116917f343765429aea5a34b3ff6a3785a98a5abb2597aca87bfbb58632c173d585373a91a36001805460008054600160a060020a0319908116600160a060020a03841617909155169055565b600454600160a060020a031681565b600054600160a060020a031681565b600080610e57858585612a07565b600181565b60008054600160a060020a031633146122e257600080fd5b60008051602061416b8339815191526122fa816135c7565b600160a060020a0316331461230e57600080fd5b600160a060020a03841660009081526008602052604090206001015484906601000000000000900460ff16151561234457600080fd5b505050600160a060020a0391909116600090815260086020526040902060018101805464ff0000000019168315156401000000000217905555565b600954640100000000900463ffffffff1681565b60075490565b60008060008060008060008030600160a060020a0316600260009054906101000a9004600160a060020a0316600160a060020a0316638da5cb5b6040518163ffffffff1660e060020a028152600401602060405180830381600087803b15801561240257600080fd5b505af1158015612416573d6000803e3d6000fd5b505050506040513d602081101561242c57600080fd5b5051600160a060020a03161461244157600080fd5b600160a060020a038a166000908152600860205260409020600101548a906601000000000000900460ff16151561247757600080fd5b600160a060020a03808c16600090815260086020908152604080832060025482517f18160ddd0000000000000000000000000000000000000000000000000000000081529251919c50909416936318160ddd93600480840194938390030190829087803b1580156124e757600080fd5b505af11580156124fb573d6000803e3d6000fd5b505050506040513d602081101561251157600080fd5b50516040805160e060020a6370a082310281523060048201529051919750600160a060020a038d16916370a08231916024808201926020929091908290030181600087803b15801561256257600080fd5b505af1158015612576573d6000803e3d6000fd5b505050506040513d602081101561258c57600080fd5b505194506125a760008051602061414b8339815191526135c7565b6001880154604080517f29a00e7c000000000000000000000000000000000000000000000000000000008152600481018a90526024810189905263ffffffff9092166044830152606482018d905251919550600160a060020a038616916329a00e7c916084808201926020929091908290030181600087803b1580156121c057600080fd5b600061263b8787878686612dda565b979650505050505050565b600054600160a060020a0316331461265d57600080fd5b60055460048054600160a060020a031916600160a060020a03909216919091179055565b6009546c01000000000000000000000000900460ff1681565b600654600160a060020a031681565b60008060008060008060006009600d9054906101000a900460ff161515156126d057600080fd5b600980546dff0000000000000000000000000019166d010000000000000000000000000017905560075460011061270657600080fd5b600260009054906101000a9004600160a060020a0316600160a060020a03166318160ddd6040518163ffffffff1660e060020a028152600401602060405180830381600087803b15801561275957600080fd5b505af115801561276d573d6000803e3d6000fd5b505050506040513d602081101561278357600080fd5b5051965061279e60008051602061414b8339815191526135c7565b9550600091505b60075461ffff83161015612978576007805461ffff84169081106127c557fe5b60009182526020808320909101546040805160e060020a6370a082310281523060048201529051600160a060020a03909216985088936370a082319360248084019491939192918390030190829087803b15801561282257600080fd5b505af1158015612836573d6000803e3d6000fd5b505050506040513d602081101561284c57600080fd5b5051600954604080517f1da6bbfb000000000000000000000000000000000000000000000000000000008152600481018b90526024810184905263ffffffff9092166044830152606482018b905251919550600160a060020a03881691631da6bbfb916084808201926020929091908290030181600087803b1580156128d157600080fd5b505af11580156128e5573d6000803e3d6000fd5b505050506040513d60208110156128fb57600080fd5b5051600160a060020a0386166000908152600860205260409020909350905061292685333086613cd2565b600181015460408051898b018152868601602082015263ffffffff9092168282015251600160a060020a0387169160008051602061418b833981519152919081900360600190a26001909101906127a5565b6002546040805160e260020a63219e412d028152336004820152602481018b90529051600160a060020a039092169163867904b49160448082019260009290919082900301818387803b1580156129ce57600080fd5b505af11580156129e2573d6000803e3d6000fd5b5050600980546dff000000000000000000000000001916905550505050505050505050565b600080600080600080600030600160a060020a0316600260009054906101000a9004600160a060020a0316600160a060020a0316638da5cb5b6040518163ffffffff1660e060020a028152600401602060405180830381600087803b158015612a6f57600080fd5b505af1158015612a83573d6000803e3d6000fd5b505050506040513d6020811015612a9957600080fd5b5051600160a060020a031614612aae57600080fd5b600160a060020a038a166000908152600860205260409020600101548a906601000000000000900460ff161515612ae457600080fd5b600160a060020a038a166000908152600860205260409020600101548a906601000000000000900460ff161515612b1a57600080fd5b600160a060020a03808d16600090815260086020526040808220928e16825290209097509550612b5760008051602061414b8339815191526135c7565b945084600160a060020a03166379c1b450612b718e610d07565b60018a015463ffffffff16612b858f610d07565b60018b01546040805163ffffffff87811660e060020a028252600482019690965293851660248501526044840192909252929092166064820152608481018e9052905160a48083019260209291908290030181600087803b158015612be957600080fd5b505af1158015612bfd573d6000803e3d6000fd5b505050506040513d6020811015612c1357600080fd5b50519350612c2284600261145d565b9c938d90039b50929950505050505050505050565b6007805482908110612c4557fe5b600091825260209091200154600160a060020a0316905081565b600154600160a060020a031681565b60008054600160a060020a03163314612c8657600080fd5b612c9d60008051602061416b8339815191526135c7565b9050612ca88161346b565b600554604080517f90f58c96000000000000000000000000000000000000000000000000000000008152750100000000000000000000000000000000000000000090920461ffff16600483015251600160a060020a038316916390f58c9691602480830192600092919082900301818387803b158015612d2757600080fd5b505af1158015612d3b573d6000803e3d6000fd5b50505050612d4761221e565b50565b6008602052600090815260409020805460019091015463ffffffff81169060ff640100000000820481169165010000000000810482169166010000000000009091041685565b6000612d9b82610d07565b92915050565b600054600160a060020a03163314612db857600080fd5b60038054600160a060020a031916600160a060020a0392909216919091179055565b600080612e067f42616e636f724e6574776f726b000000000000000000000000000000000000006135c7565b9050341515612f4d576002548751600160a060020a039091169088906000908110612e2d57fe5b90602001906020020151600160a060020a03161415612f29576002546040805160e060020a63a24835d1028152336004820152602481018990529051600160a060020a039092169163a24835d19160448082019260009290919082900301818387803b158015612e9c57600080fd5b505af1158015612eb0573d6000803e3d6000fd5b50506002546040805160e260020a63219e412d028152600160a060020a038681166004830152602482018c9052915191909216935063867904b49250604480830192600092919082900301818387803b158015612f0c57600080fd5b505af1158015612f20573d6000803e3d6000fd5b50505050612f4d565b612f4d876000815181101515612f3b57fe5b90602001906020020151338389613cd2565b80600160a060020a031663ab6214ce34898989338a8a6040518863ffffffff1660e060020a028152600401808060200187815260200186815260200185600160a060020a0316600160a060020a0316815260200184600160a060020a0316600160a060020a03168152602001838152602001828103825288818151815260200191508051906020019060200280838360005b83811015612ff7578181015183820152602001612fdf565b505050509050019750505050505050506020604051808303818588803b15801561302057600080fd5b505af1158015613034573d6000803e3d6000fd5b50505050506040513d602081101561304b57600080fd5b5051979650505050505050565b6000806000806130877f42616e636f7258000000000000000000000000000000000000000000000000006135c7565b92506130b27f42616e636f724e6574776f726b000000000000000000000000000000000000006135c7565b91506130dd7f424e54546f6b656e0000000000000000000000000000000000000000000000006135c7565b600160a060020a03168760008151811015156130f557fe5b60209081029091010151600160a060020a03161461311257600080fd5b604080517faafd6b76000000000000000000000000000000000000000000000000000000008152600481018790523360248201529051600160a060020a0385169163aafd6b769160448083019260209291908290030181600087803b15801561317a57600080fd5b505af115801561318e573d6000803e3d6000fd5b505050506040513d60208110156131a457600080fd5b50516002546040805160e060020a63a24835d1028152336004820152602481018490529051929350600160a060020a039091169163a24835d19160448082019260009290919082900301818387803b1580156131ff57600080fd5b505af1158015613213573d6000803e3d6000fd5b50506002546040805160e260020a63219e412d028152600160a060020a03878116600483015260248201879052915191909216935063867904b49250604480830192600092919082900301818387803b15801561326f57600080fd5b505af1158015613283573d6000803e3d6000fd5b5050505081600160a060020a031663ab6214ce888389336000806040518763ffffffff1660e060020a028152600401808060200187815260200186815260200185600160a060020a0316600160a060020a0316815260200184600160a060020a0316600160a060020a03168152602001838152602001828103825288818151815260200191508051906020019060200280838360005b83811015613331578181015183820152602001613319565b50505050905001975050505050505050602060405180830381600087803b15801561335b57600080fd5b505af115801561336f573d6000803e3d6000fd5b505050506040513d602081101561304b57600080fd5b600054600160a060020a0316331461339c57600080fd5b60008163ffffffff16101580156133c7575060095463ffffffff640100000000909104811690821611155b15156133d257600080fd5b6009546040805163ffffffff6801000000000000000090930483168152918316602083015280517f81cd2ffb37dd237c0e4e2a3de5265fcf9deb43d3e7801e80db9f1ccfba7ee6009281900390910190a16009805463ffffffff90921668010000000000000000026bffffffff000000000000000019909216919091179055565b6000613463848484600080612dda565b949350505050565b600054600160a060020a0316331461348257600080fd5b600054600160a060020a038281169116141561349d57600080fd5b60018054600160a060020a031916600160a060020a0392909216919091179055565b600254600160a060020a031681565b600354600160a060020a031633146134e557600080fd5b6002546040805160e060020a63a24835d1028152600160a060020a038581166004830152602482018590529151919092169163a24835d191604480830192600092919082900301818387803b15801561353d57600080fd5b505af1158015613551573d6000803e3d6000fd5b50506002546040805160e260020a63219e412d028152336004820152602481018690529051600160a060020a03909216935063867904b4925060448082019260009290919082900301818387803b1580156135ab57600080fd5b505af11580156135bf573d6000803e3d6000fd5b505050505050565b60048054604080517fbb34534c00000000000000000000000000000000000000000000000000000000815292830184905251600092600160a060020a039092169163bb34534c91602480830192602092919082900301818787803b15801561362e57600080fd5b505af1158015613642573d6000803e3d6000fd5b505050506040513d602081101561365857600080fd5b505192915050565b600054600160a060020a0316331461367757600080fd5b600254604080517ff2fde38b000000000000000000000000000000000000000000000000000000008152600160a060020a0384811660048301529151919092169163f2fde38b91602480830192600092919082900301818387803b1580156136de57600080fd5b505af11580156136f2573d6000803e3d6000fd5b5050505050565b6000806000806137098787612399565b9093509150821580159061371d5750848310155b151561372857600080fd5b50600160a060020a038616600090815260086020526040902061374d87333089613cd2565b6002546040805160e260020a63219e412d028152336004820152602481018690529051600160a060020a039092169163867904b49160448082019260009290919082900301818387803b1580156137a357600080fd5b505af11580156137b7573d6000803e3d6000fd5b50506002546137d59250899150600160a060020a0316888686613f10565b86600160a060020a031660008051602061418b833981519152600260009054906101000a9004600160a060020a0316600160a060020a03166318160ddd6040518163ffffffff1660e060020a028152600401602060405180830381600087803b15801561384157600080fd5b505af1158015613855573d6000803e3d6000fd5b505050506040513d602081101561386b57600080fd5b50516040805160e060020a6370a082310281523060048201529051600160a060020a038c16916370a082319160248083019260209291908290030181600087803b1580156138b857600080fd5b505af11580156138cc573d6000803e3d6000fd5b505050506040513d60208110156138e257600080fd5b5051600185015460408051938452602084019290925263ffffffff1682820152519081900360600190a2509095945050505050565b6002546040805160e060020a6370a08231028152336004820152905160009283928392839283928392600160a060020a03909216916370a082319160248082019260209290919082900301818787803b15801561397357600080fd5b505af1158015613987573d6000803e3d6000fd5b505050506040513d602081101561399d57600080fd5b50518811156139ab57600080fd5b6139b58989611f2d565b909550935084158015906139c95750868510155b15156139d457600080fd5b600260009054906101000a9004600160a060020a0316600160a060020a03166318160ddd6040518163ffffffff1660e060020a028152600401602060405180830381600087803b158015613a2757600080fd5b505af1158015613a3b573d6000803e3d6000fd5b505050506040513d6020811015613a5157600080fd5b50516040805160e060020a6370a082310281523060048201529051919450600160a060020a038b16916370a08231916024808201926020929091908290030181600087803b158015613aa257600080fd5b505af1158015613ab6573d6000803e3d6000fd5b505050506040513d6020811015613acc57600080fd5b5051915081851080613ae757508185148015613ae757508288145b1515613aef57fe5b50600160a060020a03808916600090815260086020526040808220600254825160e060020a63a24835d1028152336004820152602481018d905292519194169263a24835d1926044808201939182900301818387803b158015613b5157600080fd5b505af1158015613b65573d6000803e3d6000fd5b50505050613b7589303388613cd2565b600254613b8e90600160a060020a03168a8a8888613f10565b88600160a060020a031660008051602061418b833981519152600260009054906101000a9004600160a060020a0316600160a060020a03166318160ddd6040518163ffffffff1660e060020a028152600401602060405180830381600087803b158015613bfa57600080fd5b505af1158015613c0e573d6000803e3d6000fd5b505050506040513d6020811015613c2457600080fd5b50516040805160e060020a6370a082310281523060048201529051600160a060020a038e16916370a082319160248083019260209291908290030181600087803b158015613c7157600080fd5b505af1158015613c85573d6000803e3d6000fd5b505050506040513d6020811015613c9b57600080fd5b5051600185015460408051938452602084019290925263ffffffff1682820152519081900360600190a25092979650505050505050565b60008085600160a060020a03166370a08231856040518263ffffffff1660e060020a0281526004018082600160a060020a0316600160a060020a03168152602001915050602060405180830381600087803b158015613d3057600080fd5b505af1158015613d44573d6000803e3d6000fd5b505050506040513d6020811015613d5a57600080fd5b50519150600160a060020a038516301415613def5785600160a060020a031663a9059cbb85856040518363ffffffff1660e060020a0281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050600060405180830381600087803b158015613dd257600080fd5b505af1158015613de6573d6000803e3d6000fd5b50505050613e7b565b604080517f23b872dd000000000000000000000000000000000000000000000000000000008152600160a060020a0387811660048301528681166024830152604482018690529151918816916323b872dd9160648082019260009290919082900301818387803b158015613e6257600080fd5b505af1158015613e76573d6000803e3d6000fd5b505050505b85600160a060020a03166370a08231856040518263ffffffff1660e060020a0281526004018082600160a060020a0316600160a060020a03168152602001915050602060405180830381600087803b158015613ed657600080fd5b505af1158015613eea573d6000803e3d6000fd5b505050506040513d6020811015613f0057600080fd5b505190508181116135bf57600080fd5b7f80000000000000000000000000000000000000000000000000000000000000008110613f3957fe5b604080518481526020810184905280820183905290513391600160a060020a0387811692908916917f276856b36cbc45526a0ba64f44611557a2a8b68662c5388e9fe6d72e86e1c8cb919081900360600190a45050505050565b600054600160a060020a03163314613faa57600080fd5b600260009054906101000a9004600160a060020a0316600160a060020a03166379ba50976040518163ffffffff1660e060020a028152600401600060405180830381600087803b158015613ffd57600080fd5b505af1158015610ca0573d6000803e3d6000fd5b6000808315156140245760009150614043565b5082820282848281151561403457fe5b041461403f57600080fd5b8091505b5092915050565b60008080831161405957600080fd5b828481151561406457fe5b04949350505050565b600054600160a060020a0316331461408457600080fd5b82600160a060020a038116151561409a57600080fd5b82600160a060020a03811615156140b057600080fd5b83600160a060020a0381163014156140c757600080fd5b85600160a060020a031663a9059cbb86866040518363ffffffff1660e060020a0281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050600060405180830381600087803b15801561412a57600080fd5b505af115801561413e573d6000803e3d6000fd5b50505050505050505050560042616e636f72466f726d756c610000000000000000000000000000000000000042616e636f72436f6e76657274657255706772616465720000000000000000008a6a7f53b3c8fa1dc4b83e3f1be668c1b251ff8d44cdcb83eb3acec3fec6a788a165627a7a723058201983de0b2f89c507b09181d1c8e92fe079ec5cafbc347d4cdcfa2d102119d06f0029"
