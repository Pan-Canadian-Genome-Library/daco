import { useState } from 'react';
import './App.css';

function App() {
	const [application, setApplication] = useState({ title: '' });

	const getApplication = async () => {
		const response = await fetch('http://localhost:3000/applications');
		const application = await response.json();

		setApplication(application);
	};

	return (
		<>
			<div>
				<img src={'./pcgl-logo.png'} className="logo" alt="PCGL Logo" />
			</div>
			<h1>Pan Canadian Genomic Library DACO</h1>
			<div className="card">
				<button onClick={() => getApplication()}>Start an Application</button>
			</div>
			<div className="card">{application.title}</div>
		</>
	);
}

export default App;
