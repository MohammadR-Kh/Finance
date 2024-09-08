import {useForm} from "react-hook-form"
import { useState, useEffect } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup"

const Transactions = () => {

  const [transactions, setTransactions] = useState([]);

  const [isFormVisible, setIsFormVisible] = useState(false);

  const [isEditVisible, setIsEditVisible] = useState(false);

  const [editingTransaction, setEditingTransaction] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        setLoading(false);
      } else {
        console.error("Failed to fetch transactions");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const schema = yup.object().shape({
    date: yup
      .date().typeError("Date is Wrong!")
      .required("Date is Required!")
      .max(new Date(), "Date cannot be in the future"),
    description: yup.string().required("Description is Required!"),
    category: yup.string().required("Category is Required!"),
    amount: yup
      .number()
      .typeError("Amount must be a number!")
      .required("Amount is Required!"),
    type: yup.string().required("You Must Select a Type!")
  });

  const {register, handleSubmit, formState: {errors}} = useForm({resolver: yupResolver(schema)});



  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newTransaction = await response.json();
        setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
        setIsFormVisible(false);
      } else {
        console.error("Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };
  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setTransactions(transactions.filter((transaction) => transaction._id !== id));
      } else {
        console.error('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  

  const AddNewTransaction = ({ onClose }) => {

    return(
      <div className="overlay">
        <form onSubmit={handleSubmit(onSubmit)} className="new-transaction">
          <label>Date:</label>
          <input type="date" placeholder="Date" {...register("date")}/>
          <p>{errors.date?.message}</p>
          <label>Description:</label>
          <input type="text" placeholder="Description" {...register("description")}/>
          <p>{errors.description?.message}</p>
          <label>Category:</label>
          <input type="text" placeholder="Category" {...register("category")}/>
          <p>{errors.category?.message}</p>
          <label>Amount:</label>
          <input type="number" placeholder="Amount" {...register("amount")}/>
          <p>{errors.amount?.message}</p>
          <label>Type:</label>
          <select {...register("type")}>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <p>{errors.type?.message}</p>
          <button type="submit" className="submit">OK</button>
          <button type="button" onClick={onClose} className="cancel">Cancel</button>
        </form>
      </div>

    )
  }

  const EditTransaction = ({ onClose, transaction }) => {

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
      resolver: yupResolver(schema),
    });

    useEffect(() => {
      if (transaction) {
        setValue("date", new Date(transaction.date).toISOString().split('T')[0]);
        setValue("description", transaction.description);
        setValue("category", transaction.category);
        setValue("amount", transaction.amount);
        setValue("type", transaction.type);
      }
    }, [transaction, setValue]);

    const onEditSubmit = async (data) => {
      try {
        const response = await fetch(`http://localhost:5000/api/transactions/${transaction._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
    
        if (response.ok) {
          const updatedTransaction = await response.json();
          setTransactions(prevTransactions =>
            prevTransactions.map(tr => tr._id === transaction._id ? updatedTransaction : tr)
          );
          onClose();
        } else {
          console.error("Failed to update transaction");
        }
      } catch (error) {
        console.error("Error updating transaction:", error);
      }
    };

    return(
      <div className="overlay">
        <form onSubmit={handleSubmit(onEditSubmit)} className="new-transaction">
          <label>Date:</label>
          <input type="date" placeholder="Date" {...register("date")}/>
          <p>{errors.date?.message}</p>
          <label>Description:</label>
          <input type="text" placeholder="Description" {...register("description")}/>
          <p>{errors.description?.message}</p>
          <label>Category:</label>
          <input type="text" placeholder="Category" {...register("category")}/>
          <p>{errors.category?.message}</p>
          <label>Amount:</label>
          <input type="number" placeholder="Amount" {...register("amount")}/>
          <p>{errors.amount?.message}</p>
          <label>Type:</label>
          <select {...register("type")}>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <p>{errors.type?.message}</p>
          <button type="submit" className="submit">OK</button>
          <button type="button" onClick={onClose} className="cancel">Cancel</button>
        </form>
      </div>

    )
  }

  return(
    <div className="transactions">
      <div className="transactions-header">
        <h2>Transactions:</h2>
        <button className="add-transaction-button" onClick={() => setIsFormVisible(true)}>+Add Transaction</button>
      </div>
      {isFormVisible && <AddNewTransaction onClose={() => setIsFormVisible(false)} />}
       {loading ? (
        <div className="loading">Loading...</div>
       ) : (
        <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('date')}>Date</th>
            <th onClick={() => requestSort('description')}>Description</th>
            <th onClick={() => requestSort('category')}>Category</th>
            <th onClick={() => requestSort('amount')}>Amount</th>
            <th onClick={() => requestSort('type')}>Type</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{new Date(transaction.date).toISOString().split('T')[0]}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.type}</td>
              <td>
                <button onClick={() => {setIsEditVisible(true);
                   setEditingTransaction(transaction);}} className="edit-transaction">
                  Edit
                </button>
                {isEditVisible && (
                <EditTransaction
                  onClose={() => setIsEditVisible(false)}
                transaction={editingTransaction}
                />
                )}
              </td>
              <td>
                <button
                  className="delete-transaction"
                  onClick={() => deleteTransaction(transaction._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
       )} 
    </div>
  )
};

export default Transactions;