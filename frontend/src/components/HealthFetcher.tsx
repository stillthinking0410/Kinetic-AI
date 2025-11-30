
import {useState,useEffect} from "react";

type HealthStatus = {
    status: string;
    time: string;
};

function HealthFetcher() {
    const [loading,setLoading] = useState<boolean>(true);
    const [data, setData] = useState<HealthStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        const controller = new AbortController();
        const signal = controller.signal;

        async function checkHealth(){
            setLoading(true);
            setError(null);

            try{
                const res = await fetch('http://localhost:3000/health',{signal});
                if(!res.ok){
                    throw new Error(`HTTP ${res.status} ${res.statusText}`);
                }
                const json = (await res.json()) as HealthStatus;
                setData(json);
            } catch (err: any){
                if(err.name === 'AbortError'){
                    console.log('Health fetch aborted');
                }
                else {
                    console.log('Health fetch error:', err);
                    setError(err.message || 'Unknown error');
                }
            } finally {
                setLoading(false);
            }
        }
        checkHealth();

        return () => {
            controller.abort();
        };

       },[]);

    return (
        <div style={{padding:8, fontFamily:"sans-serif"}}>
            {loading && <div>Checking Backend status..</div>}

            {!loading && error && (
                <div style={{ color: 'crimson' }}>
                    Backend error: {error}
                </div>
            )}

            {!loading && data && (
                <div style={{ color: 'green' }}>
                    Backend: {data.status} — {new Date(data.time).toLocaleString()}
                </div>
            )}
        </div>
    )
};
export default HealthFetcher;