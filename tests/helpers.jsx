// Shared helpers for the tests. You don't need to read or change this file.
import { test, vi, expect } from 'vitest'
import { render, renderHook, within, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export { within, screen, waitFor, act }

function firstLine(error) {
  return String(error?.message ?? error).split('\n')[0]
}

// Each file is imported inside the test, so a mistake in one file
// fails only the tests of that file, with a readable message.
const FILES = {
  config: ['src/config.js', () => import('../src/config.js')],
  useFetch: ['src/hooks/useFetch.js', () => import('../src/hooks/useFetch.js')],
  NewsContext: ['src/context/NewsContext.js', () => import('../src/context/NewsContext.js')],
  NewsProvider: ['src/context/NewsProvider.jsx', () => import('../src/context/NewsProvider.jsx')],
  Navbar: ['src/components/Navbar/Navbar.jsx', () => import('../src/components/Navbar/Navbar.jsx')],
  NewsStory: ['src/components/NewsStory/NewsStory.jsx', () => import('../src/components/NewsStory/NewsStory.jsx')],
  NewsList: ['src/components/NewsList/NewsList.jsx', () => import('../src/components/NewsList/NewsList.jsx')],
  StoryDetails: ['src/components/StoryDetails/StoryDetails.jsx', () => import('../src/components/StoryDetails/StoryDetails.jsx')],
  CreateStory: ['src/components/CreateStory/CreateStory.jsx', () => import('../src/components/CreateStory/CreateStory.jsx')],
  App: ['src/App.jsx', () => import('../src/App.jsx')],
}

// Terminal color codes (ESC [ ... m)
const COLOR_CODES = new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g')

// A syntax error comes as a long colored box - keep only "file:line:col - what is wrong".
function describeLoadError(error) {
  const text = String(error?.message ?? error).replace(COLOR_CODES, '')
  const problem = text.match(/\[[A-Z_]*ERROR\]\s*(.+)/)?.[1]?.trim()
  const where = text.match(/((?:src|tests)\/[^\s\]]+:\d+:\d+)/)?.[1]
  if (problem) return where ? `${where} - ${problem}` : problem
  return firstLine(error)
}

/** Imports a file of the project (fresh every time), e.g. await loadModule('config') */
export async function loadModule(name) {
  const [path, load] = FILES[name]
  try {
    return await load()
  } catch (error) {
    throw new Error(`could not load ${path}: ${describeLoadError(error)}`)
  }
}

/** Imports the default export of a component or hook, e.g. await loadComponent('NewsStory') */
export async function loadComponent(name) {
  const module = await loadModule(name)
  if (typeof module.default !== 'function') {
    throw new Error(
      `${FILES[name][0]} should "export default" the ${name} function`,
    )
  }
  return module.default
}

/** The NewsContext object (created with createContext). */
export async function loadNewsContext() {
  const { NewsContext } = await loadModule('NewsContext')
  if (!NewsContext?.Provider) {
    throw new Error(
      'src/context/NewsContext.js should export NewsContext made with createContext(): export const NewsContext = createContext(...)',
    )
  }
  return NewsContext
}

/** Throws a clear error if the student's code threw inside an event handler. */
export function checkPageErrors() {
  const errors = globalThis.__pageErrors
  if (errors.length) {
    const error = errors[0]
    errors.length = 0
    throw new Error(`Your code threw an error: ${firstLine(error)}`)
  }
}

/** Renders a React element and fails clearly if the component crashed. */
export function show(element) {
  globalThis.__pageErrors.length = 0
  let result
  try {
    result = render(element)
  } catch (error) {
    throw new Error(`The component crashed while rendering: ${firstLine(error)}`)
  }
  checkPageErrors()
  return result
}

/** renderHook that fails clearly if the hook crashed. */
export function showHook(hook, options) {
  try {
    return renderHook(hook, options)
  } catch (error) {
    throw new Error(`The hook crashed: ${firstLine(error)}`)
  }
}

/** A user that clicks and types like a real person, and reports errors from event handlers. */
export function makeUser() {
  const user = userEvent.setup()
  const wrapped = {}
  for (const name of ['click', 'type', 'clear', 'upload', 'keyboard']) {
    wrapped[name] = async (...args) => {
      try {
        await user[name](...args)
      } catch (error) {
        throw new Error(`Your code threw an error: ${firstLine(error)}`)
      }
      checkPageErrors()
    }
  }
  return wrapped
}

/** A spy function that remembers how it was called. */
export function spy() {
  return vi.fn()
}

/** A bonus test: shown with a star, never blocks the approval. */
export function bonus(name, fn) {
  test(`Bonus: ${name}`, async ({ task }) => {
    task.meta.bonus = true
    try {
      await fn()
      task.meta.bonusDone = true
    } catch (error) {
      task.meta.bonusDone = false
      task.meta.bonusReason = firstLine(error)
    }
  })
}

export const escapeRegExp = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** Matches an element whose own text contains `text` (case-insensitive). */
export const textRegExp = (text) => new RegExp(escapeRegExp(text), 'i')

