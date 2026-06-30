import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase'
import { ValuationRequest, ValuationResponse } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const body: ValuationRequest = await req.json()
    const supabase = createServerSupabaseClient()

    // Fetch comparable sales from DB
    const { data: comps } = await supabase
      .from('comparables')
      .select('*')
      .eq('equipment_type', body.equipment_type)
      .gte('year', body.year - 2)
      .lte('year', body.year + 2)
      .order('sale_date', { ascending: false })
      .limit(20)

    const comparablesText = comps && comps.length > 0
      ? JSON.stringify(comps.map(c => ({
          year: c.year, make: c.make, model: c.model,
          hours: c.hours, miles: c.miles,
          condition: c.condition,
          sale_price: c.sale_price,
          sale_date: c.sale_date,
          region: c.region,
          source: c.source,
        })))
      : '[]'

    const prompt = `You are an expert heavy equipment appraiser with 20 years of experience in auction results and dealer pricing. 

Listing to value:
- Equipment type: ${body.equipment_type}
- Year: ${body.year}
- Make: ${body.make}
- Model: ${body.model}
- Hours: ${body.hours ?? 'N/A'}
- Miles: ${body.miles ?? 'N/A'}
- Condition grade: ${body.condition_grade}/5
- Location: ${body.location}

Recent comparable sales from the market database:
${comparablesText}

Based on the listing details and comparables, provide a fair market valuation. Consider:
- Age and usage (hours/miles)
- Condition grade (1=Poor, 5=Excellent)
- Regional market (Southeast US commands slightly higher prices)
- Recent market trends

Respond with ONLY a valid JSON object, no other text:
{
  "fmv_low": <integer USD, no commas>,
  "fmv_high": <integer USD, no commas>,
  "confidence": <"high" if 5+ strong comps, "medium" if 2-4 comps, "low" if sparse data>,
  "rationale": <one sentence, max 25 words, cite specific comp data>,
  "comparables": <array of the 3 most relevant comps from the data above, each as {year, make, model, hours, miles, condition, sale_price, sale_date, region, source}>
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    // Strip any markdown fences if present
    const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const valuation: ValuationResponse = JSON.parse(cleanJson)

    // Save to DB
    await supabase.from('valuations').upsert({
      listing_id:  body.listing_id,
      fmv_low:     valuation.fmv_low,
      fmv_high:    valuation.fmv_high,
      confidence:  valuation.confidence,
      rationale:   valuation.rationale,
      comparables: valuation.comparables,
    }, { onConflict: 'listing_id' })

    return NextResponse.json(valuation)
  } catch (error: any) {
    console.error('Valuation error:', error)
    return NextResponse.json(
      { error: 'Valuation failed', detail: error.message },
      { status: 500 }
    )
  }
}
