const axios = require("axios")

async function refreshTokenAPI() {
  const URL = "https://accounts.google.com/o/oauth2/token"
  const clientSecret = "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"
  const clientID = "909155471767-1i6r8n6u8iqq5buakam6ocve2c95d4gt.apps.googleusercontent.com"
  const redirectURI = "1//04kvR26qL7mTdCgYIARAAGAQSNwF-L9IrXoQ0wim7JYTGK0aBNW_qpGTZPDz4fBlCypbeGHPZrCuofQvgdxk44r4JBewGw2fLiJo"

  try {
    const res = await axios({
      method: "post",
      baseURL: URL,
      data: {
        grant_type: "refresh_token",
        clientId: clientID,
        client_secret: clientSecret,
        refresh_token: redirectURI,
      }
    })
    return res.data.access_token
  } catch(error) {
    console.log("Erro Token")
  }
}

export default refreshTokenAPI;