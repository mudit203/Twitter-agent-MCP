import {config} from "dotenv";
import { TwitterApi } from "twitter-api-v2";

config();
const twitterclient=new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret:process.env.TWITTER_APP_SECRET,
    accessToken:process.env.TWITTER_ACCESS_TOKEN,
    accessSecret:process.env.TWITTER_ACCESS_SECRET

})

export const createpost= async(status)=>{
  
    const newpost=await twitterclient.v2.tweet(status);
    const me= await twitterclient.currentUser();
    console.log(me);
     return {
      content: [
        {
          type: "text",
          text: `tweet created ${status}`
        }
      ]
    }
   
  }
