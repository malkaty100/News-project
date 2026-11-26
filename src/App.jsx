/* eslint-disable no-unused-vars -- delete this line when you start writing the code */
// Step 8: App - chooses which screen to show (Single Page Application, no router).
import { useState } from 'react'
import styles from './App.module.css'
import Navbar from './components/Navbar/Navbar'
import NewsList from './components/NewsList/NewsList'
import StoryDetails from './components/StoryDetails/StoryDetails'
import CreateStory from './components/CreateStory/CreateStory'

export default function App() {
  // TODO: useState for the current screen ("home" / "details" / "create")
  // TODO: useState for the selected story
  // TODO: always show <Navbar onNavigate={...} />
  // TODO: conditional rendering:
  //   "home"    -> <NewsList onSelectStory={...} />   (clicking a card: save the story + go to "details")
  //   "details" -> <StoryDetails story={selectedStory} />
  //   "create"  -> <CreateStory />
  const [screen,setScreen]=useState("home")
  const [selectedStory,setSelectedStory]=useState({})
  return <> <Navbar onNavigate={setScreen}/>
  {screen==="home"?<NewsList onSelectStory={(story)=>{setSelectedStory(story); setScreen("datails")}}/>
  :screen==="datails"?<StoryDetails story={selectedStory}/>
  :<CreateStory/>}</>
}
