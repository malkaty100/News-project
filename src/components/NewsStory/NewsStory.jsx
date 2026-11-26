/* eslint-disable no-unused-vars -- delete this line when you start writing the code */
// Step 4: NewsStory - the card of one story.
import styles from './NewsStory.module.css'

/**
 * @param {object} props
 * @param {string} props.author     - the writer or the source of the story
 * @param {string} props.title      - the title
 * @param {string|null} props.urlToImage - the image (null -> show the default image src/assets/default-news.svg)
 * @param {() => void} props.onClick - call it when the card is clicked
 */
export default function NewsStory({ author, title, urlToImage, onClick }) {
  // TODO: a card (styles.card) with an <img>, the title and the author
  // TODO: clicking the card calls onClick
  return null
}
