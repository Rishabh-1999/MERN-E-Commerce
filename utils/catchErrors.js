function catchErrors(error, displayError) {
  let errorMsg;
  if (error.respond) {
    errorMsg = error.respond.data;
    console.error("Error Response", errorMsg);
    if (error.respond.data.error) {
      errorMsg = error.respond.data.error.message;
    }
  } else if (error.request) {
    errorMsg = error.request;
    console.error("Error request", errorMsg);
  } else {
    errorMsg = error.message;
    console.error("Error Message", errorMsg);
  }
  displayError(errorMsg);
}

export default catchErrors;
