# SphygmoBot
A human "Heartbeat" checker hosted on Telegram and powered by Google Apps Script.

<a href="https://www.producthunt.com/posts/sphygmobot?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-sphygmobot" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=172472&theme=dark" alt="SphygmoBot - A human Heartbeat checker hosted on Telegram. | Product Hunt Embed" style="width: 250px; height: 54px;" width="250px" height="54px" /></a>

# Setup
1. Copy paste all the code from this repo to a new apps script
2. Create a new Google Spreadsheet and **DO NOT** change anything else there
3. Generate a Telegram Bot API token per [the instructions](https://core.telegram.org/bots#3-how-do-i-create-a-bot)
4. Replace the Sheet ID and Telegram Bot API Token on `Code.gs`
5. Deploy the script as a Web App
6. Run the `setup` function from `Setup.gs` (it is important that you deploy the script first and then the setup function)
   - Then run the `scheduler` function from `Setup.gs`

# Live Demo
You can access [SphygmoBot on Telegram](https://t.me/SphygmoBot) & watch a setup video here -

[![Watch the video](https://img.youtube.com/vi/UAYKd4kpOzM/maxresdefault.jpg)](https://youtu.be/UAYKd4kpOzM)

# Disclaimer
1. Please consider this as a Proof of Concept (POC) and not a full-fledged application to utilise in everyday life!
2. Also, this bot makes use of Telegram BOT API's Webhook functionality and logs (stores) all parameters (data) including (but not restricted to) first name, last name, chat & message ID, user name etc.
