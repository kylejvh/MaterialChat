// this component should keep track of users selected and states of chatroom?
// you can have a mock login, then store users in localstorage, and have a logout button.

//! I'd rather have persistent usernames than character selection, so we'll hold off on that for now.

import React, { useEffect } from "react";
import useLocalStorage from "react-use-localstorage";

const UserSelect = (userName, callback) => {
  const [userId, setUserId] = useLocalStorage("id", "");
  //! Not sure where below code belongs yet.
  useEffect(() => {
    if (userId !== "") {
      socket.emit("join", userId, room);
    }
  });

  //   if (!clientManager.isUserAvailable(userName))
  //     return callback("user is not available");

  //   const user = clientManager.getUserByName(userName);
  //   clientManager.registerClient(client, user);

  //   return callback(null, user);
  // };

  return <></>;
};

export default UserSelect;
