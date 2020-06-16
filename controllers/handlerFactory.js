const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAll = (Model, filtered = null) =>
  catchAsync(async (req, res, next) => {
    let modelFindQuery = Model.find();

    if (filtered) {
      let filter = {};
      if (req.params.chatroomId) filter = { chatroom: req.params.chatroomId };
      modelFindQuery = Model.find(filter);
    }

    const features = new APIFeatures(modelFindQuery, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID or name", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document with specified ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = await Model.create(req.body);
    if (popOptions) query = await query.populate(popOptions).execPopulate();

    const newDoc = await query;

    if (!newDoc) {
      return next(new AppError("No document received", 404));
    }

    res.status(201).json({
      status: "success",
      data: {
        newDoc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(
        new AppError("No document found with the specified ID.", 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });
