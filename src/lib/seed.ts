import { prisma } from './prisma'
import { hashPassword } from './auth'

export async function seedDatabase() {
  try {
    // Crear usuario administrador por defecto
    const hashedPassword = await hashPassword("admin123")
    
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@itdashboard.com" },
      update: {},
      create: {
        email: "admin@itdashboard.com",
        password: hashedPassword,
        name: "Administrador",
        role: "admin"
      }
    })

    // Crear técnicos de ejemplo
    const technicians = [
      { name: "Técnico 1", email: "tecnico1@empresa.com" },
      { name: "Técnico 2", email: "tecnico2@empresa.com" },
      { name: "Técnico 3", email: "tecnico3@empresa.com" },
    ]

    for (const tech of technicians) {
      await prisma.technician.upsert({
        where: { name: tech.name },
        update: {},
        create: tech
      })
    }

    // Crear servidores de ejemplo
    const servers = [
      { name: "Servidor Web", description: "Servidor web principal" },
      { name: "Servidor Base de Datos", description: "Servidor de base de datos" },
      { name: "Servidor Aplicaciones", description: "Servidor de aplicaciones" },
      { name: "Servidor Backup", description: "Servidor de respaldos" },
    ]

    for (const server of servers) {
      await prisma.server.upsert({
        where: { name: server.name },
        update: {},
        create: server
      })
    }

    // Crear controles de seguridad de ejemplo
    const securityControls = [
      { name: "Antivirus", description: "Control de antivirus", category: "Endpoint Protection" },
      { name: "Firewall", description: "Control de firewall", category: "Network Security" },
      { name: "Actualizaciones", description: "Control de actualizaciones", category: "Patch Management" },
      { name: "Backup", description: "Control de respaldos", category: "Data Protection" },
      { name: "Monitoreo", description: "Control de monitoreo", category: "Monitoring" },
    ]

    for (const control of securityControls) {
      await prisma.securityControl.upsert({
        where: { name: control.name },
        update: {},
        create: control
      })
    }

    console.log("✅ Base de datos inicializada con datos de ejemplo")
    
    return {
      adminUser,
      techniciansCount: technicians.length,
      serversCount: servers.length,
      controlsCount: securityControls.length
    }
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error)
    throw error
  }
}

