// Step 3: NewsProvider - keeps the news and gives them to the whole app through NewsContext.
// It is already used in main.jsx: <NewsProvider><App /></NewsProvider>

import useFetch from "../hooks/useFetch.js"
import {NEWS_URL} from '../config.js'
import { useState } from "react"
import { NewsContext } from "./NewsContext.js"
/**
 * Gives through the context: { stories, loading, addStory }
 *   stories  - the stories you created + the articles from the API (data.articles), the new ones first
 *   loading  - true while the API has not answered yet
 *   addStory - (story) => adds a new story to the top of stories (it is not sent to the API)
 */
export default function NewsProvider({ children }) {
  // TODO: const { data, loading } = useFetch(NEWS_URL)   (NEWS_URL from ../config.js)
  // TODO: useState for the stories you create by hand
  // TODO: addStory(story) - puts the new story first
  // TODO: return <NewsContext.Provider value={{ stories, loading, addStory }}>{children}</NewsContext.Provider>
  const {data,loading} =useFetch(NEWS_URL)
  const [myStories,setMyStories]=useState([])
  const addStory=(story)=>{
    setMyStories([story,...myStories])
    
  }
  const stories=[...myStories,...(data?.articles||[])]
  return <NewsContext.Provider value={{stories,loading,addStory}}>{children}</NewsContext.Provider>
}
