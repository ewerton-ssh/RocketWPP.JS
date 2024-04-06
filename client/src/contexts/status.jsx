import { createContext, useEffect, useState} from "react";
import socket from "../services/socketio";

export const StatusContext = createContext({})

function StatusProvider ({ children }) {
    const [actived, setActived] = useState({});

    useEffect(() => {

      socket.on('active', (data) => {
        setActived(data.activedSessions);
      });

    }, [actived]);

    return(
        <StatusContext.Provider
        value={{
            actived
        }}
        >
            {children}
        </StatusContext.Provider>
    )
}

export default StatusProvider;