const service = require("../services/maintenance.service");

exports.createRequest = async (req, res) => {
  try {
    const request = await service.createRequest(req.body);
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create request" });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await service.getAllRequests();
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};
