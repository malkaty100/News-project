import { test, expect, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadModule } from './helpers.jsx'

test('Step 1 - API key: .gitignore ignores the .env file', () => {
  const lines = readFileSync(resolve(process.cwd(), '.gitignore'), 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
  const ignored = lines.some(
    (line) => /^\/?\.env(\*|\.\*|\.local)?$/.test(line) || line === '*.env',
  )
  expect(
    ignored,
    'add a line ".env" to .gitignore, so git never pushes your API key',
  ).toBe(true)
})

test('Step 1 - API key: config.js builds NEWS_URL with the key from import.meta.env.VITE_NEWS_API_KEY', async () => {
  vi.stubEnv('VITE_NEWS_API_KEY', 'test-key-123')
  vi.resetModules()
  const { NEWS_URL } = await loadModule('config')
  expect(typeof NEWS_URL, 'src/config.js should export NEWS_URL (a string)').toBe('string')
  expect(NEWS_URL, 'NEWS_URL should be an address of newsapi.org').toMatch(/newsapi\.org/)
  expect(
    NEWS_URL,
    'NEWS_URL should contain the key from import.meta.env.VITE_NEWS_API_KEY (do not write the key itself in the code)',
  ).toContain('test-key-123')
})
