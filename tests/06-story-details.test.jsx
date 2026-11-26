import { test, expect } from 'vitest'
import {
  loadComponent,
  show,
  screen,
  textRegExp,
  imageSrc,
  isRealSrc,
  ARTICLES,
} from './helpers.jsx'

async function renderDetails(story) {
  const StoryDetails = await loadComponent('StoryDetails')
  return show(<StoryDetails story={story} />)
}

test('Step 6 - StoryDetails: shows the description, the content and the image of the story', async () => {
  const story = ARTICLES[0]
  const { container } = await renderDetails(story)
  expect(screen.queryByText(textRegExp(story.description)), 'the story page should show the description').toBeTruthy()
  expect(screen.queryByText(textRegExp(story.content)), 'the story page should show the content').toBeTruthy()
  expect(
    [...container.querySelectorAll('img')].map((img) => img.getAttribute('src')),
    'the story page should show an <img> with the urlToImage of the story',
  ).toContain(story.urlToImage)
})

test('Step 6 - StoryDetails: shows a default image when the story has no urlToImage', async () => {
  const story = ARTICLES[1] // urlToImage: null
  const { container } = await renderDetails(story)
  expect(screen.queryByText(textRegExp(story.content)), 'the story page should show the content').toBeTruthy()
  expect(
    isRealSrc(imageSrc(container)),
    'when urlToImage is null, show a default image (for example src/assets/default-news.svg)',
  ).toBe(true)
})
