import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import {google} from 'googleapis'


const fetchGmailMessages = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken) {
        return res.status(401).json({message: "No Token"})
    }

    // Initializing oauth2Client
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    )

    // Getting new access token
    const {tokens} = await oauth2Client.refreshToken(refreshToken)
    const accessToken = tokens.access_token

    // Fetching msgs
    try {
        const feedRes = await axios.get("https://mail.google.com/mail/feed/atom", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/xml"
            }
        })

        // Parse XML to JSON
        const parser = new XMLParser()
        const parsed = parser.parse(feedRes.data)
        const entries = parsed.feed.entry || []

        const messages = entries.map((entry, key) => ({
            id: key + 1,
            from: entry.author?.name || "Unknown",
            title: entry.title || "No Subject",
            content: entry.summary || "No content available",
            unread: true
        }))
        res.json({messages})
    } catch (error) {
        console.log(`Could not fetch messages ---- ${error}`)
    }
}

export {
    fetchGmailMessages
}