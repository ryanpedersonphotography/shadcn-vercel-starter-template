import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Test if Payload is working by getting collections info
    const collections = Object.keys(payload.config.collections || {})
    
    return Response.json({ 
      status: 'success', 
      message: 'Payload CMS is running',
      collections,
      adminUrl: '/admin'
    })
  } catch (error) {
    console.error('Payload error:', error)
    return Response.json(
      { status: 'error', message: 'Payload CMS connection failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}