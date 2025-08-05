import { NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthResult {
  success: boolean;
  error?: string;
  partnerId?: string;
  permissions?: string[];
}

export async function verifyApiKey(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      error: 'Missing or invalid authorization header. Use "Bearer <api_key>"'
    };
  }

  const apiKey = authHeader.substring(7); // Remove "Bearer " prefix
  
  if (!apiKey) {
    return {
      success: false,
      error: 'API key is required'
    };
  }

  try {
    // Check if API key exists in our partner authentication collection
    const partnerDoc = await getDoc(doc(db, 'partnerAuth', apiKey));
    
    if (!partnerDoc.exists()) {
      return {
        success: false,
        error: 'Invalid API key'
      };
    }

    const partnerData = partnerDoc.data();
    
    if (!partnerData.isApproved) {
      return {
        success: false,
        error: 'API key not approved. Contact support for activation.'
      };
    }

    // Check license tier and rate limits
    const now = Date.now();
    const dayStart = new Date(now).setHours(0, 0, 0, 0);
    
    // For now, we'll implement basic rate limiting based on license tier
    const rateLimits = {
      trial: 100,
      standard: 1000,
      premium: 10000
    };

    const dailyLimit = rateLimits[partnerData.licenseTier as keyof typeof rateLimits] || 100;
    
    // In production, you'd track usage in a separate collection or Redis
    // For now, we'll allow the request to proceed
    
    return {
      success: true,
      partnerId: partnerDoc.id,
      permissions: getPermissionsForTier(partnerData.licenseTier)
    };

  } catch (error) {
    console.error('Error verifying API key:', error);
    return {
      success: false,
      error: 'Authentication service unavailable'
    };
  }
}

function getPermissionsForTier(tier: string): string[] {
  const permissions = {
    trial: ['read:memories', 'read:basic_analytics'],
    standard: ['read:memories', 'read:analytics', 'read:embeddings'],
    premium: ['read:memories', 'read:analytics', 'read:embeddings', 'read:detailed_metadata', 'export:data']
  };

  return permissions[tier as keyof typeof permissions] || permissions.trial;
}

export async function logApiUsage(partnerId: string, endpoint: string, recordCount: number) {
  try {
    const usageDoc = doc(db, 'apiUsage', `${partnerId}_${new Date().toISOString().split('T')[0]}`);
    
    // In production, you'd use atomic operations to increment counters
    // For now, we'll just log the usage
    console.log(`API Usage: Partner ${partnerId}, Endpoint ${endpoint}, Records: ${recordCount}`);
    
  } catch (error) {
    console.error('Error logging API usage:', error);
  }
}