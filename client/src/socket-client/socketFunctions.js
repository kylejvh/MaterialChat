// Use general Function for DRY
//! TODO - replace other emit functions
export const emitSocketEvent = (event, payload) => {
  return {
    event,
    emit: true,
    payload,
  };
};

export const removeSocketListener = (event) => {
  return {
    event,
    leave: true,
  };
};
