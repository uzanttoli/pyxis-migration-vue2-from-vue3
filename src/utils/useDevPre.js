export function useDevPre(data) {
  const isDev = process.env.NODE_ENV === 'development'
  return isDev ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : ''
}
