const express = require("express");
const router = express.Router();
const upload=require("../middlewire/uploads");
const verifyToken = require("../middlewire/authMiddleware");
const checkRole = require("../middlewire/roleMiddleware");
const addSeller = require("../controller/Seller/addSeller");
const { addMultiAdmin } = require("../controller/addMultiAdminData");
const addNumberToSeller = require("../controller/AddNumber/addNumber");
const { addLotteryType } = require("../controller/LottaryType/addLotteryType");
const { updateLotteryType } = require("../controller/LottaryType/updateLotteryType");
const deleteNumberToSeller = require("../controller/ReturnNumber/delete");
const paymentBluePrint = require("../controller/paymentBluePrint");
const paymentDay = require("../controller/Payment/payment");
const { getseller } = require("../controller/Seller/getSellers");
const { getlotteryType } = require("../controller/LottaryType//getLotteryType");
const getShiftByQuery = require("../getController/getShifts");
const { getPayments } = require("../controller/Payment/getPayments");
const addClient = require("../controller/Client/addClient");
const { getclient } = require("../controller/Client/getClient");
const { getDashboardStats } = require("../controller/getDashboardStats");
const { getpreviousDate } = require("../controller/Payment/getpreviousDate");
const sellerActive = require("../controller/Seller/sellerActive");
const lottaryActive = require("../controller/LottaryType/LottaryActive");
const { ticketRateDefine } = require("../controller/ticketRateDefine");

router.post("/addSeller", verifyToken, checkRole("superAdmin", "admin"), upload.single("image"), addSeller);
router.post("/addClient", verifyToken, checkRole("superAdmin", "admin"), upload.single("image"), addClient);
router.get("/getseller", verifyToken, checkRole("superAdmin", "admin"), getseller);
router.get("/getclient", verifyToken, checkRole("superAdmin", "admin"), getclient);

router.post("/addNumberToSeller", verifyToken, checkRole("superAdmin", "admin"), addNumberToSeller);

router.post("/shift", verifyToken, checkRole("superAdmin", "admin"), getShiftByQuery);

router.post("/toggleSellerActive/:id", verifyToken, checkRole("superAdmin"), sellerActive);
router.post("/toggleLottaryActive/:id", verifyToken, checkRole("superAdmin"), lottaryActive);

router.post("/ticketRateDefine",verifyToken,checkRole("superAdmin"),ticketRateDefine)

router.post("/addMiltiAdmin", verifyToken, checkRole("superAdmin"), addMultiAdmin);
router.post("/addLotteryType", verifyToken, checkRole("superAdmin"), addLotteryType);
router.put("/updateLotteryType", verifyToken, checkRole("superAdmin"), updateLotteryType);
router.get("/getlotteryType", verifyToken, checkRole("superAdmin", "admin"), getlotteryType);
router.post("/deleteNumberToSeller", verifyToken, checkRole("superAdmin", "admin"), deleteNumberToSeller);
router.post("/paymentBluePrint", verifyToken, checkRole("superAdmin", "admin"), paymentBluePrint);
router.post("/paymentDay", verifyToken, checkRole("superAdmin", "admin"), paymentDay);
router.get("/payments", verifyToken, checkRole("superAdmin", "admin"), getPayments);
router.get("/previousDatePayments", verifyToken, checkRole("superAdmin", "admin"), getpreviousDate);
router.get("/dashboard-stats", verifyToken, checkRole("superAdmin", "admin"), getDashboardStats);

module.exports = router;