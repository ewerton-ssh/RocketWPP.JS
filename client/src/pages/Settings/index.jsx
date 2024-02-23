import { useEffect, useState } from "react";
import Header from "../../components/Header";
import socket from "../../services/socketio";
import "./settings.css";
import { toast } from "react-toastify";

export default function Settings() {

    const [id, setId] = useState('');
    const [token, setToken] = useState('');
    const [ip, setIp] = useState('');
    const [minutes, setMinutes] = useState(5);
    const data = {
        _id: 1234567890,
        id: id,
        token: token,
        ip: ip,
        minutes: minutes
    }

    useEffect(() => {
        socket.emit("viewSetting");
        socket.on("viewerSetting", (data) => {
            setId(data.id);
            setToken(data.token);
            setIp(data.ip);
            setMinutes(data.minutes);
        });

        return () => {
            socket.off("viewerSetting");
        };
    }, []);

    function handleSettings(){
        if(id === '' && token === '' && ip === ''){
            toast.error("empty field");
        } else {
            socket.emit('saveSettings', { data });
        }
    }


    return(
        <>
        <Header />
            <div className="container">
                    <form className="form-profile">
                        <h3>Settings</h3>
                        <label>Rocket Admin User ID</label>
                        <input type="text"  placeholder='ID' value={id} onChange={(e) => setId(e.target.value)}/>
                        <label>Token</label>
                        <input type="text"  placeholder='Token' value={token} onChange={(e) => setToken(e.target.value)} />
                        <label>IP/Port</label>
                        <input type="text"  placeholder='IP/Port' value={ip} onChange={(e) => setIp(e.target.value)}/>
                        <label>Minutes for close chat</label>
                        <input type="number"  placeholder='minutes' value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value))}/>
                        <p>Webhook: http://adress:port/rocketjs-webhook</p>
                        <p>New chat URL: http://adress:port/start-chat</p>
                        <p>For integration, trigger is &quot;enviawpp&quot;, use the format &quot;enviawpp number, msg&quot; for start new whatsapp chat.</p>
                        <button className='loginButton' type="submit" onClick={handleSettings}>Save</button>
                    </form>
                </div>
        </>
    )
}
