import React, { useState, useEffect } from "react";
import fetch from './api/rewardService';
import ReactTable from 'react-table-6';
import "./App.css";
import _ from 'lodash';
import "react-table-6/react-table.css" 


function calculateRewards(incomingData) {
  const months = ["January", "Februray", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const transactionPoints = incomingData.map(transaction=> {
    let points = 0;
    let over100 = transaction.amount - 100;
    
    if (over100 > 0) {   
      points += (over100 * 2);
    }    
    if (transaction.amount > 50) {
      points += 50;      
    }
    const month = new Date(transaction.transactionDate).getMonth() + 1;
    return {...transaction, points, month};
  });
               
  let customer = {};
  let totalPointsEarned = {};
  transactionPoints.forEach(transactionPoints => {
    let {custid, name, month, points} = transactionPoints;   
    if (!customer[custid]) {
      customer[custid] = [];      
    }    
    if (!totalPointsEarned[name]) {
      totalPointsEarned[name] = 0;
    }
    totalPointsEarned[name] += points;
    if (customer[custid][month]) {
      customer[custid][month].points += points;
      customer[custid][month].monthNumber = month;
      customer[custid][month].numTransactions++;      
    }
    else {
      
      customer[custid][month] = {
        custid,
        name,
        monthNumber:month,
        month: months[month-1],
        numTransactions: 1,        
        points
      }
    }    
  });
  let tot = [];
  for (var custKey in customer) {   
    customer[custKey].forEach(cRow=> {
      tot.push(cRow);
    });    
  }
  let totalByCustomer = [];
  for (custKey in totalPointsEarned) {    
    totalByCustomer.push({
      name: custKey,
      points: totalPointsEarned[custKey]
    });    
  }
  return {
    summaryByCustomer: tot,
    transactionPoints,
    totalPointsEarned:totalByCustomer
  };
}

function App() {
  const [transactionData, setTransactionData] = useState(null);
  
  const columns = [
    {
      Header:'Customer',
      accessor: 'name'      
    },    
    {
      Header:'Month',
      accessor: 'month'
    },
    {
      Header: "No. of Transactions",
      accessor: 'numTransactions'
    },
    {
      Header:'Reward Points',
      accessor: 'points'
    }
  ];
  const totalsByColumns = [
    {
      Header:'Customer',
      accessor: 'name'      
    },    
    {
      Header:'Points',
      accessor: 'points'
    }
  ]

  function getEachTransactions(row) {
    let byCustMonth = _.filter(transactionData.transactionPoints, (tRow)=>{    
      return row.original.custid === tRow.custid && row.original.monthNumber === tRow.month;
    });
    return byCustMonth;
  }

  useEffect(() => { 
    fetch().then((data)=> {     
      const currentmonth = new Date().getMonth() + 1;
      data = data.filter(dataObj => {
        const month = new Date(dataObj.transactionDate).getMonth() + 1;
        return month ? month<=currentmonth && month>=(currentmonth-2): false
      })       
      const results = calculateRewards(data);      
      setTransactionData(results);
    });
  },[]);

  if (transactionData == null) {
    return <div></div>;   
  }
  return transactionData == null ?<div></div>:
  <><div className="row">      
  <div className="col-sm-6">
   <div className="row ml-3">
     <div className="col-11 mx-5 my-4">
       <h4>Points Rewards by Customer for last 3 Months</h4>
     </div>
   </div>
   <div className="row ml-3">
     <div className="col-11">
       <ReactTable
         data={transactionData.summaryByCustomer}
         defaultPageSize={5}
         columns={columns}
         SubComponent={row => {
           return (
             <div>
               
                 {getEachTransactions(row).map(tran=>{
                   return <div className="container">
                     <div className="row">
                       <div className="col-8">
                         <strong>Transaction Date:</strong> {tran.transactionDate} || <strong>Amount:</strong> ${tran.amount} || <strong>Points: </strong>{tran.points}
                       </div>
                     </div>
                   </div>
                 })}                                    

             </div>
           )
         }}
         />             
       </div>
     </div>
   </div>
   
   <div className="col-sm-6">    
     <div className="row">
       <div className="col-11 mx-5 my-4">
         <h4>Total Reward points earned for each customer</h4>
       </div>
     </div>      
     <div className="row">
       <div className="col-11">
         <ReactTable
           data={transactionData.totalPointsEarned}
           columns={totalsByColumns}
           defaultPageSize={6}                
         />
       </div>
     </div>
   </div>      
</div></>
  ;
}

export default App;

