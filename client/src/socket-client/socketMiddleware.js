import io from "socket.io-client";
import { SOCKET_CONNECTED, SOCKET_DISCONNECTED } from "../actions/types";

export default function socketMiddleware() {
  let socketUrl;
  if (process.env.NODE_ENV === "production") {
    socketUrl = "";
  } else {
    socketUrl = "http://localhost:3100";
  }

  const socket = io(socketUrl);

  return ({ dispatch }) => (next) => (action) => {
    if (typeof action === "function") {
      return next(action);
    }

    const { event, leave, handle, emit, payload, ...rest } = action;

    // const onConnect = (dispatch) => {
    //   console.log("socket connection established", socket.id);
    //   return socket.on("connect", () =>
    //     dispatch({ type: SOCKET_CONNECTED, payload: socket.id })
    //   );
    // };

    // const onDisconnect = (dispatch) => {
    //   console.log("socket disconnected", socket.id);
    //   return socket.on("disconnect", (reason) =>
    //     dispatch({ type: SOCKET_DISCONNECTED })
    //   );
    // };

    // onConnect();
    // onDisconnect();

    if (!event) {
      return next(action);
    }

    if (leave) {
      socket.removeListener(event);
    }

    if (emit) {
      socket.emit(event, payload);
      return;
    }

    let handleEvent = handle;
    if (typeof handleEvent === "string") {
      handleEvent = (result) => {
        if (event === "connect") {
          result = socket.id;
        }
        dispatch({ type: handle, payload: result, ...rest });
      };
    }
    return socket.on(event, handleEvent);
  };
}
