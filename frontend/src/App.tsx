import './App.css'
import HealthFetcher from './components/HealthFetcher';
import { io } from 'socket.io-client';
import { useEffect,useState } from 'react';

function App() {
  
  const [alerts,setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', ()=>{
      console.log('Connected to Server');
    });

    socket.on('alert',(data)=>{
      console.log('Received alert', data);

      setAlerts((prev) => [...prev,data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Alerts</h1>
      {alerts.map((alert,index)=>(
        <div key={index}>
          <p>Processing Time: {alert.processingTime}</p>
          <p>Severity: {alert.severity}</p>
          <p>Timestamp: {alert.timestamp}</p>
          <hr />
        </div>
      ))}
    </div>
  )
};

export default App;
