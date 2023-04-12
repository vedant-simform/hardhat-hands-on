# Hardhat - Hands-on

## Submission By:- Vedant Soni [Blockchain Trainee]

### Aim:- Use hardhat for developing, testing and deploying any contract of your choice. You must create hardhat tasks to deploy and verify the contract.

#### Contract :- 
Vesting.sol

#### Tasks :-
1) To Deploy Contract \
   npx hardhat deploy
![Screenshot from 2023-04-11 13-53-12](https://user-images.githubusercontent.com/122250819/231100967-6271afaa-c57d-4017-8a4c-07a3d1542c4f.png)

2) To Verify Contract \
  npx hardhat verify-task
![Screenshot from 2023-04-11 13-59-24](https://user-images.githubusercontent.com/122250819/231102507-49e52ac1-fc06-4fa1-a0a0-be305d878fc0.png)

#### Testing
Test Cases:-
  Test-cases for Vesting
   1) addVestingTokens Function Test Cases \
      ✔ User must add some tokens \
      ✔ Slice Period must be less than Vesting period \
      ✔ Event emission of DepositTokens \
      ✔ Balance Updation of User after token vested \
      ✔ Balance Updation of Contract after token vested 
   2) CalculateVestedAmount Function test cases \
      ✔ All tokens must be return after vesting time ends \
      ✔ No token should be vested before first interval \
      ✔ No tokens should be relased after all tokens get released \
      ✔ Event emission for VestedTokens 
   3) Withdraw function test cases \
      ✔ Non benificier can't withdraw \
      ✔ Only benificiar can withdraw \
      ✔ Withdrawable amount must be more than zero to withdraw \
      ✔ User balance should be increse after withdraw \
      ✔ Event Emission for WithdrawTokens 
#### Screenshot
![Screenshot from 2023-04-11 14-05-51](https://user-images.githubusercontent.com/122250819/231356806-379bf026-d0dd-497b-9563-da29017bedfe.png)


