const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");

// Get user id and upgrade user's account priveledges?

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1.) Get current user.
  const user = await User.findById(req.user._id);

  // 2.) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.userId,
    line_items: [
      {
        name: "MaterialChat Premium",
        description: "Uprade your account for premium features.",
        // images: []  Future use - specify images if needed,
        amount: 999,
        currency: "usd",
        quantity: 1,
      },
    ],
  });

  // 3.) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});
