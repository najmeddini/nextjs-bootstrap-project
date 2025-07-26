const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seedAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@analyfy.com' }
    })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@analyfy.com',
        name: 'Admin User',
        password: hashedPassword,
        tokenBalance: 999999, // Give admin unlimited tokens
        plan: 'business'
      }
    })

    console.log('Admin user created successfully:', admin.email)

    // Create some default admin configurations
    const defaultConfigs = [
      {
        key: 'qualityCheckerPrompt',
        value: 'Analyze the following text for quality metrics including readability, engagement, clarity, structure, and grammar. Provide scores out of 100 for each metric and suggestions for improvement.'
      },
      {
        key: 'humanizerPrompt',
        value: 'Rewrite the following text to make it sound more natural and human-like while preserving the original meaning and key information.'
      },
      {
        key: 'bulletEditorPrompt',
        value: 'Modify the bullet points in the following text. If asked to increase, add more bullet points by breaking down existing content. If asked to decrease, combine bullet points into flowing paragraphs.'
      },
      {
        key: 'openaiKey',
        value: 'mock_openai_key'
      },
      {
        key: 'anthropicKey',
        value: 'mock_anthropic_key'
      },
      {
        key: 'aiDetectorKey',
        value: 'mock_detector_key'
      },
      {
        key: 'stripeSecretKey',
        value: 'mock_stripe_secret'
      },
      {
        key: 'stripePublishableKey',
        value: 'mock_stripe_publishable'
      }
    ]

    for (const config of defaultConfigs) {
      await prisma.adminConfig.upsert({
        where: { key: config.key },
        update: { value: config.value },
        create: config
      })
    }

    console.log('Default admin configurations created')

  } catch (error) {
    console.error('Error seeding admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAdmin()
