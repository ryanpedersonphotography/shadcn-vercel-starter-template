import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const payload = await getPayload({ config })
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const page = parseInt(url.searchParams.get('page') || '1')
    const { collection } = await params
    
    const result = await payload.find({
      collection,
      limit,
      page,
    })
    
    return Response.json({ 
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage
    })
  } catch (error: any) {
    console.error('Error fetching collection:', error)
    return Response.json(
      { error: 'Failed to fetch collection' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const payload = await getPayload({ config })
    const rawData = await request.json()
    const { collection } = await params
    
    // Clean data: remove undefined values and empty strings for optional fields
    const data = Object.fromEntries(
      Object.entries(rawData).filter(([_, value]) => value !== undefined && value !== '')
    )
    
    const doc = await payload.create({
      collection,
      data,
    })
    
    return Response.json({ doc })
  } catch (error: any) {
    console.error('Error creating document:', error)
    return Response.json(
      { error: error.message || 'Failed to create document' },
      { status: error.status || 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const payload = await getPayload({ config })
    const rawData = await request.json()
    const { id, ...rawUpdateData } = rawData
    const { collection } = await params
    
    // Clean data: remove undefined values and empty strings for optional fields
    const updateData = Object.fromEntries(
      Object.entries(rawUpdateData).filter(([_, value]) => value !== undefined && value !== '')
    )
    
    const doc = await payload.update({
      collection,
      id,
      data: updateData,
    })
    
    return Response.json({ doc })
  } catch (error: any) {
    console.error('Error updating document:', error)
    return Response.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const payload = await getPayload({ config })
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const { collection } = await params
    
    if (!id) {
      return Response.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }
    
    await payload.delete({
      collection,
      id,
    })
    
    return Response.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting document:', error)
    return Response.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}