import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
	const [book, setBook] = useState({
		name: "READ IT!",
		author: "Monthly subscription",
		img: "https://images.unsplash.com/photo-1563417994954-2736db3bf2c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
		price: 450,
	});

	const initPayment = (data) => {
		const options = {
			key: "#Key ID",
			amount: data.amount,
			currency: data.currency,
			name: book.name,
			description: "Test Transaction",
			image: book.img,
			order_id: data.id,
			handler: async (response) => {
				try {
					const verifyUrl = "http://localhost:8080/api/payment/verify";
					const { data } = await axios.post(verifyUrl, response);
					console.log(data);
				} catch (error) {
					console.log(error);
				}
			},
			theme: {
				color: "#3399cc",
			},
		};
		const rzp1 = new window.Razorpay(options);
		rzp1.open();
	};

	const handlePayment = async () => {
		try {
			const orderUrl = "http://localhost:8080/api/payment/orders";
			const { data } = await axios.post(orderUrl, { amount: book.price });
			console.log(data);
			initPayment(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="App">
			<div className="book_container">
				<img src={book.img} alt="book_img" className="book_img" />
				<p className="book_name">{book.name}</p>
				<p className="book_author">{book.author}</p>
				<p className="book_price">
					Price : <span>&#x20B9; {book.price}</span>
				</p>
				<button onClick={handlePayment} className="buy_btn">
					buy now
				</button>
			</div>
		</div>
	);
}

export default App;