/* eslint-disable no-unused-vars -- delete this line when you start writing the code */
// Step 7: CreateStory - a form to add a story by hand.
import { useContext ,useRef, useState } from 'react'
import styles from './CreateStory.module.css'
import { NewsContext } from '../../context/NewsContext'

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
   const title=useRef("")
   const author=useRef("")
   const description=useRef("")
   const content=useRef("")
   const img=useRef(null)
   const {addStory}=useContext(NewsContext)
   const [success,setSuccess]=useState(false)
   const hundleSubmit=(e)=>{
    e.preventDefault()
    const story={author:author.current.value, title:title.current.value, description:description.current.value, content:content.current.value, urlToImage:img.current.files[0]?URL.createObjectURL(img.current.files[0]):null }
    addStory(story)
    setSuccess(true)
    title.current.focus()
    author.current.value=""
    description.current.value=""
    content.current.value=""
    title.current.value=""
    img.current.value=""
   }
  return <>{success&&<h2>Story created successfully!</h2>}
  <form onSubmit={hundleSubmit}>
    <label htmlFor="title">Title</label>
      <input required ref={title} type="text" id="title" />
    <label htmlFor="author">Author</label>
      <input required ref={author} type="text" id="author"/>
    <label htmlFor="description">Description</label>
      <input required ref={description} type="text" id="description"/>
    <label htmlFor="content">Content</label> 
      <input required ref={content} type="text" id="content"/>
      <input ref={img} type="file" id="img"/>
      <input type='submit'/>
  </form></>
}
