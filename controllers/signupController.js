import { registerUser } from "../services/authService.js";

const renderSignupForm = (res, { values = {}, fieldErrors = {} } = {}) =>
  res.render("auth/signup", { layout: false, values, fieldErrors });

const getSignupForm = (_req, res) => renderSignupForm(res);

const signup = async (req, res, next) => {
  try {
    await registerUser(req.body);
    res.redirect("/login");
  } catch (err) {
    // Rejected input: show the form again with the errors, keeping what the user typed (except the password)
    if (err.statusCode === 400) {
      const { username = "", email = "" } = req.body;
      res.status(400);
      return renderSignupForm(res, { values: { username, email }, fieldErrors: err.fieldErrors });
    }
    next(err);
  }
};

export default {
  getSignupForm,
  signup
};
