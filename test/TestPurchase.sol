//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.5.16;

import 'truffle/Assert.sol';
import 'truffle/DeployedAddresses.sol';
import '../contracts/Purchase.sol';

contract TestPurchase {
    Purchase purchase = Purchase(DeployedAddresses.Purchase());
    
    uint expectedItemId = 8;
    address expectedBuyer = address(this);

    function testUserCanBuyItem() public {
        uint returnedId = purchase.buy(expectedItemId);
        Assert.equal(returnedId, expectedItemId, 'Purchase of the expected item should match what is returned.');
    }

    function testGetBuyerAddressByItemId() public {
        address buyer = purchase.buyers(expectedItemId);
        Assert.equal(buyer, expectedBuyer, 'Owner of the expected item should be this contract');
    }

    function testGetBuyerAddressByItemIdInArray() public {
        address[16] memory buyers = purchase.getBuyers();
        Assert.equal(buyers[expectedItemId], expectedBuyer, 'Owner of the expected item should be this contract');
    }
}