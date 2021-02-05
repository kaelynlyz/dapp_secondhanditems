//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.16;

contract Purchase {
    address[16] public buyers;

    function returnEth() public payable{
        msg.sender.transfer(msg.value);
    }

    function buy(uint itemId) public payable returns (uint) {
        require(itemId >= 0 && itemId <= 15);
        require(msg.value==0.001 ether);
        buyers[itemId] = msg.sender;
        return itemId;
    }

    function getBuyers() public view returns (address[16] memory) {
        return buyers;
    }

    function() external payable{

    }

}


/*contract Purchase {
    struct Item {
        string name; 
        uint ID;
        uint price;
        string type;
        string condition;
        address owner;
    }

    function addItem() public {
        Items memory someItem = addItem("table",10,10000,"furniture","new");
        example = someStruct;
    }
}*/

