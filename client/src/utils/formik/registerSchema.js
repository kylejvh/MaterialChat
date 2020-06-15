import * as Yup from "yup";

export default Yup.object().shape({
  username: Yup.string()
    .min(4, "Username must be 4 characters or more.")
    .max(50, "Username cannot be longer than 50 characters.")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password cannot be longer than 50 characters.")
    .required("Required"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match.")
    .required("Required."),
});