// ---------- fake news API ----------

export const ARTICLES = [
  {
    source: { id: 'bbc-news', name: 'BBC News' },
    author: 'Dana Levi',
    title: 'City opens a new solar park',
    description: 'The park will power 20,000 homes.',
    url: 'https://example.com/solar-park',
    urlToImage: 'https://example.com/images/solar.jpg',
    publishedAt: '2026-11-20T08:00:00Z',
    content: 'Officials opened the largest solar park in the region on Monday.',
  },
  {
    source: { id: null, name: 'Tech Daily' },
    author: 'Noa Cohen',
    title: 'Students build a robot that waters plants',
    description: 'A school project turned into a startup.',
    url: 'https://example.com/robot',
    urlToImage: null,
    publishedAt: '2026-11-21T09:30:00Z',
    content: 'The robot checks the soil every hour and waters only when needed.',
  },
  {
    source: { id: 'reuters', name: 'Reuters' },
    author: 'Maya Katz',
    title: 'Local team wins the national final',
    description: 'A last-minute goal decided the game.',
    url: 'https://example.com/final',
    urlToImage: 'https://example.com/images/final.jpg',
    publishedAt: '2026-11-22T19:45:00Z',
    content: 'Thousands of fans celebrated in the streets after the match.',
  },
]

export const NEWS_RESPONSE = {
  status: 'ok',
  totalResults: ARTICLES.length,
  articles: ARTICLES,
}

const jsonResponse = (payload) =>
  new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })

/** Replaces the global fetch with a fake that answers `payload`. Returns the vi.fn (fetch.mock.calls...). */
export function mockFetch(payload = NEWS_RESPONSE) {
  const fake = vi.fn(async () => jsonResponse(payload))
  vi.stubGlobal('fetch', fake)
  return fake
}

/** Like mockFetch, but the answer arrives only when you call resolve(). */
export function mockSlowFetch(payload = NEWS_RESPONSE) {
  const waiting = []
  const fake = vi.fn(
    () => new Promise((resolve) => waiting.push(() => resolve(jsonResponse(payload)))),
  )
  vi.stubGlobal('fetch', fake)
  return {
    fetch: fake,
    resolve: () => waiting.splice(0).forEach((answer) => answer()),
  }
}

/** The urls that fetch was called with. */
export const fetchedUrls = (fake) =>
  fake.mock.calls.map(([input]) => String(input?.url ?? input))

// ---------- page ----------

/** Walks up from `el` (inclusive) and returns the elements on the way. */
function ancestors(el, stop = document.body) {
  const list = []
  for (let node = el; node && node !== stop && node.nodeType === 1; node = node.parentElement) {
    list.push(node)
  }
  return list
}

/** The element that shows a text (the smallest one). */
export function findText(text, scope = document.body) {
  return within(scope).queryAllByText(textRegExp(text))[0] ?? null
}

/** The card around a title: the closest element around the title that also has an <img>. */
export function cardOf(title, scope = document.body) {
  const titleEl = findText(title, scope)
  if (!titleEl) return null
  return ancestors(titleEl, scope.parentElement).find((el) => el.querySelector('img')) ?? titleEl
}

/** The src attribute of the image inside an element ("" if there is no image). */
export const imageSrc = (el) =>
  el?.querySelector?.('img')?.getAttribute('src') ?? ''

/** true if `src` looks like a real image address (not empty, not "null"/"undefined"). */
export const isRealSrc = (src) =>
  Boolean(src) && !['null', 'undefined', '[object Object]'].includes(src.trim())

/** true if element `a` comes before element `b` on the page. */
export const comesBefore = (a, b) =>
  Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)

/** A form field by its label (or placeholder / name), e.g. field(/title/i) */
export function field(name, scope = document.body) {
  const q = within(scope)
  const found =
    q.queryAllByLabelText(name)[0] ??
    q.queryAllByPlaceholderText(name)[0] ??
    [...scope.querySelectorAll('input, textarea')].find((el) =>
      name.test(el.getAttribute('name') ?? ''),
    )
  return found ?? null
}

/** The file input of a form. */
export const fileInput = (scope = document.body) =>
  scope.querySelector('input[type="file"]')

/** The submit button of the form. */
export function submitButton(scope = document.body) {
  return (
    scope.querySelector(
      'form button[type="submit"], form input[type="submit"], form button:not([type])',
    ) ?? null
  )
}

/** A navigation button or link (inside <nav> if there is one), e.g. navButton(/home/i) */
export function navButton(name) {
  const nav = document.querySelector('nav') ?? document.body
  const q = within(nav)
  return q.queryAllByRole('button', { name })[0] ?? q.queryAllByRole('link', { name })[0] ?? null
}

/** React warnings about keys in lists (since the test file started). */
export const keyWarnings = () => globalThis.__keyWarnings

/** Clicks a navbar button, with a clear message if it is missing. */
export async function goTo(user, name) {
  const button = navButton(name)
  expect(button, `the Navbar should have a button/link that matches ${name}`).toBeTruthy()
  await user.click(button)
}

