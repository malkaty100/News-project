// Bonus - not required. The task is approved without it.
import { expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import { mockFetch, waitFor, findText, comesBefore, goTo, bonus, ARTICLES } from './helpers.jsx'
import { renderApp, waitForNews, createStory, makeStory, HOME } from './app-flow.jsx'

bonus('the stories you create stay after a page refresh (saved in localStorage)', async () => {
  mockFetch()
  const user = await renderApp()
  await waitForNews()
  const story = makeStory(7)
  await createStory(user, story, { withImage: false })
  await goTo(user, HOME)

  // "refresh the page": the whole app starts again, localStorage stays
  cleanup()
  mockFetch()
  await renderApp()
  await waitForNews()
  const newTitle = await waitFor(() => {
    const el = findText(story.title)
    expect(el, 'after a refresh, the story you created should still be in the list').toBeTruthy()
    return el
  })
  expect(comesBefore(newTitle, findText(ARTICLES[0].title)), 'it should still be at the top').toBe(true)
})
