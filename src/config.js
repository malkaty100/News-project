// Step 1: the address of the news API.
// TODO: read the key from the .env file: import.meta.env.VITE_NEWS_API_KEY
//       (never write the key itself here - this file goes to GitHub, .env does not)
const API_KEY = ''

export const NEWS_URL = `https://newsapi.org/v2/top-headlines?country=us&pageSize=30&apiKey=${API_KEY}`
