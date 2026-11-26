import { test, expect } from 'vitest'
import {
  loadComponent,
  loadNewsContext,
  show,
  makeUser,
  spy,
  screen,
  textRegExp,
  cardOf,
  imageSrc,
  keyWarnings,
  ARTICLES,
} from './helpers.jsx'

async function renderList({ stories = ARTICLES, loading = false } = {}) {
  const NewsContext = await loadNewsContext()
  const NewsList = await loadComponent('NewsList')
  const onSelectStory = spy()
  const value = { stories, loading, addStory: spy() }
  show(
    <NewsContext.Provider value={value}>
      <NewsList onSelectStory={onSelectStory} />
    </NewsContext.Provider>,
  )
  return { onSelectStory }
}

const shownTitles = () => ARTICLES.filter((a) => screen.queryByText(textRegExp(a.title)))

test('Step 5 - NewsList: shows "Loading..." while loading is true', async () => {
  await renderList({ stories: [], loading: true })
  expect(
    screen.queryByText(/loading/i),
    'while loading (from the context) is true, show "Loading..."',
  ).toBeTruthy()
})

test('Step 5 - NewsList: shows a NewsStory card for every story in the context (map)', async () => {
  await renderList()
  expect(
    shownTitles().length,
    'NewsList should read the stories with useContext(NewsContext) and show a card for each one',
  ).toBe(ARTICLES.length)
  expect(screen.queryByText(/loading/i), 'when loading is false, "Loading..." should not be shown').toBe(null)
  expect(imageSrc(cardOf(ARTICLES[0].title)), 'every card should show the image of its story').toBe(
    ARTICLES[0].urlToImage,
  )
})

test('Step 5 - NewsList: every card gets a unique key', async () => {
  await renderList()
  expect(shownTitles().length, 'NewsList should show a card for each story').toBe(ARTICLES.length)
  expect(
    keyWarnings()[0] ?? null,
    'React warned about the key - give every <NewsStory> in the map a unique key',
  ).toBe(null)
})

test('Step 5 - NewsList: clicking a card calls onSelectStory with that story', async () => {
  const { onSelectStory } = await renderList()
  const title = screen.queryByText(textRegExp(ARTICLES[1].title))
  expect(title, 'NewsList should show a card for each story').toBeTruthy()
  await makeUser().click(title)
  expect(onSelectStory.mock.calls.length, 'clicking a card should call onSelectStory (a prop of NewsList) once').toBe(1)
  expect(
    onSelectStory.mock.calls[0][0]?.title,
    'onSelectStory should get the whole story object of the card that was clicked',
  ).toBe(ARTICLES[1].title)
})
