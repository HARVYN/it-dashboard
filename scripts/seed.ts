import { seedDatabase, generateSampleData } from '../src/lib/seed'

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')
  
  try {
    // Inicializar datos básicos
    const result = await seedDatabase()
    console.log('📊 Datos básicos creados:', result)
    
    // Generar datos de ejemplo
    await generateSampleData()
    
    console.log('✅ Seed completado exitosamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    process.exit(1)
  }
}

main()

