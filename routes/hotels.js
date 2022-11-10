import express from "express";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  console.log("post /hotels... req.body: ", req.body);

  const newHotel = new Hotel(req.body);

  console.log("newHotel: ", newHotel);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  console.log("put /:id... req.body: ", req.body);
  console.log("req.params: ", req.params);

  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    console.log("updatedHotel: ", updatedHotel);
    res.status(200).json(updatedHotel);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL
router.get("/", async (req, res, next) => {
  console.log("hi im a hotel route");

  const failed = true;

  if (failed) {
    return next(createError(401, "You are not authenticated!"));
  }

  try {
    const hotels = await Hotel.findById("123123");
    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
});

export default router;
