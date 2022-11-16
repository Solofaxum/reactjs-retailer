import { useState, useEffect } from 'react';
import data from '../data/retailerApi';

export default function Retailer() {
    //current user transaction state 
    const [userTransactions, setUserTransactions] = useState([]);
    //Adding new transaction date state 
    const [newTransaction, setNewTransaction] = useState({ date: new Date(), amount: 0 });
    //state for the loaded data
    const [loadedData, setloadedData] = useState({});
    //Only list of avilable users
    const [users, setUsers] = useState([]);
    //Current user details state 
    const [currentUser, setCurrentUser] = useState("");
    //state for the user reward culculation
    const [userRewards, setCalcRewards] = useState({});


    {/* One time, during the first load, API call to the list of data and only user list */}
    useEffect(() => {
        setloadedData({ ...data });
        setUsers([...Object.keys(data)]);
    }, []);

    {/* This functionality hundles culculation of the reward to be consider */}
    const rewardHandler=(amount)=> {
        let rewards = 0;
        if (amount > 100) {
          rewards = (amount - 100) * 2;
        }
        if (amount > 50) {
          rewards = rewards + (amount - 50);
        }
        return rewards;
      
      }

    //selecting a specific user to see its details
    const userSelect = (value) => {
        setCurrentUser(value);
        let userData = loadedData[value];
        let transactionMonth = {
            1: {
                amounts: [],
                rewards: 0,
            },
            2: {
                amounts: [],
                rewards: 0,
            },
            3: {
                amounts: [],
                rewards: 0,
            }
        };
        for (let i = 0; i < userData.length; i++) {
            let month = new Date(userData[i]['date']);
            if (month.getMonth() + 1 == 1 || month.getMonth() + 1 == 2 || month.getMonth() + 1 == 3) {
                transactionMonth[month.getMonth() + 1]['amounts'].push(userData[i]['amount']);
            }
        }
        for (let key in transactionMonth) {
            let total_month_rewards = 0;
            for (let i = 0; i < transactionMonth[key]['amounts'].length; i++) {
                let amount = transactionMonth[key]['amounts'][i];

                total_month_rewards = total_month_rewards + rewardHandler(amount);
            }
            transactionMonth[key]['rewards'] = total_month_rewards;
        }

        setCalcRewards({ ...transactionMonth });
        setUserTransactions([...userData]);
    };

    const updateInput = (e) => {
        if (e.target.name === "date") {
            setNewTransaction({ ...newTransaction, ...{ date: e.target.value } });
        }
        if (e.target.name === "amount") {
            setNewTransaction({ ...newTransaction, ...{ amount: e.target.value } });
        }
    }

    const btnAddtransaction = () => {
        let data = { ...loadedData };
        let month = new Date(newTransaction['date']);
        if (month.getMonth() + 1 == 1 || month.getMonth() + 1 == 2 || month.getMonth() + 1 == 3) {
            data[currentUser].push(newTransaction);
            console.log(data)
            setloadedData({ ...data });

            userSelect(currentUser);
        }
        setNewTransaction({ date: new Date(), amount: 0 });
    }

    return (
        <div style={{
            marginTop: "20px",
            marginBottom: "50px",
            fontSize: "20px",
        }}>
            <h2 style={{ textAlign: "center" }}>User Transaction and reward details</h2>
            <div className="dropdown-container">
                <label>Select User : </label>

                <select onChange={e => userSelect(e.target.value)} value={currentUser} >
                    <option value="" disabled>Select User</option>
                    {users.map((item, index) => {
                        return (
                            <option key={index} value={item}> {item.toUpperCase()} </option>
                        );
                    })}
                </select>

            </div>
            {Object.keys(userRewards).length > 0 &&
                <>
                    {/* Input date and amount of new transaction to see for recent update */}
                    <div>
                        <h2>Add Transactions </h2>
                        <h4>Consider Transactions between 01/01/2020 and 03/31/2020</h4>
                        <label>Date : </label>
                        <input type="date" name="date" value={newTransaction.date} onChange={(e) => updateInput(e)}></input>
                        <label>Amount :</label>
                        <input type="number" name="amount" value={newTransaction.amount} onChange={(e) => updateInput(e)}></input>
                        <button type="button" onClick={() => btnAddtransaction()}>Add Transaction</button>
                    </div>

                    {/* user transaction all inclusive table */}
                    <h2>User Transactions</h2>
                    {userTransactions.length > 0 ?
                        <table className="customers">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Rewards</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userTransactions.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{item["date"]}</td>
                                        <td>{item["amount"]}</td>
                                        <td>{rewardHandler(item["amount"])}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                        : <div>No Transactions Found</div>}

                    {/* current accumulated reward table dysplay */}
                    <h2>Current  Accumlated Reward</h2>
                    <table className="customers">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Rewards</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1st Month</td>
                                <td>{userRewards[1]["rewards"]}</td>
                            </tr>
                            <tr>
                                <td>2nd Month</td>
                                <td>{userRewards[2]["rewards"]}</td>
                            </tr>
                            <tr>
                                <td>3rd Month</td>
                                <td>{userRewards[3]["rewards"]}</td>
                            </tr>

                            <tr>
                                <td>Total Reward</td>
                                <td>{userRewards[1]["rewards"] + userRewards[2]["rewards"] + userRewards[3]["rewards"]}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            }
        </ div >
    );
}