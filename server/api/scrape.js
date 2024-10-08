import WebSocket, { WebSocketServer } from 'ws';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cron from 'node-cron';

const wss = new WebSocketServer({ port: 8080 });

const LINE_NOTIFY_API_URL = ("https://notify-api.line.me/api/notify");
const ACCESS_TOKEN = 'jnZKOE3Sqe2jX7AWmf50OEicKIU7vMg2cBzZdPxGD8Y';

const LINE_ACCESS_TOKEN = '9401e5314ed31248212e7c41b29c8019'; // Add your LINE Channel Access Token here
const LINE_API_URL = 'https://api.line.me/v2/bot/message/push'; // LINE API URL
const LINE_USER_ID = '2006430757'; // The user ID to send the message to (can be a group ID or a user ID)

let previousData = null

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Echo the message back to the client
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Scraping function
async function scrapeData() {
    const url = 'https://www.goldtraders.or.th/';
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const associate_buy_price_goldbar = $('#DetailPlace_uc_goldprices1_lblBLBuy font').text().replace(",", "");
        const associate_sell_price_goldbar = $('#DetailPlace_uc_goldprices1_lblBLSell font').text().replace(",", "");
        const associate_buy_price_goldornament = $('#DetailPlace_uc_goldprices1_lblOMBuy font').text().replace(",", "");
        const associate_sell_price_goldornament = $('#DetailPlace_uc_goldprices1_lblOMSell font').text().replace(",", "");

        const newData = {
            associate_buy_price_goldbar,
            associate_sell_price_goldbar,
            associate_buy_price_goldornament,
            associate_sell_price_goldornament,
        };

        console.log("A = "+JSON.stringify(newData))
        console.log("B = "+JSON.stringify(previousData))

        if (JSON.stringify(newData) !== JSON.stringify(previousData)) {
            previousData = newData
            
            const message = `\uD83D\uDE00\nแท่งขายออก : ${newData.associate_sell_price_goldbar}\nแท่งรับซื้อ : ${newData.associate_buy_price_goldbar}\nรูปพรรณขายออก : ${newData.associate_sell_price_goldornament}\nรูปพรรณรับซื้อ : ${newData.associate_buy_price_goldornament}`;
            await sendLineMessage(message);
            await sendLineNotify(message);

            // Notify connected WebSocket clients of new data
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(newData)); // Send the new data to the client
                    // sendLineNotify(message);
                }
            });
        }

        return newData;
    } catch (error) {
        console.error('Error scraping the website:', error);
        return null;
    }
}

// Schedule scraping task
cron.schedule('*/3 * * * * *', () => {
    console.log('Running web scraper...');
    scrapeData(); // Call scrapeData() every 3 seconds
});

console.log('WebSocket server is running on ws://localhost:8080');

async function sendLineMessage(message) {
    try {
        await axios.post(LINE_API_URL, {
            to: LINE_USER_ID,
            messages: [{ type: 'text', text: message }],
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`,
            },
        });
        console.log('Message sent successfully!');
    } catch (error) {
        console.error('Failed to send message:', error.response ? error.response.data : error.message);
    }
}
async function sendLineNotify(message) {
    try {
        const response = await axios.post(LINE_NOTIFY_API_URL,
            `message=${message}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                },
            }
        );
        console.log('Message sent successfully:', response.data);
    } catch (error) {
        console.error('Failed to send message:', error.response ? error.response.data : error.message);
    }
}

