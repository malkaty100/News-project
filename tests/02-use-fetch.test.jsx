import { test, expect } from 'vitest'
import {
  loadComponent,
  showHook,
  mockFetch,
  mockSlowFetch,
  fetchedUrls,
  waitFor,
  act,
  NEWS_RESPONSE,
} from './helpers.jsx'

const URL_1 = 'https://api.example.com/news'

function checkShape(result) {
  expect(
    result.current !== null && typeof result.current === 'object',
    'useFetch(url) should return an object: { data, loading }',
  ).toBe(true)
}

test('Step 2 - useFetch: returns { data, loading } - loading is true until the answer arrives', async () => {
  const useFetch = await loadComponent('useFetch')
  const api = mockSlowFetch()
  const { result } = showHook(() => useFetch(URL_1))
  checkShape(result)
  expect(result.current.loading, 'while waiting for the API, loading should be true').toBe(true)
  expect(result.current.data ?? null, 'before the answer arrives, data should be empty (null)').toBe(null)

  await act(async () => api.resolve())
  await waitFor(() =>
    expect(result.current.loading, 'after the answer arrives, loading should be false').toBe(false),
  )
  expect(result.current.data, 'data should be the JSON that the API returned').toEqual(NEWS_RESPONSE)
})

test('Step 2 - useFetch: fetches the url it gets - only once (useEffect with an empty dependency array)', async () => {
  const useFetch = await loadComponent('useFetch')
  const fetch = mockFetch()
  const { result, rerender } = showHook(() => useFetch(URL_1))
  await waitFor(() =>
    expect(result.current?.data, 'useFetch should return the data from the API').toBeTruthy(),
  )
  rerender()
  rerender()
  await act(() => new Promise((r) => setTimeout(r, 50)))
  expect(fetchedUrls(fetch), 'useFetch(url) should call fetch(url) with the url it got').toContain(URL_1)
  expect(
    fetch.mock.calls.length,
    'fetch should be called only once, even when the component renders again',
  ).toBe(1)
})

test('Step 2 - useFetch: is generic - works with any url and returns any JSON as it is', async () => {
  const useFetch = await loadComponent('useFetch')
  const users = { users: [{ id: 1, name: 'Shira' }], total: 1 }
  const fetch = mockFetch(users)
  const { result } = showHook(() => useFetch('https://api.example.com/users'))
  await waitFor(() =>
    expect(
      result.current?.data,
      'useFetch should return the whole JSON of the url it got - it should not know anything about news',
    ).toEqual(users),
  )
  expect(fetchedUrls(fetch)).toContain('https://api.example.com/users')
})

test('Step 2 - useFetch: saves the answer in localStorage', async () => {
  const useFetch = await loadComponent('useFetch')
  mockFetch()
  const { result } = showHook(() => useFetch(URL_1))
  await waitFor(() =>
    expect(result.current?.data, 'useFetch should return the data from the API').toBeTruthy(),
  )
  const saved = Object.keys(localStorage).map((key) => localStorage.getItem(key))
  expect(
    saved.some((value) => value?.includes(NEWS_RESPONSE.articles[0].title)),
    'after the answer arrives, save it in localStorage (localStorage.setItem with JSON.stringify)',
  ).toBe(true)
})

test('Step 2 - useFetch: checks localStorage first - does not call the API again when the data is saved', async () => {
  const useFetch = await loadComponent('useFetch')
  mockFetch()
  const first = showHook(() => useFetch(URL_1))
  await waitFor(() =>
    expect(first.result.current?.data, 'useFetch should return the data from the API').toBeTruthy(),
  )
  first.unmount()

  // "refresh the page": a new component, and an API that should not be called
  const secondFetch = mockFetch({ status: 'ok', articles: [] })
  const second = showHook(() => useFetch(URL_1))
  await waitFor(() =>
    expect(
      second.result.current?.data,
      'the second time, data should come from localStorage (the same JSON as before)',
    ).toEqual(NEWS_RESPONSE),
  )
  expect(second.result.current.loading, 'with data from localStorage, loading should be false').toBe(false)
  expect(
    secondFetch.mock.calls.length,
    'when the data is already in localStorage, do not call fetch again',
  ).toBe(0)
})
