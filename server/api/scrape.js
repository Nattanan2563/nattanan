// import axios from 'axios';
// import * as cheerio from 'cheerio';

// export default defineEventHandler(async (event) => {

//     event.res.setHeader('Access-Control-Allow-Origin', '*');
//     event.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     event.res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//     const url = 'https://www.goldtraders.or.th/'; // Replace with the URL you want to scrape

//     try {
//         // Fetch the page
//         const { data } = await axios.get(url);

//         // Load the HTML using Cheerio
//         const $ = cheerio.load(data);

//         // Example: Extract the title of the page
//         const title = $('title').text();
//         const associate_buy_price_goldbar = $('#DetailPlace_uc_goldprices1_lblBLBuy font').text().replace(",", "");
//         const associate_sell_price_goldbar = $('#DetailPlace_uc_goldprices1_lblBLSell font').text().replace(",", "");
//         const associate_buy_price_goldornament = $('#DetailPlace_uc_goldprices1_lblOMBuy font').text().replace(",", "");
//         const associate_sell_price_goldornament = $('#DetailPlace_uc_goldprices1_lblOMSell font').text().replace(",", "");

//         // Extract more data as needed
//         // For example, to scrape all links:
//         const links = [];
//         $('a').each((index, element) => {
//             links.push($(element).attr('href'));
//         });

//         // Return the scraped data
//         return {
//             title,
//             associate_buy_price_goldbar,
//             associate_sell_price_goldbar,
//             associate_buy_price_goldornament,
//             associate_sell_price_goldornament
//             //   title,
//             //   links
//         };
//     } catch (error) {
//         return { error: 'Error scraping the website' };
//     }
// });



import axios from 'axios';
import * as cheerio from 'cheerio';

const LINE_ACCESS_TOKEN = '9401e5314ed31248212e7c41b29c8019'; // Add your LINE Channel Access Token here
const LINE_API_URL = 'https://api.line.me/v2/bot/message/push'; // LINE API URL
const LINE_USER_ID = '2006430757'; // The user ID to send the message to (can be a group ID or a user ID)

let previousData = null; // To store the previous scraped data

export default defineEventHandler(async (event) => {
    const url = 'https://www.goldtraders.or.th/';
    try {
        // Fetch the page
        const { data } = await axios.get(url);

        // Load the HTML using Cheerio
        const $ = cheerio.load(data);

        // Example: Extract the title of the page
        const title = $('title').text();
        const associate_buy_price_goldbar = $('#DetailPlace_uc_goldprices1_lblBLBuy font').text().replace(",", "");
        const associate_sell_price_goldbar = $('#DetailPlace_uc_goldprices1_lblBLSell font').text().replace(",", "");
        const associate_buy_price_goldornament = $('#DetailPlace_uc_goldprices1_lblOMBuy font').text().replace(",", "");
        const associate_sell_price_goldornament = $('#DetailPlace_uc_goldprices1_lblOMSell font').text().replace(",", "");

        // Create the new scraped data object
        const newData = {
            title,
            associate_buy_price_goldbar,
            associate_sell_price_goldbar,
            associate_buy_price_goldornament,
            associate_sell_price_goldornament
        };

        // Check if the scraped data has changed
            await sendLineMessage(`Data changed!\nTitle: ${newData.title}\nLinks: ${newData.associate_buy_price_goldbar}`);
        // if (JSON.stringify(newData) !== JSON.stringify(previousData)) {
        //     // Data has changed, send a message via LINE
        //     await sendLineMessage(`Data changed!\nTitle: ${newData.title}\nLinks: ${newData.associate_buy_price_goldbar}`);
        //     // Update the previous data
        //     previousData = newData;
        // }

        // Return the scraped data
        return newData;

    } catch (error) {
        return { error: 'Error scraping the website' };
    }
});

// Function to send message via LINE Messaging API
async function sendLineMessage(message) {
    console.log(LINE_API_URL+", "+LINE_USER_ID+", "+LINE_ACCESS_TOKEN);
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
