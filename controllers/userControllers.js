require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");

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
    const otpToken = v4();

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


//login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "utilisateur introuvable" });
        }
        const passwordCorrect = bcrypt.compareSync(password, user.password);
        if (!passwordCorrect) {
            res.status(401).send({ message: "indentifiant non valide" });

            return
        }
        if (!user.isVerified) {
            return res.status(403).send({ message: "Email non vérifié" });
        }
        const token = jwt.sign(
            {
                userId: user.userID,
                email: user.email,
            },
            process.env.SECRET_KEY,
            { expiresIn: "24h" }
        );
        console.log(token);

        res.send({
            message: "Connection réussie",
            token,
            // user: {
            //     id: user._id,
            //     name: user.name,
            //     email: user.email,
            // },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Erreur de connexion",
            error: error.message,
        });

    }
};

// fortgot
const fortgotPassword = async (req, res) => {


    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(400).send({ message: "utilisateur introuvable" });
        }
        const otp = generateOtp();
        const otpToken = v4();

        await otpModel.create({
            userId: user._id,
            otp,
            otpToken,
            purpose: "reset password",
        });
        console.log("OTP généré", otp);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Reinitialisation de mot de passe",
            html: `
        <h1> "Reintialisation de mot de passe",
        <div>
        utilisez ce code pour reintialiser votre mot de passe:<br>
        <strong>${otp}</strong>
        </div>`,
        });

        res.send({
            message: "Email de reinitialisation est envoye",
            otpToken,
        })
    } catch (error) {
        res.status(500).send({
            message: "erreur de reinitialisation",
            error: error.message,
        });
    }
};

// Rest password

const restPassword = async (req, res) => {
    const { otp, otpToken, newPassword } = req.body;
    try {
        const otpTest = await otpModel.findOne({
            otpToken,
            purpose: "reset password",
        });

        if (!otpTest) {
            return res.status(404).send({
                message: "Otp n'est pas trouvé",
            });
        }
        console.log("OTP trouvé", otpTest.otp);
        if (otp !== otpTest.otp) {
            return res.status(406).send({ message: "Otp invalid" });
        }

        const hashedpassword = bcrypt.hashSync(newPassword, 10);
        await userModel.findByIdAndUpdate(otpTest.userId, {
            password: hashedpassword,
        });

        await otpModel.findByIdAndDelete(otpTest._id);
        res.send({
            message: "Mot de passe reinitialise avec succes",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "erreur lors de la reinitialisation",
            error: error.message,
        });
    }
};

module.exports = { register, verify, login, fortgotPassword, restPassword }