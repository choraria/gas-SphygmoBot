# SphygmoBot
A human "Heartbeat" checker hosted on Telegram and powered by Google Apps Script.

# Setup
1. Copy paste all the code from this report to Google Apps Script
2. Create a new Google Spreadsheet and **DO NOT** change anything else there
3. Replace the Sheet ID and Telegram API Token on `Code.gs`
4. Deploy the script as a Web App
5. Run the `setup` function from `Setup.gs` (this is important)

# Live Demo
You can access [SphygmoBot on Telegram](https://t.me/SphygmoBot) & watch a setup video [here](https://www.youtube.com/watch?v=UAYKd4kpOzM)

# Disclaimer
1. Please consider this is as a Proof of Concept (POC) and not a full-fledged application to utilise in everyday life!
2. Also, this bot makes use of Telegram BOT API's Webhook functionality and logs (stores) all parameters (data) including (but not restricted to) first name, last name, chat & message ID, user name etc.
