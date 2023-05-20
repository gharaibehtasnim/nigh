const { genrateToken } = require("./config");

const { pool } = require("../models/db");

const { OAuth2Client } = require("google-auth-library");

//const  = require("../models/patientSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { types } = require("pg");
nodemailer = require("nodemailer");
// const saltRounds = parseInt(process.env.SALT);

const register = async (req, res) => {
  const { firstName, lastName, age, email, password, role_id } = req.body;
  try {
    const encryptedPassword = await bcrypt.hash(password, 7);
    const query = `INSERT INTO users (firstName, lastName, age, email, password,role_id) VALUES ($1,$2,$3,$4,$5,$6)RETURNING *`;
    const data = [
      firstName,
      lastName,
      age,
      email.toLowerCase(),
      encryptedPassword,
      role_id || 2,
    ];
    pool
      .query(query, data)
      .then((result) => {
        const payload = {
          userId: result.rows[0].user_id,
          role: result.rows[0].role_id,
          firstname: result.rows[0].firstName,
          lastname: result.rows[0].lastName,
        };
        const options = {
          expiresIn: "24h",
        };
        const token = genrateToken(payload, options);

        res.status(200).json({
          success: true,
          token: token,
          userInfo: result.rows[0],
          userId: result.rows[0].user_id,
          roleId: result.rows[0].role_id,
          message: "Account created successfully",
        });
        verfiyResjsterByEmail(email, firstName, lastName);
      })
      .catch((err) => {
        res.status(409).json({
          success: false,
          message: "The email already exists",
          err,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const login = (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const query = `SELECT * FROM users WHERE email = $1`;
  const data = [email.toLowerCase()];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (err, response) => {
          if (err) res.json(err);
          if (response) {
            const payload = {
              userId: result.rows[0].user_id,
              role: result.rows[0].role_id,
              firstname: result.rows[0].firstName,
              lastname: result.rows[0].lastName,
            };

            const options = {
              expiresIn: "24h",
            };
            const token = genrateToken(payload, options);

            if (token) {
              return res.status(200).json({
                success: true,
                message: `Valid login credentials`,
                token,
                userId: result.rows[0].user_id,
                roleId: result.rows[0].role_id,
                userInfo: result.rows[0],
              });
            } else {
              throw Error;
            }
          } else {
            res.status(403).json({
              success: false,
              message: `The email doesn’t exist or the password you’ve entered is incorrect`,
            });
          }
        });
      } else throw Error;
    })
    .catch((err) => {
      res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
        err,
      });
    });
};

const checkGoogleUser = (req, res) => {
  const token = req.body.credential;
  const CLIENT_ID = req.body.clientId;
  const client = new OAuth2Client(CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    res.json(payload);
  }
  verify().catch((err) => {
    if (err.keyPattern) {
      res.status(409).json({
        success: false,
        message: `Email is already exist`,
      });
    } else {
      res.status(500).json({
        success: false,
        message: `Server error`,
        err: err.message,
      });
    }
  });
};

