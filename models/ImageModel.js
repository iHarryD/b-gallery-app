const mongoose = require("mongoose");

const Image = new mongoose.Schema({
  imageDetails: {
    type: {
      description: {
        type: String,
        required: true,
      },
      uploadedOn: {
        type: Date,
        required: true,
      },
      lastModifiedOn: {
        type: Date,
        required: true,
      },
    },
    required: true,
  },
  imageName: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("images", Image);
