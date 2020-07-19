// Use general Function for DRY
//! TODO - replace other emit functions
export default (event, payload) => {
  return {
    event,
    emit: true,
    payload,
  };
};
