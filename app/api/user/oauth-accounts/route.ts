import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth'
import { OAuthAccountModel } from '../../../lib/models/user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const oauthAccounts = await OAuthAccountModel.findByUserId(parseInt(session.user.id))
    
    // Return sanitized data (no sensitive tokens)
    const sanitizedAccounts = oauthAccounts.map(account => ({
      id: account.id,
      provider: account.provider,
      provider_user_id: account.provider_user_id,
      created_at: account.created_at,
    }))

    return NextResponse.json(sanitizedAccounts)
  } catch (error) {
    console.error('Error fetching OAuth accounts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}