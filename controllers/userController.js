const bcrypt = require("bcrypt");
const userModel = require("../models/usersModel")
const jwt = require("jsonwebtoken");
const login = async(req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});
       if(!user){
        return res.status(404).send({ message: "utilisateur introuvable"});
       } 
       const passwordCorrect = bcrypt.compareSync(password, user.password);
       if (!passwordCorrect) {
        res.status(401).send({message: "indentifiant non valide"});
        
        return 
       }
       if (!user.isVerified) {
        return res.status(403).send({message:"Email non vérifié"});
       }
       const token = jwt.sign(
        {
            userId: user.userID,
            email:user.email,
        },
        process.env.SECRET_KEY,
        {expiresIn: "24h" }
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
    } catch (error){
        console.error(error);
        res.status(500).send({
            message: "Erreur de connexion",
            error: error.message,
        });
        
    }
};

// fortgot
const fortgotPassword = async(req, res)=>{


  const {email} = req.body;
  try {
    const user = await userModel.findOne({email});
    if (!user) {
       res.status(400).send({message:"utilisateur introuvable"});
    }
    const otp =generateOtp();
    const otpToken = v4();

    await otpModel.create({
        userId: user._id,
        otp,
        otpToken,
        purpose: "reset-password",
    });
    await WebTransportError.sendMail({
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

  const restPassword = async (req, res)=> {
    const { otp, otpToken, newPassword}= req.body;
    try {
        const otpDails = await otpModel.findOne({
            otpToken,
            purpose: "rest-password",
        });
        if (!otpDails) {
           return res.status(404).send({
            message: "Otp n'est pqs trouvé",
           });
        }
        if (otp !== otpDails.otp) {
           return res.status(406).send({message: "Otp invalid"}); 
        }
        const hashedpassword = bcrypt.hashSync(newPassword, 10);
        await userModel.findByIdAndUpdate(otpDails.userId,{
            password: hashedpassword,
        });

        await otpModel.findByIdAndDelete(otpDails._id);
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
module.exports = {login, fortgotPassword,restPassword}