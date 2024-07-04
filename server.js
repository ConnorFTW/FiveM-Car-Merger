const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = '807252635605794846';
const CLIENT_SECRET = '85i5HkKnDFfiRVqwjB6mkVTSs2_vAjsh';
const REDIRECT_URI = 'https://merger.redleafmods.com/callback';
const DISCORD_API_BASE_URL = 'https://discord.com/api';

app.get('/callback', async (req, res) => {
    const code = req.query.code;

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post(`${DISCORD_API_BASE_URL}/oauth2/token`, {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            scope: 'identify' // Adjust scopes as per your requirements
        });

        const accessToken = tokenResponse.data.access_token;

        // Use accessToken to fetch user info (including roles)
        const userResponse = await axios.get(`${DISCORD_API_BASE_URL}/users/@me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const userId = userResponse.data.id;
        const userRoles = userResponse.data.roles;

        // Check if the user has the specific role (1155226137568493698)
        const hasRole = userRoles.includes('1155226137568493698');

        if (hasRole) {
            // User has the role, proceed with your application logic
            res.send('User has the specified role.');
        } else {
            // User does not have the role, handle accordingly
            res.send('User does not have the specified role.');
        }

    } catch (error) {
        console.error('Error exchanging code for token:', error.message);
        res.status(500).send('Error exchanging code for token.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
