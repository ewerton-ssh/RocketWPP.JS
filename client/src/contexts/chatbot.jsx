import { createContext, useState, useEffect} from "react";

export const BotContext = createContext({})

function BotProvider ({ children }) {

    const [botId, setBotId] = useState(localStorage.getItem('number') || '');

    function chatId(value){
        setBotId(value);
    }

    useEffect(() => {
        localStorage.setItem('number', botId);
    }, [botId]);

    return(
        <BotContext.Provider
        value={{
            chatId,
            botId,
        }}
        >
            {children}
        </BotContext.Provider>
    )
}

export default BotProvider;