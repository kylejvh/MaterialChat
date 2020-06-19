import * as Yup from "yup";

// Only requires password when forgotPassword === false
// forgotPassword defaults to false for login purposes.
export default Yup.object().shape({
  email: Yup.string().email("Invalid email.").required("Required"),
  password: Yup.string().when("forgotPassword", {
    is: true,
    then: Yup.string().notRequired(),
    otherwise: Yup.string()
      .min(8, "Password must be at least 8 characters.")
      .max(50, "Password cannot be longer than 50 characters.")
      .required("Required"),
  }),
  forgotPassword: Yup.boolean().required(),
});
