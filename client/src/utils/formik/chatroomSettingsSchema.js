import * as Yup from "yup";

export const editChatroomSchema = Yup.object().shape({
  chatroomName: Yup.string()
    .min(4, "Username must be 4 characters or more.")
    .max(50, "Username cannot be longer than 50 characters.")
    .required("Required"),
});

export const deleteChatroomSchema = (stateVal) =>
  Yup.object().shape({
    confirmChatroomName: Yup.string()
      .matches(stateVal, "Does not match chatroom name")
      .required("Required"),
  });
