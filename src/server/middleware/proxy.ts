import { defineEventHandler } from 'h3'
import http from 'http'
import https from 'https'
import { URL } from 'url'

export default defineEventHandler(async (event) => {
  const req = event.node.req
  const res = event.node.res
  
  const url = req.url || '/'
  if (!url.startsWith('/proxy')) return;
  
  const baseUrl = 'https://ajcontent.akamaized.net'
  const baseHeaders = {
    'Host': 'ajcontent.akamaized.net',
    'Referer': 'https://desktop.animaljam.com/gameClient/game/index.html'
  }
  
  const path = url.substring('/proxy'.length) || '/'
  
  return new Promise((resolve) => {
    try {
      const targetUrl = `${baseUrl}${path}`
      const parsedUrl = new URL(targetUrl)
      
      const httpClient = parsedUrl.protocol === 'https:' ? https : http
      
      const options = {
        protocol: parsedUrl.protocol,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: req.method,
        headers: { ...req.headers, ...baseHeaders }
      }
      
      delete options.headers.host
      
      const proxyReq = httpClient.request(options, (proxyRes) => {
        res.statusCode = proxyRes.statusCode || 200
        
        Object.keys(proxyRes.headers).forEach(key => {
          const value = proxyRes.headers[key]
          if (value) res.setHeader(key, value)
        })
        
        proxyRes.pipe(res)
        proxyRes.on('end', () => resolve(true))
      })
      
      proxyReq.on('error', (error) => {
        console.error('Proxy error:', error)
        if (!res.headersSent) {
          res.statusCode = 500
          res.end(`Proxy error: ${error.message}`)
        }
        resolve(false)
      })
      
      req.pipe(proxyReq)
      
      req.on('aborted', () => {
        proxyReq.destroy()
        resolve(false)
      })
      
    } catch (error) {
      console.error('Error setting up proxy:', error)
      if (!res.headersSent) {
        res.statusCode = 500
        res.end(`Server error: ${error.message}`)
      }
      resolve(false)
    }
  })
})