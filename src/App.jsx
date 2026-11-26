/* eslint-disable no-unused-vars -- delete this line when you start writing the code */
// Step 8: App - chooses which screen to show (Single Page Application, no router).
import styles from './App.module.css'

export default function App() {
  // TODO: useState for the current screen ("home" / "details" / "create")
  // TODO: useState for the selected story
  // TODO: always show <Navbar onNavigate={...} />
  // TODO: conditional rendering:
  //   "home"    -> <NewsList onSelectStory={...} />   (clicking a card: save the story + go to "details")
  //   "details" -> <StoryDetails story={selectedStory} />
  //   "create"  -> <CreateStory />
  return null
}
