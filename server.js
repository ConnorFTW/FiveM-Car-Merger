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

        // Redirect to homepage after processing OAuth2 callback
        window.location.href = 'https://merger.redleafmods.com/';
    })
    .catch(error => {
        console.error('Error fetching access token:', error);
    });
}

// Function to check if logged in on page load
function checkLoggedIn() {
    const accessToken = localStorage.getItem('accessToken');
    const loginStatusElement = document.getElementById('loginStatus');

    if (accessToken) {
        // User is logged in
        loginStatusElement.textContent = 'Logged In';
        // Optionally, check user roles here if needed
    } else {
        // User is logged out
        loginStatusElement.textContent = 'Logged Out';
    }
}

// Check if the current URL contains an authorization code from Discord OAuth2 redirect
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
    checkRole(code);
} else {
    // Check if logged in on page load
    checkLoggedIn();
}

// Add event listener to the login button
document.getElementById('loginBtn').addEventListener('click', loginWithDiscord);
