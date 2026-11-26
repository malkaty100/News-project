/* eslint-disable no-unused-vars -- delete this line when you start writing the code */
// Step 5: NewsList - the list of all the stories (the home screen).
import NewsStory from '../NewsStory/NewsStory'
import styles from './NewsList.module.css'
import { useContext } from 'react'
import { NewsContext } from '../../context/NewsContext'

/**
 * Reads { stories, loading } with useContext(NewsContext).
 * @param {object} props
 * @param {(story: object) => void} props.onSelectStory - call it with the story whose card was clicked
 */
export default function NewsList({ onSelectStory }) {
  // TODO: const { stories, loading } = useContext(NewsContext)
  // TODO: while loading -> show "Loading..."
  // TODO: otherwise map over stories -> <NewsStory key={...} ... onClick={() => onSelectStory(story)} />
  const {stories,loading}=useContext(NewsContext)
  return <>
  {loading?<h2>loading...</h2>:
  <>
  {stories.map((story,key)=><NewsStory key={key} author={story.author} title={story.title} urlToImage={story.urlToImage} onClick={()=>{onSelectStory(story)}} />)}
  </>}
  </>
}
