import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    // Room 저장
    const savedRoom = await newRoom.save();

    try {
      // hotelid 파라미터로 Hotel을 찾고 저장된 Room의 id를 rooms 배열에 추가
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }

    // 저장된 Room을 JSON으로 응답
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

export const updateRoomAvailability = async (req, res, next) => {
  console.log("updateRoomAvailability...");
  console.log("req.body.dates: ", req.body.dates);

  try {
    // roomNumbers 배열의 각 객체에서 req.params.id (room number)와 일치하는 _id를 검색
    // 이 Room 자체의 id가 아니라 이 Room의 인스턴스 (몇호인지) 를 찾음
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        // roomNumbers 배열의 unavailableDates 배열에 req.body.dates 추가
        // 클라이언트에서 보낸 dates (숙박할 기간)를 해당 방호수의 unavailableDates에 dates (숙박할 기간)를 추가
        // 클라이언트에서는 객실 (Room)의 각 방의 호수 (roomNumber)의 unavailableDates에 지정한 숙박할 기간 (dates)이 포함되어 있다면 객실 호수 체크박스를 비활성화함
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );

    res.status(200).json("Room 상태가 업데이트 되었습니다.");
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  const roomId = req.params.id;
  const hotelId = req.params.hotelid;

  try {
    await Room.findByIdAndDelete(roomId);

    try {
      // hotelid로 호텔을 찾고 rooms 배열에서 해당 roomId를 제거
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: roomId },
      });
    } catch (err) {
      next(err);
    }

    res.status(200).json("Room has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};
