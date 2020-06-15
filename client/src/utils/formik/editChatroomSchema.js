import * as Yup from "yup";

export default Yup.object().shape({
  chatroomName: Yup.string()
    .min(4, "Username must be 4 characters or more.")
    .max(50, "Username cannot be longer than 50 characters.")
    .required("Required"),
});
