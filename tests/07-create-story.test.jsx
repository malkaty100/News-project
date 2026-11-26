import { test, expect } from 'vitest'
import {
  loadComponent,
  loadNewsContext,
  show,
  makeUser,
  spy,
  field,
  fileInput,
  submitButton,
  waitFor,
} from './helpers.jsx'

const STORY = {
  title: 'Our class built a news site',
  author: 'The React class',
  description: 'A full SPA with React hooks.',
  content: 'We used useState, useEffect, useContext, useRef and a custom hook.',
}

const FIELDS = [
  ['title', /title/i],
  ['author', /author/i],
  ['description', /description/i],
  ['content', /content/i],
]

async function renderForm() {
  const NewsContext = await loadNewsContext()
  const CreateStory = await loadComponent('CreateStory')
  const addStory = spy()
  show(
    <NewsContext.Provider value={{ stories: [], loading: false, addStory }}>
      <CreateStory />
    </NewsContext.Provider>,
  )
  return { addStory, user: makeUser() }
}

function getField(name, regex) {
  const el = field(regex)
  expect(el, `the form should have a field for the ${name} (with a <label>${name[0].toUpperCase() + name.slice(1)}</label>)`).toBeTruthy()
  return el
}

async function fillForm(user, { withImage = true } = {}) {
  for (const [name, regex] of FIELDS) await user.type(getField(name, regex), STORY[name])
  if (withImage) {
    const input = fileInput()
    expect(input, 'the form should have an <input type="file"> for the image').toBeTruthy()
    await user.upload(input, new File(['image'], 'photo.png', { type: 'image/png' }))
  }
}

async function submit(user) {
  const button = submitButton()
  expect(button, 'the form should have a submit <button> inside the <form>').toBeTruthy()
  await user.click(button)
}

test('Step 7 - CreateStory: a form with fields for title, author, description, content and an image file', async () => {
  await renderForm()
  for (const [name, regex] of FIELDS) getField(name, regex)
  expect(fileInput(), 'the form should have an <input type="file"> for the image').toBeTruthy()
  expect(submitButton(), 'the form should have a submit <button> inside the <form>').toBeTruthy()
})

test('Step 7 - CreateStory: submitting the form does not reload the page', async () => {
  const { user } = await renderForm()
  await fillForm(user)
  let reloaded = null
  const listener = (event) => (reloaded = !event.defaultPrevented)
  window.addEventListener('submit', listener)
  try {
    await submit(user)
  } finally {
    window.removeEventListener('submit', listener)
  }
  expect(reloaded, 'the form should be submitted (onSubmit on the <form>)').not.toBe(null)
  expect(reloaded, 'the page should not reload - call event.preventDefault()').toBe(false)
})

test('Step 7 - CreateStory: submit calls addStory with a story object with the same fields as the API', async () => {
  const { user, addStory } = await renderForm()
  await fillForm(user)
  await submit(user)
  await waitFor(() =>
    expect(addStory.mock.calls.length, 'submitting the form should call addStory (from the context) once').toBe(1),
  )
  const story = addStory.mock.calls[0][0] ?? {}
  for (const [name] of FIELDS) {
    expect(story[name], `the story object should have ${name}: the value of the ${name} field (read it from ref.current.value)`).toBe(
      STORY[name],
    )
  }
  expect(
    typeof story.urlToImage === 'string' && story.urlToImage.length > 0,
    'the story should have urlToImage made from the chosen file (ref.current.files[0], for example with URL.createObjectURL)',
  ).toBe(true)
})

test('Step 7 - CreateStory: the image is optional - without a file the story gets no urlToImage', async () => {
  const { user, addStory } = await renderForm()
  await fillForm(user, { withImage: false })
  await submit(user)
  await waitFor(() =>
    expect(
      addStory.mock.calls.length,
      'a story without an image should also be created (check ref.current.files[0] before using it)',
    ).toBe(1),
  )
  expect(
    addStory.mock.calls[0][0]?.urlToImage || null,
    'without a file, urlToImage should be empty (null), so the default image is shown',
  ).toBe(null)
})

test('Step 7 - CreateStory: after submit the fields are cleared and the cursor goes back to the first field', async () => {
  const { user, addStory } = await renderForm()
  await fillForm(user)
  await submit(user)
  await waitFor(() => expect(addStory.mock.calls.length, 'submitting the form should call addStory once').toBe(1))
  for (const [name, regex] of FIELDS) {
    expect(field(regex).value, `after submit, the ${name} field should be empty`).toBe('')
  }
  expect(
    document.activeElement,
    'after submit, put the cursor back in the title field: titleRef.current.focus()',
  ).toBe(field(/title/i))
})
