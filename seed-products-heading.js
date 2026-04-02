const { createClient } = require('@sanity/client')
const c = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skAzH4XD6usVeXN7iEyopum4t0xe4pUEP0DnB8Gk7Fco8GE30SrjauDcCXgz83dD2yi8tzY0xQodvAocdObd8Ln7hcADMIiFJ8pehJM44K2uZ1H9uN1O3aRzzxbLgpXvYLFW5Hrw7PS01fgU7Csv9sgsl4jm3YCVfq4AbxSu3ktS6Ku1JeVQ',
  useCdn: false,
})

async function main() {
  const s = await c.fetch('*[_type == "siteSettings"][0]{ _id }')
  await c.patch(s._id).set({
    productsHeading: '\u0e1c\u0e25\u0e34\u0e15\u0e20\u0e31\u0e13\u0e11\u0e4c\u0e2a\u0e32\u0e22\u0e44\u0e1f\u0e2d\u0e38\u0e15\u0e2a\u0e32\u0e2b\u0e01\u0e23\u0e23\u0e21',
    productsSubheading: '\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e15\u0e32\u0e21\u0e2b\u0e21\u0e27\u0e14\u0e2b\u0e21\u0e39\u0e48',
  }).commit()
  console.log('Done!')
}
main()
