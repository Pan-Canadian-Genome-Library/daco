import { useState } from 'react';
import './App.css';

const demoApplication = { title: 'Project Setup' };

function App() {
	const [application, setApplication] = useState({ title: '' });

	return (
		<>
			<div>
				<img src={'./pcgl-logo.png'} className="logo" alt="PCGL Logo" />
			</div>
			<h1>Pan Canadian Genomic Library DACO</h1>
			<div className="card">
				<button onClick={() => setApplication(demoApplication)}>
					Start an Application
				</button>
			</div>
			<div className="card">{application.title}</div>
		</>
	);
}

export default App;
