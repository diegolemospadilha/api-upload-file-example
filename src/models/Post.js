const moongoose = require("mongoose");
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const PostSchema = new moongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createAt: {
    type: Date,
    default: Date.now
  }
});

PostSchema.pre("save", function() {
  if (!this.url) {
    this.url = `${process.env.API_URL}/files/${this.key}`;
  }
});

PostSchema.pre("remove", function() {
  console.log("p ", process.env.STORAGE_TYPE);
  if (process.env.STORAGE_TYPE == "s3") {
    return s3
      .deleteObject({
        Bucket: "upload-file-lp-api",
        Key: this.key
      })
      .promise();
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
    );
  }
});

module.exports = moongoose.model("Post", PostSchema);
