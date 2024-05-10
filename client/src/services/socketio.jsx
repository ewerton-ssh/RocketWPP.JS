import io from "socket.io-client";
import data from "../../public/host.json"

const socket = io.connect(
    `${data.ip}`,
{});

export default socket;