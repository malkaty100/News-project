import { test, expect } from 'vitest'
import { useContext } from 'react'
import {
  loadComponent,
  loadNewsContext,
  show,
  makeUser,
  mockFetch,
  mockSlowFetch,
  fetchedUrls,
  screen,
  waitFor,
  act,
  ARTICLES,
} from './helpers.jsx'

const NEW_STORY = {
  author: 'Lior',
  title: 'A story written by hand',
  description: 'Short description',
  content: 'Full content',
  urlToImage: null,
}

// A small test component that reads the context, like your components do.
function makeReader(NewsContext) {
  return function Reader() {
    const value = useContext(NewsContext)
    if (!value) return <p>NO VALUE</p>
    const { stories, loading, addStory } = value
    return (
      <div>
        <p data-testid="state">{loading ? 'LOADING' : 'READY'}</p>
        <ul>
          {(Array.isArray(stories) ? stories : []).map((story, i) => (
            <li key={i} data-testid="story">
              {story?.title}
            </li>
          ))}
        </ul>
        <button onClick={() => addStory(NEW_STORY)}>add</button>
      </div>
    )
  }
}

async function renderProvider() {
  const NewsContext = await loadNewsContext()
  const NewsProvider = await loadComponent('NewsProvider')
  const Reader = makeReader(NewsContext)
  show(
    <NewsProvider>
      <Reader />
    </NewsProvider>,
  )
  expect(
    screen.queryByText('NO VALUE'),
    'NewsProvider should render <NewsContext.Provider value={{ stories, loading, addStory }}> around its children',
  ).toBe(null)
}

const titles = () => screen.queryAllByTestId('story').map((li) => li.textContent)

test('Step 3 - Context: NewsContext is created with createContext', async () => {
  await loadNewsContext()
})

test('Step 3 - Context: NewsProvider gets the news from newsapi.org with useFetch (one request)', async () => {
  const fetch = mockFetch()
  await renderProvider()
  await waitFor(() =>
    expect(titles().length, 'stories should have the articles from the API').toBe(ARTICLES.length),
  )
  expect(fetch.mock.calls.length, 'NewsProvider should call the API only once').toBe(1)
  expect(fetchedUrls(fetch)[0], 'call the API with NEWS_URL from src/config.js').toMatch(/newsapi\.org/)
})

test('Step 3 - Context: gives loading and stories (the "articles" array of the API) through the context', async () => {
  const api = mockSlowFetch()
  await renderProvider()
  expect(
    screen.getByTestId('state').textContent,
    'while the API has not answered yet, loading should be true',
  ).toBe('LOADING')
  await act(async () => api.resolve())
  await waitFor(() =>
    expect(screen.getByTestId('state').textContent, 'after the answer, loading should be false').toBe('READY'),
  )
  expect(
    titles(),
    'stories should be the "articles" array from the API answer, in the same order',
  ).toEqual(ARTICLES.map((a) => a.title))
})

test('Step 3 - Context: addStory adds a new story to the top of stories (without calling the API)', async () => {
  const fetch = mockFetch()
  await renderProvider()
  await waitFor(() =>
    expect(titles().length, 'stories should have the articles from the API').toBe(ARTICLES.length),
  )
  await makeUser().click(screen.getByText('add'))
  expect(titles()[0], 'addStory(story) should put the new story first in stories').toBe(NEW_STORY.title)
  expect(titles().length, 'the stories from the API should stay after addStory').toBe(ARTICLES.length + 1)
  expect(fetch.mock.calls.length, 'a new story is kept in the context - it is not sent to the API').toBe(1)
})
