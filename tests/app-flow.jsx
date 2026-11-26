// Helpers for the tests of the whole app (App inside NewsProvider, like in main.jsx).
// You don't need to read or change this file.
import { expect } from 'vitest'
import {
  loadComponent,
  show,
  makeUser,
  field,
  fileInput,
  submitButton,
  findText,
  waitFor,
  goTo,
  ARTICLES,
} from './helpers.jsx'

export async function renderApp() {
  const NewsProvider = await loadComponent('NewsProvider')
  const App = await loadComponent('App')
  show(
    <NewsProvider>
      <App />
    </NewsProvider>,
  )
  return makeUser()
}

/** Waits until the news cards from the API are on the home screen. */
export async function waitForNews() {
  await waitFor(() =>
    expect(
      findText(ARTICLES[0].title),
      'the home screen should show the news cards (App -> NewsList inside NewsProvider)',
    ).toBeTruthy(),
  )
}

export const HOME = /home/i
export const CREATE = /create/i

export function makeStory(n) {
  return {
    title: `Breaking story number ${n}`,
    author: `Reporter ${n}`,
    description: `Description of story ${n}.`,
    content: `The full content of story ${n}.`,
  }
}

/** Opens the create screen, fills the form and submits it. */
export async function createStory(user, story, { withImage = true } = {}) {
  await goTo(user, CREATE)
  for (const name of ['title', 'author', 'description', 'content']) {
    const el = field(new RegExp(name, 'i'))
    expect(el, `the create screen should have a form with a field for the ${name}`).toBeTruthy()
    await user.type(el, story[name])
  }
  if (withImage) {
    const input = fileInput()
    expect(input, 'the form should have an <input type="file"> for the image').toBeTruthy()
    await user.upload(input, new File(['image'], 'photo.png', { type: 'image/png' }))
  }
  const button = submitButton()
  expect(button, 'the form should have a submit button').toBeTruthy()
  await user.click(button)
}
