(async () => {
  // Old Testament only: books 0-38, 929 chapters. Swap in NT_BOOKS to do the rest.
  const OT_BOOKS = [50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,
                    12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4]
  const BATCH = 40

  const token = Object.keys(localStorage)
    .filter(k => k.startsWith('@@auth0spajs@@'))
    .map(k => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } })
    .find(v => v?.body?.access_token)?.body.access_token
  if (!token) throw new Error('No Auth0 access token in localStorage. Sign in, then re-run.')

  const headers = { 'content-type': 'application/json', authorization: `Bearer ${token}` }

  const post = async (url, body) => {
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
    if (res.status === 401) throw new Error('401. The cached token has expired — reload the page and re-run.')
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}: ${await res.text()}`)
    return res.json()
  }

  // The url names a cycle only when it is not the default, so fall back to asking.
  let cycleId = new URLSearchParams(location.search).get('cycle')
  if (!cycleId) {
    const summary = await post('/api/trpc/readSummary.get', {})
    const payload = summary.result.data
    if (payload.__result !== 'OK') throw new Error(`readSummary.get failed: ${JSON.stringify(payload)}`)
    cycleId = payload.data.readingCycles.find(c => c.default)?.id
    if (!cycleId) throw new Error('No default reading cycle to write against.')
  }
  console.log(`Writing to reading cycle ${cycleId}`)

  const dateRead = new Date().toISOString()
  const work = OT_BOOKS.flatMap((chapterCount, bookId) =>
    Array.from({ length: chapterCount }, (_, chapterId) =>
      ({ readingCycleId: cycleId, bookId, chapterId, dateRead })))

  let done = 0
  for (let i = 0; i < work.length; i += BATCH) {
    const chunk = work.slice(i, i + BATCH)
    const path = Array(chunk.length).fill('readingRecord.create').join(',')
    const results = await post(`/api/trpc/${path}?batch=1`, Object.fromEntries(chunk.map((c, n) => [n, c])))

    results.forEach((r, n) => {
      if (r.error) throw new Error(`${JSON.stringify(chunk[n])} -> ${r.error.message ?? JSON.stringify(r.error)}`)
      if (r.result?.data?.__result === 'ERR') throw new Error(`${JSON.stringify(chunk[n])} -> ${JSON.stringify(r.result.data.err)}`)
    })

    done += chunk.length
    console.log(`${done}/${work.length}`)
  }

  console.log(`Done. ${done} chapters written. Reload the page to see it.`)
})()
