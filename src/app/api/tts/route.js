// app/api/tts/route.js
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required for TTS' },
        { status: 400 }
      )
    }

    // --- REPLACE THIS SECTION WITH YOUR CHOSEN TTS API INTEGRATION ---
    // Example for a generic TTS API that accepts text and returns an audio stream/blob
    const TTS_API_KEY = process.env.TTS_API_KEY // Your TTS API key

    if (!TTS_API_KEY) {
      return NextResponse.json(
        {
          error:
            'TTS_API_KEY is not set. Please configure your Text-to-Speech API.',
        },
        { status: 500 }
      )
    }

    // Example with a placeholder URL and headers.
    // Replace with your actual TTS API endpoint and authentication.
    const ttsResponse = await fetch('YOUR_TTS_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TTS_API_KEY}`, // Or whatever authentication your TTS API uses
      },
      body: JSON.stringify({
        input: { text: text },
        voice: { languageCode: 'en-US', name: 'en-US-Wavenet-F' }, // Example for Google Cloud TTS
        audioConfig: { audioEncoding: 'MP3' },
      }),
    })

    if (!ttsResponse.ok) {
      const errorDetails = await ttsResponse.text() // Or .json() depending on API error format
      console.error('TTS API Error:', errorDetails)
      return NextResponse.json(
        {
          error: 'Failed to generate speech from TTS API',
          details: errorDetails,
        },
        { status: ttsResponse.status }
      )
    }

    // Assuming the TTS API returns an audio blob directly
    const audioBlob = await ttsResponse.blob()

    // Return the audio blob directly, setting appropriate content type
    return new NextResponse(audioBlob, {
      headers: {
        'Content-Type': 'audio/mpeg', // Or 'audio/wav', 'audio/ogg' etc. based on your TTS output
        'Content-Disposition': 'inline; filename="speech.mp3"',
      },
      status: 200,
    })
    // --- END OF REPLACE SECTION ---
  } catch (error) {
    console.error('TTS API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error during TTS generation' },
      { status: 500 }
    )
  }
}
