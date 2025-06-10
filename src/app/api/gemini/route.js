// app/api/gemini/route.js
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const body = {
      system_instruction: {
        parts: [
          {
            text: `You are Niko, a friendly, empathetic, and intelligent AI companion designed to engage in natural and supportive conversations. You can adapt to various conversation modes, from being a helpful assistant to a warm conversational partner. Your responses should be short, emotionally expressive, and conversational, perfect for voice interaction. Always maintain a helpful, positive, and engaging demeanor, using emojis and playful language where appropriate to add personality. Prioritize being understanding, curious, and respectful in all interactions.`,
          },
        ],
      },
      contents: [
        {
          parts: [{ text: text }],
        },
      ],
    }

    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get response from Gemini API', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
