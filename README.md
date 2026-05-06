# GoldenBerry Exchange Discord Bot

A professional, production-ready Discord ticket bot designed for cryptocurrency exchanges. Built with Node.js and discord.js v14, featuring modals, buttons, embeds, HTML transcripts, and MongoDB support.

## Features
- **Modern UI**: Clean embeds and interactive buttons.
- **Two-way Exchange**: Modals for INR → Crypto and Crypto → INR.
- **Private Tickets**: Automatically creates private channels with proper permissions.
- **Anti-Spam**: Prevents users from having multiple open tickets at once.
- **Staff Controls**: Claim and close tickets securely.
- **Transcripts**: Automatically generates HTML transcripts upon ticket closure and sends them to a logs channel.
- **Database (Optional)**: MongoDB support to log ticket metadata.

---

## File Structure

```
src/
 ├── commands/          # Slash commands (e.g., /panel)
 ├── events/            # Event handlers (ready, interactionCreate)
 ├── buttons/           # Button interaction handlers
 ├── modals/            # Modal submission handlers
 ├── utils/             # Utility functions (e.g., slash command deployment)
 ├── config/            # Configuration files
 ├── models/            # Mongoose database models
 └── index.js           # Main bot entry point
```

---

## Setup Instructions

### 1. Create a Discord Bot
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** and name your bot.
3. Go to the **Bot** tab, click **Add Bot**.
4. Scroll down to **Privileged Gateway Intents** and enable:
   - Server Members Intent
   - Message Content Intent
5. Reset the Token and copy it. You will need this later.
6. Go to the **OAuth2 > URL Generator** tab. Select `bot` and `applications.commands`.
7. Under Bot Permissions, select `Administrator` (or appropriate permissions like Manage Channels, Manage Roles, Send Messages).
8. Copy the URL and invite the bot to your server.

### 2. Configure Environment Variables
1. Rename `.env.example` to `.env`.
2. Fill in the required details:
   ```env
   BOT_TOKEN=your_bot_token_here
   CLIENT_ID=your_bot_client_id_here
   GUILD_ID=your_discord_server_id_here
   MONGO_URI=your_mongodb_connection_string_here # Optional
   ```
   *Note: If you do not wish to use MongoDB, simply leave the `MONGO_URI` as is or leave it blank. The bot will run perfectly fine without it.*

### 3. Update Bot Config
1. Open `src/config/config.js`.
2. Replace the placeholder IDs with your server's actual IDs:
   - `staffRoleId`: The ID of the role allowed to claim/view tickets.
   - `categoryId`: The ID of the category where new ticket channels will be created.
   - `logsChannelId`: The ID of the channel where transcripts will be sent upon closing a ticket.

### 4. Local Deployment
1. Make sure you have [Node.js](https://nodejs.org/) installed (v16.9.0 or higher).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the bot:
   ```bash
   npm start
   ```

---

## Deployment on Render / Railway

This project is fully ready to be deployed on platforms like Render or Railway.

### Deployment Guide (Render)
1. Push your code to a GitHub repository.
2. Go to [Render](https://render.com/) and create a new **Background Worker**.
3. Connect your GitHub account and select your repository.
4. Set the following configuration:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Go to the **Environment** tab and add the environment variables (`BOT_TOKEN`, `CLIENT_ID`, `GUILD_ID`, `MONGO_URI`).
6. Click **Create Background Worker**. Render will build and start your bot!

### Deployment Guide (Railway)
1. Go to [Railway](https://railway.app/).
2. Click **New Project** > **Deploy from GitHub repo**.
3. Select your repository.
4. Go to the **Variables** tab and add your environment variables (`BOT_TOKEN`, `CLIENT_ID`, `GUILD_ID`, `MONGO_URI`).
5. Railway will automatically detect Node.js, run `npm install`, and use `npm start` to run your bot.

---

## Usage
Once the bot is online, an Administrator can run the `/panel` command in the desired channel. This will deploy the ticket creation embed with interactive buttons. Users can then click the buttons to fill out the modal forms and instantly open an exchange ticket.
