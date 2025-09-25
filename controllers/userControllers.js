require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const userModel = require("../models/usersModel");
const generateOtp = require("../email/generateOtp");
const transporter = require("../email/mailTransporter");
const otpModel = require("../models/otpModel")

const register = async (req, res) => {
    const { username, email, password } = req.body;
    const mailExist = await userModel.findOne({ email });
    if (mailExist) {
        res.send({ message: "email existe dejà" });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    try {
        user = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });
    } catch (error) {
        res.send({ message: "utilisateur non crée" });
        return;
    }
    const otp = generateOtp();
    const otpToken = uuid.v4();

    const otpTest = await otpModel.create({
        userId: user._id,
        otp,
        otpToken,
        purpose: "verify email",
    }
    );
    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "verification de votre email",
        html: `<h1>Vérification email</h1>
        <div>
            Utilisez ce code pour vérifier votre email :<br>
            <strong>${otp}</strong>
        </div>`
    });
    console.log(user)
    res.send({ messege: "utilisateur ajouté avec succès ", user, otpToken });
};


const verify = async (req, res) => {
    const { otp, otpToken, purpose } = req.body;

    if (purpose !== "verify email") {
        res.status(422).send({
            message: "purpose est invalide",
        });
        return;
    }

    const otpTest = await otpModel.findOne({
        otpToken,
        purpose,
    })

    if (!otpTest) {
        console.log("OTP non trouvé");

        res.status(406).send({
            message: "otp est invalide",
        });
        return
    }

    if (otp !== otpTest.otp) {
        res.status(406).send({
            message: "otp est invalide",
        });
        return
    }

    const updateUser = await userModel.findByIdAndUpdate(
        otpTest.userId,
        { isVerified: true },
        { new: true }
    );

    res.send({
        message: "utilisateur est verifié avec sucés",
        updateUser,
    });
};

module.exports = { register, verify }