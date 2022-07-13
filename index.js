const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const server = express();
require("dotenv").config();
const images = require("./models/ImageModel");
const imageJoiValidation = require("./validations/imageJoiValidation");

mongoose.connect(process.env.DB_PASSKEY, () => console.log("connected to db"));

server.use(cors());
server.use(express.json());

server.get("/", async (req, res) => {
  const searchQuery = req.query.query;
  const requestedPageNumber = req.query.page ? parseInt(req.query.page) : 1;
  const numbersOfResultInEachPage = 9;
  try {
    const filterQuery = {};
    if (searchQuery) {
      filterQuery.imageName = { $regex: searchQuery, $options: "gi" };
    }
    images.find(filterQuery, (err, doc) => {
      if (err) throw new Error();
      const result = {
        result: doc.slice(
          (requestedPageNumber - 1) * numbersOfResultInEachPage,
          requestedPageNumber * numbersOfResultInEachPage
        ),
        thisPage: requestedPageNumber,
        nextPage:
          doc.length > requestedPageNumber * numbersOfResultInEachPage
            ? requestedPageNumber + 1
            : null,
      };
      return res
        .status(200)
        .send({ message: "Images fetched successfully.", data: result });
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong.", data: err });
  }
});

server.get("/:id", async (req, res) => {
  try {
    images.findById(req.params.id, (err, doc) => {
      if (err) throw new Error();
      return res
        .status(200)
        .send({ message: "Image fetched successfully.", data: doc });
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong.", data: err });
  }
});

server.post("/", async (req, res) => {
  const newImage = req.body;
  try {
    const { error } = imageJoiValidation(newImage);
    if (error)
      return res.status(300).send({ message: error.details[0].message });
    const doc = await images.create(newImage);
    res
      .status(200)
      .send({ message: "Image uploaded successfully.", data: doc });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong.", data: err });
  }
});

server.put("/:id/edit", async (req, res) => {
  const { imageName, imageURL, description } = req.body;
  try {
    const update = {};
    if (imageName) {
      update.imageName = imageName;
    }
    if (imageURL) {
      update.imageURL = imageURL;
    }
    if (description) {
      update["imageDetails.description"] = description;
    }
    update["imageDetails.lastModifiedOn"] = new Date();
    images.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true },
      (err, doc) => {
        if (err) throw new Error();
        res
          .status(200)
          .send({ message: "Image edited successfully.", data: doc });
      }
    );
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong.", data: err });
  }
});

server.delete("/delete/:id", async (req, res) => {
  try {
    images.findByIdAndDelete(req.params.id, (err, doc) => {
      if (err) throw new Error();
      res
        .status(200)
        .send({ message: "Image deleted successfully.", data: doc });
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong.", data: err });
  }
});

server.listen(3001);
