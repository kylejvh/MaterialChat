import io from "socket.io-client";

export default function socketMiddleware() {
  const socketUrl = "http://localhost:3100";
  const socket = io(socketUrl);

  return ({ dispatch }) => next => action => {
    if (typeof action === "function") {
      return next(action);
    }

    const { event, leave, handle, emit, payload, ...rest } = action;

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
      handleEvent = result => {
        dispatch({ type: handle, payload: result, ...rest });
      };
    }
    return socket.on(event, handleEvent);
  };
}
