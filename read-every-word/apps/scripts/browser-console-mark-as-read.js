(async () => {
  // Chapter count per book, in the order packages/domain/src/lib/bible.ts declares
  // them. A book's id IS its position here, starting at 0 -- Genesis is 0, Malachi
  // is 38, Matthew is 39, Revelation is 65. Repeated numbers are not duplicates:
  // Mark, Romans and 1 Corinthians all genuinely have 16 chapters.
  const CHAPTERS = {
    // Old Testament, books 0-38, 929 chapters
    'Genesis': 50,          'Exodus': 40,          'Leviticus': 27,
    'Numbers': 36,          'Deuteronomy': 34,     'Joshua': 24,
    'Judges': 21,           'Ruth': 4,             '1 Samuel': 31,
    '2 Samuel': 24,         '1 Kings': 22,         '2 Kings': 25,
    '1 Chronicles': 29,     '2 Chronicles': 36,    'Ezra': 10,
    'Nehemiah': 13,         'Esther': 10,          'Job': 42,
    'Psalm': 150,           'Proverbs': 31,        'Ecclesiastes': 12,
    'Song of Solomon': 8,   'Isaiah': 66,          'Jeremiah': 52,
    'Lamentations': 5,      'Ezekiel': 48,         'Daniel': 12,
    'Hosea': 14,            'Joel': 3,             'Amos': 9,
    'Obadiah': 1,           'Jonah': 4,            'Micah': 7,
    'Nahum': 3,             'Habakkuk': 3,         'Zephaniah': 3,
    'Haggai': 2,            'Zechariah': 14,       'Malachi': 4,
    // New Testament, books 39-65, 260 chapters
    'Matthew': 28,          'Mark': 16,            'Luke': 24,
    'John': 21,             'Acts': 28,            'Romans': 16,
    '1 Corinthians': 16,    '2 Corinthians': 13,   'Galatians': 6,
    'Ephesians': 6,         'Philippians': 4,      'Colossians': 4,
    '1 Thessalonians': 5,   '2 Thessalonians': 3,  '1 Timothy': 6,
    '2 Timothy': 4,         'Titus': 3,            'Philemon': 1,
    'Hebrews': 13,          'James': 5,            '1 Peter': 5,
    '2 Peter': 3,           '1 John': 5,           '2 John': 1,
    '3 John': 1,            'Jude': 1,             'Revelation': 22
  }
  const NAMES = Object.keys(CHAPTERS)
  const BOOKS = Object.values(CHAPTERS)

  // Which books to mark, as an inclusive book id range.
  //   whole Bible [0, 65]  ·  Old Testament [0, 38]  ·  New Testament [39, 65]
  //
  // A range over the whole table rather than a separate per-testament list, because
  // the api takes absolute book ids: numbering a New-Testament-only list from 0
  // would write Matthew's chapters onto Genesis.
  const [FIRST_BOOK, LAST_BOOK] = [0, 65]
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
  const work = []
  for (let bookId = FIRST_BOOK; bookId <= LAST_BOOK; bookId++) {
    for (let chapterId = 0; chapterId < BOOKS[bookId]; chapterId++) {
      work.push({ readingCycleId: cycleId, bookId, chapterId, dateRead })
    }
  }
  console.log(`${work.length} chapters, ${NAMES[FIRST_BOOK]} to ${NAMES[LAST_BOOK]}`)

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
