// Armazenamento em memória para tokens invalidados
let blacklistedTokens = new Set()
// Mapa para armazenar quando cada token expira (para limpeza automática)
let tokenExpirations = new Map()

/*Adiciona um token à blacklist */
export const addToBlacklist = (token, expiresAt) => {
  blacklistedTokens.add(token)
  tokenExpirations.set(token, expiresAt)
  
  console.log(`Token adicionado à blacklist. Total: ${blacklistedTokens.size}`)
}

/*Verifica se um token está na blacklist */
export const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token)
}

/*Remove tokens expirados da blacklist para economizar memória (era interessante se rodar periodicamente, é como se esses tokens fossem os usuarios, mas abstraidos se podem ou
não serem acessados, assim dava pra bloquear alguem pelo token*/
export const cleanExpiredTokens = () => {
  const now = Date.now() / 1000 // Timestamp atual em segundos
  let removedCount = 0
  
  for (const [token, expiresAt] of tokenExpirations.entries()) {
    if (expiresAt < now) {
      blacklistedTokens.delete(token)
      tokenExpirations.delete(token)
      removedCount++
    }
  }
  
  if (removedCount > 0) {
    console.log(`Limpeza automática: ${removedCount} tokens expirados removidos da blacklist`)
  }
}

/* Retorna estatísticas da blacklist (Isso vai servir mais pra debugar, pq no programa mesmo não faz diferença) */  
export const getBlacklistStats = () => {
  return {
    totalTokens: blacklistedTokens.size,
    activeTokens: tokenExpirations.size
  }
}

// Limpeza automática a cada 1 hora (isso aqui é se ficar rodando o site)
setInterval(cleanExpiredTokens, 60 * 60 * 1000)

console.log('Serviço de blacklist de tokens inicializado')