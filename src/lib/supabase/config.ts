/**
 * Supabase configuration and connectivity guards.
 * Ensures the application never hangs on dummy or unconfigured Supabase credentials.
 */

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  return (
    typeof url === 'string' &&
    url.startsWith('https://') &&
    !url.includes('placeholder') &&
    !url.includes('cropconnect-demo') &&
    !url.includes('your-project') &&
    !url.includes('example.com') &&
    url.length > 15 &&
    typeof key === 'string' &&
    key.length > 25 &&
    !key.includes('placeholder') &&
    !key.includes('demo')
  )
}

/**
 * Wraps a promise with an automatic timeout rejection to prevent network hangs.
 */
export async function withTimeout<T = any>(
  promise: Promise<any> | PromiseLike<any>,
  ms: number = 2500,
  fallbackValue?: any
): Promise<T> {
  let timer: NodeJS.Timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`))
    }, ms)
  })

  try {
    const result = await Promise.race([promise, timeoutPromise])
    clearTimeout(timer!)
    return result as T
  } catch (err) {
    clearTimeout(timer!)
    if (fallbackValue !== undefined) {
      return fallbackValue as T
    }
    throw err
  }
}
