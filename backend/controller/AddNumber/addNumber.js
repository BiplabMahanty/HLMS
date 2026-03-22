
const ShiftModel = require("../../models/shift")
const TicketModel = require("../../models/dallyTickets")
const LotteryTypeModel = require("../../models/lotteryType")
const MultiAdminModel = require("../../models/multiAdmin")

//fix the date problem ;
//add stokit number check;
//if the number is same give the notification also
const addNumberToSeller = async (req, res) => {
    try {
        const { sellerId, lotteryTypeId, startNumber, endNumber, category,today } = req.body;

        if ( !lotteryTypeId ) {
            return res.status(400).json({ error: "All fields1 are required." });
        }
        if (!category) {
            return res.status(400).json({ error: "All fields2 are required." });
        }
        if (!sellerId ) {
            return res.status(400).json({ error: "All fields3 are required." });
        }

        // Convert to numbers for proper validation
        const startNum = Number(startNumber);
        const endNum = Number(endNumber);

        if (isNaN(startNum) || isNaN(endNum)) {
            return res.status(400).json({ error: "সংখ্যাগুলি বৈধ হতে হবে।" });
        }

        if (String(startNum).length !== 5) {
            return res.status(400).json({ error: "শুরু নম্বর ঠিক ৫ অঙ্ক হতে হবে।g" });
        }

        // adjust end when it's smaller than start by taking the start number's leading digits
        // (drop only the last digit of start, then append the end value regardless of its length)
        // let adjustedEndNum = endNum;
        // if (endNum < startNum) {
        //     const startStr = String(startNum);
        //     const prefix = startStr.slice(0, startStr.length - 1);
        //     adjustedEndNum = Number(prefix + String(endNum));
        //     console.log("adjusted endNum from", endNum, "to", adjustedEndNum);
        // }

        // // Prevent massive arrays that cause stack overflow
        // if (adjustedEndNum - startNum > 1000) {
        //     return res.status(400).json({ error: "সর্বোচ্চ ১০০০ টিকিট একবারে যোগ করতে পারেন।" });
        // }

        // // final check: adjusted end must be greater than start
        // if (adjustedEndNum <= startNum) {
        //     return res.status(400).json({ error: "শেষ নম্বর শুরু নম্বরের থেকে বড় হতে হবে।" });
        // }

        // console.log("testing>>>", "startNum:", startNum, "adjustedEndNum:", adjustedEndNum, "range:", adjustedEndNum - startNum);
        const lotteryType = await LotteryTypeModel.findById(lotteryTypeId)
        if (!lotteryType) {
            return res.status(400).json({ error: "lottery not find " });
        }

        const amountPerNumberDoc = await MultiAdminModel.findOne();
        if (!amountPerNumberDoc) {
            return res.status(400).json({ error: "Amount per number not set in admin settings." });
        }

        const validCategories = ["thirtySem", "fiveSem", "tenSem", "hundredSem", "twoHundredSem", "fiftySem"];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: "অবৈধ বিভাগ" });
        }

        console.log("Received add number request:", { sellerId, lotteryTypeId, startNum, endNum, category, today });

        // Format as 5-digit integer for storage
        const pad5 = (num) => num.toString().padStart(5, "0");

        // Adjust end number by filling with start's prefix
        let adjustedEndNum = endNum;
        const endLength = String(endNum).length;
        if (endLength < 5) {
            const startStr = String(startNum);
            const prefix = startStr.slice(0, 5 - endLength);
            adjustedEndNum = Number(prefix + String(endNum));
        }

        let start = Number(pad5(startNum));
        let end = Number(pad5(adjustedEndNum));

        console.log("after padding >>", "start:", start, "end:", end);



        // // Pick correct model
        // let numberModel;
        // if (numberType === "morning") numberModel = MorningNumberModel;
        // else if (numberType === "day") numberModel = DayNumberModel;
        // else if (numberType === "night") numberModel = NightNumberModel;
        // else return res.status(400).json({ error: "Invalid numberType." });

        // let sellNumberModel;
        // if (numberType === "morning") sellNumberModel = SellMorningModel;
        // else if (numberType === "day") sellNumberModel = SellDayModel;
        // else if (numberType === "night") sellNumberModel = SellNightModel;
        // else return res.status(400).json({ error: "Invalid numberType." });

        // Create number list
        const generatedNumbers = [];
        for (let i = start; i <= end; i++) {
            generatedNumbers.push(i);
        }

        /*
         * 🚫 GLOBAL DUPLICATE CHECK
         * If ANY seller (not just current seller) already has these
         * numbers on the same dateAdded + numberType => BLOCK
         */

        let shifts = await ShiftModel.find(
            { dateKey: today },
            { sellTickets: 1 }
        );

        let globalUsed = new Set();

        shifts.forEach(shift => {
            const sellTickets = shift.sellTickets;
            if (!sellTickets) return;

            validCategories.forEach(cat => {
                if (Array.isArray(sellTickets[cat])) {
                    sellTickets[cat].forEach(num =>
                        globalUsed.add(Number(num))
                    );
                }
            });
        });


        const globalDuplicates = generatedNumbers.filter(num => globalUsed.has(num));

        if (globalDuplicates.length > 0) {
            return res.status(400).json({
                error: "আজকের জন্য কিছু টিকিট নম্বর ইতিমধ্যেই অন্য বিক্রেতা নিয়ে নিয়েছেন।",
                duplicateNumbers: globalDuplicates
            });
        }

        let shift = await ShiftModel.findOne({
            dateKey: today,
            sellerId,
            lotteryTypeId
        });

        if (!shift) {
            shift = await ShiftModel.create({
                lotteryTypeId,
                name: lotteryType.name,
                sellerId,
                dateKey: today,
                sellTickets: {
                    thirtySem: [],
                    fiveSem: [],
                    tenSem: [],
                    hundredSem: [],
                    twoHundredSem: [],
                    fiftySem: [],   
                    amountPerNumber:amountPerNumberDoc.ticketRate,

                }
            });
        }

        
        // Find or create seller-based doc
        let numberDoc = await TicketModel.findOne({ shiftId: shift._id, dateAdded: today });

        if (!numberDoc) {
            numberDoc = new TicketModel({
               
                shiftId:shift._id,

                dateAdded: today,
                thirtySem: [],
                fiveSem: [],
                tenSem: [],
                hundredSem: [],
                twoHundredSem: [],
                fiftySem: [],
                totalNumberAmount: 0,
                amountPerNumber: amountPerNumberDoc.ticketRate
            });
        }

        // let sellNumberDoc = await sellNumberModel.findOne({ sellerId: seller._id, dateAdded: today });
        // if (!sellNumberDoc) {
        //     sellNumberDoc = new sellNumberModel({
        //         sellerId: seller._id,
        //         numberId: numberDoc._id,
        //         dateAdded: today,
        //         thirtySem: [], 
        //         fiveSem: [],
        //         tenSem: [],
        //         hundredSem: [],
        //         twoHundredSem: [],
        //         fiftySem: [],
        //         totalSell: 0
        //     });
        // }
        const sellNumberDoc = shift.sellTickets;


        if (!Array.isArray(numberDoc[category])) {
            numberDoc[category] = [];
        }

        // Local duplicate check
        const existingNumbers = sellNumberDoc[category].map(n => Number(n));
        const uniqueNumbers = generatedNumbers.filter(num => !existingNumbers.includes(num));

        if (uniqueNumbers.length === 0) {
            return res.status(400).json({ error: `yours start number :${start},end number :${end} Check it  ` });
        }

        numberDoc[category].push(...uniqueNumbers);

        // Recalculate total amount
        const totalNumbers =
            numberDoc.thirtySem.length * amountPerNumberDoc.sem25Num +
            numberDoc.fiveSem.length * amountPerNumberDoc.sem5Num +
            numberDoc.tenSem.length * amountPerNumberDoc.sem10Num +
            numberDoc.hundredSem.length * amountPerNumberDoc.sem100Num +
            numberDoc.twoHundredSem.length * amountPerNumberDoc.sem200Num +
            numberDoc.fiftySem.length * amountPerNumberDoc.sem50Num;

        numberDoc.totalNumberAmount = totalNumbers * amountPerNumberDoc.ticketRate;

        const totalNum = numberDoc.thirtySem.length + numberDoc.fiveSem.length + numberDoc.tenSem.length
        console.log("total>>", totalNum);

        numberDoc.totalNumber = totalNumbers;

        numberDoc.totalThirtySem = numberDoc.thirtySem.length * amountPerNumberDoc.sem25Num;
        numberDoc.totalFiveSem = numberDoc.fiveSem.length * amountPerNumberDoc.sem5Num;
        numberDoc.totalTenSem = numberDoc.tenSem.length * amountPerNumberDoc.sem10Num;
        numberDoc.totalhundredSem = numberDoc.hundredSem.length * amountPerNumberDoc.sem100Num;
        numberDoc.totaltwoHundredSem = numberDoc.twoHundredSem.length * amountPerNumberDoc.sem200Num;
        numberDoc.totalfiftySem = numberDoc.fiftySem.length * amountPerNumberDoc.sem50Num;

        await numberDoc.save();

       shift.sellTickets[category].push(...uniqueNumbers);



        // Recalculate total amount
        const totalNumber =
            sellNumberDoc.thirtySem.length * amountPerNumberDoc.sem25Num +
            sellNumberDoc.fiveSem.length * amountPerNumberDoc.sem5Num +
            sellNumberDoc.tenSem.length * amountPerNumberDoc.sem10Num +
            sellNumberDoc.hundredSem.length * amountPerNumberDoc.sem100Num +
            sellNumberDoc.twoHundredSem.length * amountPerNumberDoc.sem200Num +
            sellNumberDoc.fiftySem.length * amountPerNumberDoc.sem50Num;


        sellNumberDoc.totalNumberAmount = totalNumber * amountPerNumberDoc.ticketRate;

        console.log("total Length :", totalNumber.length);
        sellNumberDoc.totalSell = sellNumberDoc.totalNumberAmount;



        sellNumberDoc.totalNumber = totalNumber;

        sellNumberDoc.totalThirtySem = numberDoc.thirtySem.length * amountPerNumberDoc.sem25Num;
        sellNumberDoc.totalFiveSem = numberDoc.fiveSem.length * amountPerNumberDoc.sem5Num;
        sellNumberDoc.totalTenSem = numberDoc.tenSem.length * amountPerNumberDoc.sem10Num;
        sellNumberDoc.totalhundredSem = numberDoc.tenSem.length * amountPerNumberDoc.sem100Num;
        sellNumberDoc.totaltwoHundredSem = numberDoc.tenSem.length * amountPerNumberDoc.sem200Num;
        sellNumberDoc.totalfiftySem = numberDoc.tenSem.length * amountPerNumberDoc.sem50Num;

        await shift.save();


        res.json({
            success: true,
            message: `${uniqueNumbers.length} numbers added successfully.`,
            addedNumbers: uniqueNumbers,
            totalNumbers,
            totalNumberAmount: numberDoc.totalNumberAmount
        });

    } catch (err) {
        console.error("Error adding numbers:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = addNumberToSeller;


