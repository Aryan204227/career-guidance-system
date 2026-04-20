const mongoose = require('mongoose');

const uri = "mongodb+srv://aryandadwal709_db_careerAdminuser:CareerApp2026@cluster0.8ld6rge.mongodb.net/career_guidance?appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS! Connected to MongoDB Atlas.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("FAILED TO CONNECT:");
    console.error(err.message);
    process.exit(1);
  });
