const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { restrictTo, checkForAuthentication } = require("./middlewares/auth");
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("mongodb connected ")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url", restrictTo(['NORMAL']), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
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
