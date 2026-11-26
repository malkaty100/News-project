/* eslint-disable no-unused-vars -- delete this line when you start writing the code */
// Step 7: CreateStory - a form to add a story by hand.
import styles from './CreateStory.module.css'

export default function CreateStory() {
  // TODO: const { addStory } = useContext(NewsContext)
  // TODO: a ref for every field: title, author, description, content, image (a file input)
  // TODO: a <form> with a <label> for every field (Title, Author, Description, Content, Image)
  //       and a submit button
  // TODO: on submit:
  //   - event.preventDefault()
  //   - read the values from ref.current.value, and the file from ref.current.files[0]
  //   - build a story object with the same fields as the API:
  //       { author, title, description, content, urlToImage }   (no file -> urlToImage: null)
  //   - addStory(story)
  //   - show the success message: "Story created successfully!"
  //   - clear the fields and put the cursor in the title field: titleRef.current.focus()
  return null
}