// Función para generar datos de ejemplo para el dashboard
export async function generateSampleData() {
  try {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    // Obtener técnicos, servidores y controles existentes
    const technicians = await prisma.technician.findMany()
    const servers = await prisma.server.findMany()
    const controls = await prisma.securityControl.findMany()

    // Generar datos de mesa de ayuda para los últimos 6 meses
    for (let i = 0; i < 6; i++) {
      let month = currentMonth - i
      let year = currentYear
      
      if (month <= 0) {
        month += 12
        year -= 1
      }

      const totalCases = Math.floor(Math.random() * 50) + 100
      const casesGLPI = Math.floor(totalCases * 0.7)
      const casesOtherSources = totalCases - casesGLPI
      const satisfactionAverage = parseFloat((Math.random() * 2 + 3).toFixed(1)) // Entre 3 y 5
      const timeLessThan4h = Math.floor(totalCases * (0.5 + Math.random() * 0.1))
      const time4to8h = Math.floor(totalCases * (0.2 + Math.random() * 0.1))
      const time8to16h = Math.floor(totalCases * (0.1 + Math.random() * 0.05))
      const timeMoreThan16h = totalCases - (timeLessThan4h + time4to8h + time8to16h)

      const helpdeskData = await prisma.helpdeskData.upsert({
        where: {
          year_month: {
            year,
            month,
          }
        },
        update: {
          totalCases,
          casesGLPI,
          casesOtherSources,
          satisfactionAverage,
          timeLessThan4h,
          time4to8h,
          time8to16h,
          timeMoreThan16h,
        },
        create: {
          year,
          month,
          totalCases,
          casesGLPI,
          casesOtherSources,
          satisfactionAverage,
          timeLessThan4h,
          time4to8h,
          time8to16h,
          timeMoreThan16h,
        }
      })

      // Generar datos de casos por técnico
      for (const technician of technicians) {
        const techCases = Math.floor(Math.random() * (totalCases / technicians.length) * 1.5) + 5
        const techSatisfaction = parseFloat((Math.random() * 1 + 4).toFixed(1)) // Entre 4 y 5

        await prisma.technicianCase.upsert({
          where: {
            helpdeskDataId_technicianId: {
              helpdeskDataId: helpdeskData.id,
              technicianId: technician.id
            }
          },
          update: {
            cases: techCases,
            satisfaction: techSatisfaction
          },
          create: {
            helpdeskDataId: helpdeskData.id,
            technicianId: technician.id,
            cases: techCases,
            satisfaction: techSatisfaction
          }
        })
      }

      // Generar datos de protección de endpoints
      await prisma.endpointProtection.upsert({
        where: { year_month: { year, month } },
        update: {},
        create: {
          year,
          month,
          computersNoIssues: Math.floor(Math.random() * 50) + 150,
          computersWarning: Math.floor(Math.random() * 20) + 5,
          computersCritical: Math.floor(Math.random() * 10) + 1,
          mobileDevicesProtected: Math.floor(Math.random() * 30) + 80,
          mobileDevicesPending: Math.floor(Math.random() * 10) + 2,
          globalProtectionPercent: parseFloat((Math.random() * 10 + 85).toFixed(1)), // Entre 85% y 95%
        }
      })

      // Generar datos de seguridad por servidor
      for (const server of servers) {
        for (const control of controls) {
          const compliancePercent = parseFloat((Math.random() * 30 + 70).toFixed(1)) // Entre 70% y 100%
          let status: 'compliant' | 'warning' | 'critical'
          
          if (compliancePercent >= 90) status = 'compliant'
          else if (compliancePercent >= 75) status = 'warning'
          else status = 'critical'

          await prisma.serverSecurity.upsert({
            where: {
              year_month_serverId_controlId: {
                year,
                month,
                serverId: server.id,
                controlId: control.id
              }
            },
            update: {},
            create: {
              year,
              month,
              serverId: server.id,
              controlId: control.id,
              status,
              compliancePercent,
            }
          })
        }
      }

      // Generar datos de ciberseguridad
      const attacksFirewall = Math.floor(Math.random() * 1000) + 500
      const attacksAntivirus = Math.floor(Math.random() * 200) + 100
      const attacksMicrosoft365 = Math.floor(Math.random() * 150) + 50
      const attacksMEDRSOC = Math.floor(Math.random() * 100) + 25

      await prisma.cyberSecurity.upsert({
        where: { year_month: { year, month } },
        update: {},
        create: {
          year,
          month,
          attacksFirewall,
          attacksAntivirus,
          attacksMicrosoft365,
          attacksMEDRSOC,
          blockedFirewall: Math.floor(attacksFirewall * (0.85 + Math.random() * 0.1)),
          blockedAntivirus: Math.floor(attacksAntivirus * (0.90 + Math.random() * 0.08)),
          blockedMicrosoft365: Math.floor(attacksMicrosoft365 * (0.88 + Math.random() * 0.1)),
          blockedMEDRSOC: Math.floor(attacksMEDRSOC * (0.92 + Math.random() * 0.06)),
          firewallBlockPercent: parseFloat((85 + Math.random() * 10).toFixed(1)),
          antivirusBlockPercent: parseFloat((90 + Math.random() * 8).toFixed(1)),
          microsoft365BlockPercent: parseFloat((88 + Math.random() * 10).toFixed(1)),
          medrSocBlockPercent: parseFloat((92 + Math.random() * 6).toFixed(1)),
        }
      })

      // Generar datos de incidentes de tecnología
      await prisma.techIncident.upsert({
        where: { year_month: { year, month } },
        update: {},
        create: {
          year,
          month,
          unavailabilityHours: parseFloat((Math.random() * 10 + 2).toFixed(1)), // Entre 2 y 12 horas
          availableHoursLeft: parseFloat((8760 - (Math.random() * 50 + 10)).toFixed(1)), // Horas restantes del año
          slaCompliance: parseFloat((Math.random() * 5 + 95).toFixed(1)), // Entre 95% y 100%
          annualProjection: parseFloat((Math.random() * 20 + 30).toFixed(1)), // Entre 30 y 50 horas anuales
        }
      })
    }

    console.log("✅ Datos de ejemplo generados para los últimos 6 meses")
    
  } catch (error) {
    console.error("❌ Error al generar datos de ejemplo:", error)
    throw error
  }
}
