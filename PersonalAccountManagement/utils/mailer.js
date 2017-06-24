const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.163.com',           
    port: 465,
    secure: true, 
    auth: {
        user: '18285171634@163.com', 
        pass: 'asdfghjkl123'       
    }
});
function send_psw_forgot_mail(to, msg_text, msg_html, cb) {
 
  let mailOptions = {
     
      from: '"SysAdmin of Ticket System" <18285171634@163.com>', 
      to,                                                  
      subject: '密码找回-Ticket System',                    
      text: msg_text,                                       
      html: msg_html                                       
  };

  transporter.sendMail(mailOptions, (error, info) => {
      cb && cb(error, info);
      
  });
}
module.exports = send_psw_forgot_mail