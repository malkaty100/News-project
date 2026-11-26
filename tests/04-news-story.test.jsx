import { test, expect } from 'vitest'
import {
  loadComponent,
  show,
  makeUser,
  spy,
  screen,
  textRegExp,
  imageSrc,
  isRealSrc,
  ARTICLES,
} from './helpers.jsx'

async function renderStory(article, onClick = spy()) {
  const NewsStory = await loadComponent('NewsStory')
  const view = show(
    <NewsStory
      author={article.author}
      title={article.title}
      urlToImage={article.urlToImage}
      onClick={onClick}
    />,
  )
  return { ...view, onClick }
}

test('Step 4 - NewsStory: shows the title, the author and the image it gets in props', async () => {
  const article = ARTICLES[0]
  const { container } = await renderStory(article)
  expect(screen.queryByText(textRegExp(article.title)), `the card should show the title "${article.title}"`).toBeTruthy()
  expect(screen.queryByText(textRegExp(article.author)), `the card should show the author "${article.author}"`).toBeTruthy()
  expect(
    imageSrc(container),
    'the card should show an <img> whose src is the urlToImage prop',
  ).toBe(article.urlToImage)
})

test('Step 4 - NewsStory: shows a default image when there is no urlToImage', async () => {
  const article = ARTICLES[1] // urlToImage: null
  const { container } = await renderStory(article)
  expect(screen.queryByText(textRegExp(article.title)), `the card should show the title "${article.title}"`).toBeTruthy()
  expect(
    isRealSrc(imageSrc(container)),
    'when urlToImage is null, show a default image (for example src/assets/default-news.svg)',
  ).toBe(true)
})

test('Step 4 - NewsStory: clicking the card calls the click function from props', async () => {
  const article = ARTICLES[2]
  const { onClick } = await renderStory(article)
  const title = screen.queryByText(textRegExp(article.title))
  expect(title, `the card should show the title "${article.title}"`).toBeTruthy()
  await makeUser().click(title)
  expect(onClick.mock.calls.length, 'clicking the card should call the onClick prop once').toBe(1)
})
