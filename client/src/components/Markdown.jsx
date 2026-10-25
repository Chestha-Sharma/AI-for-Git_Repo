import React from 'react'

// small markdown renderer (code blocks, bullets, **bold**, `code`). No HTML injection: everything is React elements.
const REF = /^([\w@.\-/]+\.[A-Za-z0-9]+)(?::(\d+)(?:-(\d+))?)?$/

const inline = (text, onRef, resolvePath, key) => {
  const out = []
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g
  let last = 0
  let m
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('`')) {
      const code = tok.slice(1, -1)
      const ref = code.match(REF)
      const path = ref && resolvePath ? resolvePath(ref[1]) : null
      if (path && onRef) {
        out.push(
          <button
            key={`${key}-${i++}`}
            className="code inline rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[0.78rem] text-primary hover:bg-primary/20"
            onClick={() => onRef({ path, start: ref[2] ? Number(ref[2]) : null, end: ref[3] ? Number(ref[3]) : null })}
          >
            {code}
          </button>
        )
      } else {
        out.push(<code key={`${key}-${i++}`} className="inline">{code}</code>)
      }
    } else {
      out.push(<strong key={`${key}-${i++}`}>{tok.slice(2, -2)}</strong>)
    }
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

const Markdown = ({ text, onRef, resolvePath }) => {
  const blocks = []
  const lines = String(text || '').split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim().startsWith('```')) {
      const code = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++])
      i++
      blocks.push({ type: 'code', text: code.join('\n') })
    } else if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line)
      const items = []
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*]|\d+\.)\s+/, ''))
      blocks.push({ type: ordered ? 'ol' : 'ul', items })
    } else if (line.trim() === '') {
      i++
    } else {
      const para = []
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].trim().startsWith('```') && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) para.push(lines[i++])
      blocks.push({ type: 'p', text: para.join(' ') })
    }
  }

  return (
    <div className="md text-sm">
      {blocks.map((b, idx) => {
        if (b.type === 'code') return <pre key={idx}><code>{b.text}</code></pre>
        if (b.type === 'p') return <p key={idx}>{inline(b.text, onRef, resolvePath, idx)}</p>
        const Tag = b.type
        return (
          <Tag key={idx}>
            {b.items.map((it, j) => <li key={j}>{inline(it, onRef, resolvePath, `${idx}-${j}`)}</li>)}
          </Tag>
        )
      })}
    </div>
  )
}

export default Markdown
