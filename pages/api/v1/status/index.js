function status(request, response) {
  response.status(200).json({"status": "Olá Bruno!"});
}

export default status;