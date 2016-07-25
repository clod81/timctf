var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// contract abi
// var abi = [{
//      name: 'myConstantMethod',
//      type: 'function',
//      constant: true,
//      inputs: [{ name: 'a', type: 'string' }],
//      outputs: [{name: 'd', type: 'string' }]
// }, {
//      name: 'myStateChangingMethod',
//      type: 'function',
//      constant: false,
//      inputs: [{ name: 'a', type: 'string' }, { name: 'b', type: 'int' }],
//      outputs: []
// }, {
//      name: 'myEvent',
//      type: 'event',
//      inputs: [{name: 'a', type: 'int', indexed: true},{name: 'b', type: 'bool', indexed: false}]
// }];
//
// var MyContract = web3.eth.contract(abi);
// var myContractInstance = MyContract.at('0xd9f5634ca7c211d0ea17e5e8b9df2de261db1524');
//
// var event = myContractInstance.MyEvent({valueA: 23} [, additionalFilterObject])
//
// // watch for changes
// event.watch(function(error, result){
//   if (!error)
//     console.log(result);
// });

console.log(web3.eth.getBalance("0xd9f5634ca7c211d0ea17e5e8b9df2de261db1524"));

var accounts = web3.eth.accounts;
console.log(accounts); // ["0x407d73d8a49eeb85d32cf465507dd71d507100c1"] 
