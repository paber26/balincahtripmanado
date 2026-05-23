import { defineEventHandler } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler((event) => {
  const url = event.node.req.url || ''
  
  // Clean query parameters from URL to check extension
  const pathname = url.split('?')[0]
  const ext = path.extname(pathname)
  
  // If the path has an extension, bypass and let the static asset server handle it
  if (ext) {
    return
  }

  // Serve public/admin/index.html
  const filePath = path.resolve(process.cwd(), 'public/admin/index.html')
  if (fs.existsSync(filePath)) {
    event.node.res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return fs.readFileSync(filePath, 'utf-8')
  }
})
