module.exports = fn => {
  return (req, res, next) => {
    console.log("from catchasync");
    fn(req, res, next).catch(next);
  };
};
