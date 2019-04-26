const https = require('https')
const axios = require('axios')

const getToken = async () => {
  try {
    const { data } = await axios.get(
      'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ww4ff51359a93e6219&corpsecret=demW3Jh76pJsUIdU9J-4y3xVZ54rZJz3xCQrgtUsqRc'
    )
    sendMessage(data.access_token)
  } catch (error) {
    console.error(error)
  }
}
const sendMessage = async (token) => {
  try {
    const { data } = await axios.post(`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}`, {
      touser: 'HuBingLiang',
      msgtype: 'text',
      agentid: 1000002,
      text: {
        content: '你鸡太美',
      },
      safe: 0,
    })
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}

getToken()
// https
//   .get(
//     'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ww4ff51359a93e6219&corpsecret=demW3Jh76pJsUIdU9J-4y3xVZ54rZJz3xCQrgtUsqRc',
//     (res) => {
//       console.log('statusCode:', res.statusCode)
//       console.log('headers:', res.headers)

//       res.on('data', (d) => {
//         process.stdout.write(d)
//         const postData = querystring.stringify({
//           touser: 'HuBingLiang',
//           msgtype: 'text',
//           agentid: 1000002,
//           text: {
//             content: '你鸡太美',
//           },
//           safe: 0,
//         })
//         https
//           .post(`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${d.access_token}`, (res) => {
//             console.log('statusCode:', res.statusCode)
//             console.log('headers:', res.headers)

//             res.on('data', (d) => {
//               process.stdout.write(d)
//             })
//           })
//           .on('error', (e) => {
//             console.error(e)
//           })
//       })
//     }
//   )
//   .on('error', (e) => {
//     console.error(e)
//   })
