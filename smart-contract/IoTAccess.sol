// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IoTAccess {

    address public admin;

    struct EventLog {
        address user;
        string device;
        string action;
        uint256 timestamp;
    }

    mapping(address => bool) public authorized;

    EventLog[] public logs;

    constructor() {
        admin = msg.sender;
        authorized[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyAuthorized() {
        require(authorized[msg.sender], "Not authorized");
        _;
    }

    function grantAccess(address user) public onlyAdmin {
        authorized[user] = true;
        logs.push(EventLog(user, "SYSTEM", "ACCESS_GRANTED", block.timestamp));
    }

    function revokeAccess(address user) public onlyAdmin {
        authorized[user] = false;
        logs.push(EventLog(user, "SYSTEM", "ACCESS_REVOKED", block.timestamp));
    }

    function logEvent(string memory device, string memory action)
        public
        onlyAuthorized
    {
        logs.push(EventLog(msg.sender, device, action, block.timestamp));
    }

    function getLogCount() public view returns (uint) {
        return logs.length;
    }

    function getLog(uint i) public view returns (EventLog memory) {
        return logs[i];
    }
}
