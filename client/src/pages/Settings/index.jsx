import { useEffect, useState } from "react";
import Header from "../../components/Header";
import socket from "../../services/socketio";
import "./settings.css";
import { toast } from "react-toastify";

export default function Settings() {

    const [id, setId] = useState('');
    const [token, setToken] = useState('');
    const [ip, setIp] = useState('');
    const data = {
        _id: 1234567890,
        id: id,
        token: token,
        ip: ip
    }

    useEffect(() => {
        socket.emit("viewSetting");
        socket.on("viewerSetting", (data) => {
            setId(data.id);
            setToken(data.token);
            setIp(data.ip);
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
                        <p>Webhook: http://adress:port/rocketjs-webhook</p>
                        <p>For integration, trigger is "enviawpp", use the format "enviawpp number, msg" for start new whatsapp chat.</p>
                        <button className='loginButton' type="submit" onClick={handleSettings}>Save</button>
                    </form>
                </div>
        </>
    )
}
