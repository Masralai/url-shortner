const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("mongodb connected ")
);

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true }
  );
  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }
  console.log("Redirecting to:", entry.redirectURL);
  let redirectURL = entry.redirectURL;
  if (
    !redirectURL.startsWith("http://") &&
    !redirectURL.startsWith("https://")
  ) {
    redirectURL = "https://" + redirectURL;
  }

  res.redirect(redirectURL);
});

app.listen(PORT, () => console.log(`server started at PORT : ${PORT}`));
