/* eslint-disable no-unused-vars -- delete this line when you start writing the code */
// Step 6: StoryDetails - the page of one story.
import styles from './StoryDetails.module.css'

/**
 * @param {object} props
 * @param {{ title: string, author: string, description: string, content: string, urlToImage: string|null }} props.story
 */
export default function StoryDetails({ story }) {
  // TODO: show the image (or the default image), the description and the content (the title is welcome too)
  const defaultImg="src/assets/default-news.svg"
  return <div>
    <h3>{story.title}</h3> 
     <img src={story.urlToImage||defaultImg}/> 
     <h4>{story.description}</h4> 
     <p>{story.content}</p>

  </div>
}
