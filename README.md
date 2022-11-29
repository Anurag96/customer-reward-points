# UI Developer Problem
```
A retailer offers a rewards program to its customers, awarding points based on each recorded purchase.

A customer receives 2 points for every dollar spent over $100 in each transaction, plus 1 point for every dollar spent between $50 and $100 in each transaction.
(e.g. a $120 purchase = 2x$20 + 1x$50 = 90 points).
 
Given a record of every transaction during a three month period, calculate the reward points earned for each customer per month and total.
 

Use React JS (do not use TypeScript)
Simulate an asynchronous API call to fetch data
Make up a data set to best demonstrate your solution
Check solution into GitHub
```
## Prerequisite

1. Node
2. React-script

## Performed steps to run the application

1. npm install to install the node module
2. Run the npm start to start the application. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## App Description:

1. Created rewardService.js inside api/ folder where to we fetch the transaction data
2. After fetching the data we display data on 2 table.
    - Points Rewards by Customer for last 3 Months
    - Points Rewards Totals By Customer


