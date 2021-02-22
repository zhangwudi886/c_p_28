
const nodemailer = require("nodemailer");
const debug = require('debug')("crawl:send:email")

let send_email = async (list=[],email='335156866@qq.com') =>{
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'QQ',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
    auth: {
      user: '335156866@qq.com', // generated ethereal user
      pass: 'tjhwsyfqvvudbjae', // generated ethereal password
    },
  });
  let map_results = list.map(item=>{
      return `<h2><a href="${item.href}">${item.title}</a></h2>`
  })
  debug(`发动的邮件人为${email}`)
  // send mail with defined transport object
  await transporter.sendMail({
    from: '"335156866@qq.com 👻" <335156866@qq.com>', // sender address
    to: email, // list of receivers
    subject: "掘进文章更新", // Subject line
    // text: "想不想看", // plain text body
    html: `${map_results}`, // html body
  },(err,info)=>{
      if(err){
          debug(`邮件发送失败${err}`)
      }else{
          debug(`邮件发送给${email}成功`)
      }
  });
  
}
// send_email()

module.exports = send_email