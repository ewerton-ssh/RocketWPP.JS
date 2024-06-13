import io from "socket.io-client";
import data from "../../json/host.json"

const socket = io.connect(
    `${data.ip}`,
{});

export default socket;