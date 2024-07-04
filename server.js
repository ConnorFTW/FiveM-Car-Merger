// Replace with your Discord OAuth2 client ID and redirect URI
const clientId = '807252635605794846';
const clientSecret = '85i5HkKnDFfiRVqwjB6mkVTSs2_vAjsh';
const redirectUri = 'https://merger.redleafmods.com/callback';

// Function to handle OAuth2 login
function loginWithDiscord() {
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20guilds`;
}

// Function to handle role checking after redirect
function checkRole(code) {
    fetch(`https://discord.com/api/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`
    })
    .then(response => response.json())
    .then(data => {
        const accessToken = data.access_token;

        // Store access token in localStorage
        localStorage.setItem('accessToken', accessToken);

        // Get user guilds to check roles
        fetch(`https://discord.com/api/v9/users/@me/guilds`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(guilds => {
            // Check if the user has the required role (replace with your role ID)
            const roleId = '1155226137568493698';
            const hasRole = guilds.some(guild => guild.id === roleId);

            // Display role status
            const roleStatusElement = document.getElementById('roleStatus');
            roleStatusElement.textContent = hasRole ? 'You have the role!' : 'You do not have the role.';
        })
        .catch(error => {
            console.error('Error fetching user guilds:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching access token:', error);
    });
}

// Function to check if logged in on page load
function checkLoggedIn() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        // Assume user is logged in and fetch guilds to check role
        fetch(`https://discord.com/api/v9/users/@me/guilds`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(guilds => {
            // Check if the user has the required role (replace with your role ID)
            const roleId = '1155226137568493698';
            const hasRole = guilds.some(guild => guild.id === roleId);

            // Display role status
            const roleStatusElement = document.getElementById('roleStatus');
            roleStatusElement.textContent = hasRole ? 'You have the role!' : 'You do not have the role.';
        })
        .catch(error => {
            console.error('Error fetching user guilds:', error);
        });
    }
}

// Check if the current URL contains an authorization code from Discord OAuth2 redirect
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
    checkRole(code);

    // Redirect to homepage after processing OAuth2 callback
    window.location.href = 'https://merger.redleafmods.com/';
} else {
    // Check if logged in on page load
    checkLoggedIn();
}

// Add event listener to the login button
document.getElementById('loginBtn').addEventListener('click', loginWithDiscord);