const profileInfo = (req, res) => {
  const user_id = req.token.userId;
  const query = "SELECT * FROM users WHERE user_id=$1";
  pool
    .query(query, [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(200).json({
          success: false,
          message: `The user: ${user_id} has no info`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `All info for the user: ${user_id}`,
          info: result.rows[0],
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

const otherUsersInfo = (req, res) => {
  const user_id = req.params.id;
  const query = "SELECT * FROM users WHERE user_id=$1";
  pool
    .query(query, [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(200).json({
          success: false,
          message: `The user: ${user_id} has no info`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `All info for the user: ${user_id}`,
          result: result.rows[0],
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

const editUserInfo = (req, res) => {
  const user_id = req.token.userId;

  let { avatar, coverImg, bio } = req.body;
  const data = [avatar, coverImg, bio, user_id];

  const query = `UPDATE users SET 
  avatar = COALESCE($1,avatar), 
  coverImg = COALESCE($2, coverImg), 
  bio = COALESCE($3, bio), 
  updated_at=NOW() 
  WHERE user_id=$4 RETURNING *;`;

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(200).json({
          success: false,
          message: `no data found`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `user's info updated sucessfully `,
          result: result.rows[0],
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

const verfiyResjsterByEmail = (email, firstName, lastName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tasnim.gharaibeh@gmail.com",
      pass: "tzzjtrcepxmotljz",
    },
  });

  const mailOptions = {
    from: "tasnim.gharaibeh@gmail.com",
    to: email,
    subject: "Subject",

    html: `
    <!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap" rel="stylesheet" type="text/css"/><!--<![endif]-->
<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		@media (max-width:700px) {

			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.fullMobileWidth,
			.row-content {
				width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}

			.reverse {
				display: table;
				width: 100%;
			}

			.reverse .column.last {
				display: table-header-group !important;
			}

			.row-2 td.column.last .border {
				padding: 0;
				border-top: 0;
				border-right: 0px;
				border-bottom: 0;
				border-left: 0;
			}
		}
	</style>
</head>
<body style="margin: 0; background-color: #f9f9f9; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f9f9f9;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f9f9f9; color: #000000; width: 680px;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<div class="spacer_block block-1" style="height:80px;line-height:80px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px"><img alt="Bell Icon" src="https://res.cloudinary.com/deqwvkyth/image/upload/v1682733247/uonylyz1mza8zd1kqsc4.png" style="display: block; height: auto; border: 0; width: 95px; max-width: 100%;" title="Bell Icon" width="95"/></div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px;" width="680">
<tbody>
<tr class="reverse">
<td class="column column-1 last" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<div class="border">
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:25px;padding-left:20px;padding-right:20px;">
<div style="font-family: Tahoma, sans-serif">
<div class="" style="font-family: 'Trebuchet MS','Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #ff914d; line-height: 1.2;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:42px;">Welcome To Nigh</span></p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:10px;">
<div style="font-family: sans-serif">
<div class="" style="font-size: 14px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 21px; color: #2f2f2f; line-height: 1.5;">
<p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;">Hi <u><strong>${firstName}  ${lastName}</strong></u>,</span></p>
<p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 21px;"> </p>
<p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 24px;">Welcome to nigh here where you can stay close to your friends </p>
</div>
</div>
</td>
</tr>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #cbdbef; background-image: url('https://res.cloudinary.com/deqwvkyth/image/upload/v1682796421/background-reminder_frbmja.jpg'); background-repeat: repeat; color: #000000; width: 680px;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px"><img alt="Girls Image" class="fullMobileWidth" src="https://res.cloudinary.com/deqwvkyth/image/upload/v1682742268/obom2p2nnulko7jbr5ci.webp" style="display: block; height: auto; border: 0; width: 680px; max-width: 100%;" title="Girls Image" width="680"/></div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="10" cellspacing="0" class="social_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="144px">
<tr>
<td style="padding:0 2px 0 2px;"><a href="https://www.facebook.com/" target="_blank"><img alt="Facebook" height="32" src="https://res.cloudinary.com/deqwvkyth/image/upload/v1682795869/facebook2x_nzxyls.png" style="display: block; height: auto; border: 0;" title="Facebook" width="32"/></a></td>
<td style="padding:0 2px 0 2px;"><a href="https://twitter.com/" target="_blank"><img alt="Twitter" height="32" src="https://res.cloudinary.com/deqwvkyth/image/upload/v1682796070/twitter2x_tyzwc8.png" style="display: block; height: auto; border: 0;" title="Twitter" width="32"/></a></td>
<td style="padding:0 2px 0 2px;"><a href="https://instagram.com/" target="_blank"><img alt="Instagram" height="32" src="https://res.cloudinary.com/deqwvkyth/image/upload/v1682796018/instagram2x_n0xouf.png" style="display: block; height: auto; border: 0;" title="Instagram" width="32"/></a></td>
<td style="padding:0 2px 0 2px;"><a href="mailto:tasnim.gharaibeh@gmail.com" target="_blank"><img alt="E-Mail" height="32" src="https://res.cloudinary.com/deqwvkyth/image/upload/v1682796104/mail2x_ygvgzc.png" style="display: block; height: auto; border: 0;" title="E-Mail" width="32"/></a></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="font-family: sans-serif">
<div class="" style="font-size: 14px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 21px; color: #ff914d; line-height: 1.5;">
<p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 21px;"> </p>
<p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 18px;"><span style="font-size:12px;">-tasnim.gharaibeh@gmail.com</span></p>
<p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 18px;"><span style="font-size:12px;">-reem.mohd.mousa@gmail.com</span></p>
<p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 18px;"><span style="font-size:12px;">-shiab.ayah@gmail.com</span></p>
<p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 21px;"> </p>
</div>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="10" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="font-family: sans-serif">
<div class="" style="font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #ff914d; line-height: 1.2;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:12px;">2021 © All Rights Reserved</span></p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-left:10px;padding-right:10px;">
<div style="font-family: sans-serif">
<div class="" style="font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #ff914d; line-height: 1.2;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:12px;"><a href="http://www.example.com" rel="noopener" style="color: #ff914d;" target="_blank">Unsubscribe</a> | <a href="http://www.example.com" rel="noopener" style="color: #ff914d;" target="_blank">Manage Preferences</a></span></p>
</div>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
<table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
<!--[if !vml]><!-->
<table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;"><!--<![endif]-->
<tr>
<td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="https://www.designedwithbee.com/" style="text-decoration: none;" target="_blank"><img align="center" alt="Designed with BEE" class="icon" height="32" src="https://res.cloudinary.com/deqwvkyth/image/upload/v1682796221/bee_w9wmpd.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="34"/></a></td>
<td style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 15px; color: #9d9d9d; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="https://www.designedwithbee.com/" style="color: #9d9d9d; text-decoration: none;" target="_blank">Designed with BEE</a></td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table><!-- End -->
</body>
</html>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      // res.json({
      //   success:true,
      //   message:"Email is sent"
      // })
      // do something useful
    }
  });
};
//https://beefree.io/templates/
//https://unlayer.com/

module.exports = {
  register,
  login,
  checkGoogleUser,
  profileInfo,
  otherUsersInfo,
  editUserInfo,
};
