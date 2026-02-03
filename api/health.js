// Health Check Endpoint
// Used to verify the API is running

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  return res.status(200).json({
    status: "healthy",
    service: "ANT Supply API",
    timestamp: new Date().toISOString(),
  });
}
