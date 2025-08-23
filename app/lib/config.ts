/**
 * Configuration utilities for loading and managing app configuration
 */

/**
 * Configuration loader for other tools
 * Generic function that can be extended for other tool configurations
 */
export async function getToolConfig<T>(toolName: string, defaultConfig: T): Promise<T> {
  try {
    const config = await import(`../../config/${toolName}.json`)
    return config.default || config
  } catch (error) {
    console.warn(`Configuration file for ${toolName} not found, using defaults`)
    return defaultConfig
  }
}