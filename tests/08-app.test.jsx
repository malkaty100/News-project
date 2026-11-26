import { test, expect } from 'vitest'
import {
  mockFetch,
  mockSlowFetch,
  screen,
  waitFor,
  act,
  findText,
  cardOf,
  imageSrc,
  isRealSrc,
  comesBefore,
  navButton,
  goTo,
  keyWarnings,
  ARTICLES,
} from './helpers.jsx'
import { renderApp, waitForNews, createStory, makeStory, HOME, CREATE } from './app-flow.jsx'

const [first, second] = ARTICLES
const listShown = () => ARTICLES.every((a) => findText(a.title))
const formShown = () => Boolean(document.querySelector('form'))

test('Step 8 - App: the home screen shows "Loading..." and then the news cards', async () => {
  const api = mockSlowFetch()
  await renderApp()
  expect(screen.queryByText(/loading/i), 'while the news are loading, the home screen should show "Loading..."').toBeTruthy()
  await act(async () => api.resolve())
  await waitForNews()
  expect(listShown(), 'the home screen should show a card for every story').toBe(true)
  expect(screen.queryByText(/loading/i), '"Loading..." should disappear when the news arrive').toBe(null)
})

test('Step 8 - App: the Navbar has a "Home" button and a "Create Story" button', async () => {
  mockFetch()
  await renderApp()
  await waitForNews()
  expect(navButton(HOME), 'the Navbar should have a "Home" button').toBeTruthy()
  expect(navButton(CREATE), 'the Navbar should have a "Create Story" button').toBeTruthy()
})

test('Step 8 - App: clicking a card opens the story page (description, content, image) instead of the list', async () => {
  mockFetch()
  const user = await renderApp()
  await waitForNews()
  await user.click(findText(first.title))
  expect(findText(first.description), 'the story page should show the description of the clicked story').toBeTruthy()
  expect(findText(first.content), 'the story page should show the content of the clicked story').toBeTruthy()
  expect(
    [...document.querySelectorAll('img')].map((img) => img.getAttribute('src')),
    'the story page should show the image of the story',
  ).toContain(first.urlToImage)
  expect(findText(second.title), 'the list should not be shown on the story page (conditional rendering)').toBe(null)
})

test('Step 8 - App: the Navbar stays on every screen, and "Home" goes back to the list', async () => {
  mockFetch()
  const user = await renderApp()
  await waitForNews()
  await user.click(findText(second.title))
  expect(findText(second.content), 'clicking a card should open its story page').toBeTruthy()
  expect(navButton(HOME), 'the Navbar should also be shown on the story page').toBeTruthy()
  await goTo(user, HOME)
  expect(listShown(), '"Home" should show the list of news again').toBe(true)
  expect(findText(second.content), '"Home" should close the story page').toBe(null)
})

test('Step 8 - App: "Create Story" shows the form instead of the list', async () => {
  mockFetch()
  const user = await renderApp()
  await waitForNews()
  expect(formShown(), 'the form should not be shown on the home screen').toBe(false)
  await goTo(user, CREATE)
  expect(formShown(), '"Create Story" should show the CreateStory form').toBe(true)
  expect(findText(first.title), 'the list should not be shown on the create screen').toBe(null)
  expect(navButton(HOME), 'the Navbar should also be shown on the create screen').toBeTruthy()
})

test('Step 8 - App: creating a story shows a success message', async () => {
  mockFetch()
  const user = await renderApp()
  await waitForNews()
  expect(screen.queryByText(/success/i), 'the success message should not be shown before submitting').toBe(null)
  await createStory(user, makeStory(1))
  await waitFor(() =>
    expect(
      screen.queryByText(/success/i),
      'after submitting, show a success message (for example "Story created successfully!")',
    ).toBeTruthy(),
  )
})

test('Step 8 - App: the new story appears first in the list on the home screen', async () => {
  mockFetch()
  const user = await renderApp()
  await waitForNews()
  const story = makeStory(2)
  await createStory(user, story)
  await goTo(user, HOME)
  const newTitle = await waitFor(() => {
    const el = findText(story.title)
    expect(el, 'the new story should be shown in the list on the home screen').toBeTruthy()
    return el
  })
  expect(comesBefore(newTitle, findText(first.title)), 'the new story should be at the top of the list').toBe(true)
  expect(listShown(), 'the stories from the API should stay in the list').toBe(true)
  expect(isRealSrc(imageSrc(cardOf(story.title))), 'the card of the new story should show the chosen image').toBe(true)
})

test('Step 8 - App: a new story without an image shows the default image', async () => {
  mockFetch()
  const user = await renderApp()
  await waitForNews()
  const story = makeStory(3)
  await createStory(user, story, { withImage: false })
  await goTo(user, HOME)
  await waitFor(() => expect(findText(story.title), 'a story without an image should also be created').toBeTruthy())
  expect(isRealSrc(imageSrc(cardOf(story.title))), 'a story without urlToImage should show the default image').toBe(true)
})

test('Step 8 - App: clicking the new story opens its page', async () => {
  mockFetch()
  const user = await renderApp()
  await waitForNews()
  const story = makeStory(4)
  await createStory(user, story)
  await goTo(user, HOME)
  await waitFor(() => expect(findText(story.title), 'the new story should be in the list').toBeTruthy())
  await user.click(findText(story.title))
  expect(findText(story.description), 'the page of the new story should show its description').toBeTruthy()
  expect(findText(story.content), 'the page of the new story should show its content').toBeTruthy()
})

test('Step 8 - App: unique keys also for the stories you create', async () => {
  mockFetch()
  const user = await renderApp()
  await waitForNews()
  await createStory(user, makeStory(5))
  await createStory(user, makeStory(6))
  await goTo(user, HOME)
  await waitFor(() =>
    expect(
      findText(makeStory(5).title) && findText(makeStory(6).title),
      'both new stories should be in the list',
    ).toBeTruthy(),
  )
  expect(
    keyWarnings()[0] ?? null,
    'React warned about the key - every story (also the ones you create) needs a unique key',
  ).toBe(null)
})

test('Step 8 - App: no extra API calls - moving between the screens calls fetch only once', async () => {
  const fetch = mockFetch()
  const user = await renderApp()
  await waitForNews()
  await user.click(findText(first.title))
  await goTo(user, HOME)
  await goTo(user, CREATE)
  await goTo(user, HOME)
  await waitForNews()
  expect(
    fetch.mock.calls.length,
    'the news should be fetched once (useFetch in NewsProvider), not every time the list is shown',
  ).toBe(1)
})
