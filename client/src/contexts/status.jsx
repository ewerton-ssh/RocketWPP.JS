import { createContext, useEffect, useState} from "react";
import socket from "../services/socketio";

export const StatusContext = createContext({})

function StatusProvider ({ children }) {
    const [isReady, setIsReady] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      
      socket.on('clientisready', (data) => {
        if (data.message === 'clientisready') {
          setIsReady(true);
        }
      });

      socket.on('active', (data) => {
        if(data.message === "loading"){
          setLoading(true);
          setIsReady(true);
        } else if(data.message === "actived"){
          setIsReady(true);
          setLoading(false);
        } else if(data.message === "dead"){
          setIsReady(false);
        }
      });

    }, []);

    return(
        <StatusContext.Provider
        value={{
            isReady,
            loading,
            setLoading,
        }}
        >
            {children}
        </StatusContext.Provider>
    )
}

export default StatusProvider;