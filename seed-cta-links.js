const { createClient } = require('@sanity/client')
const c = createClient({
  projectId: '30wikoy9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skAzH4XD6usVeXN7iEyopum4t0xe4pUEP0DnB8Gk7Fco8GE30SrjauDcCXgz83dD2yi8tzY0xQodvAocdObd8Ln7hcADMIiFJ8pehJM44K2uZ1H9uN1O3aRzzxbLgpXvYLFW5Hrw7PS01fgU7Csv9sgsl4jm3YCVfq4AbxSu3ktS6Ku1JeVQ',
  useCdn: false,
})
async function main() {
  const h = await c.fetch('*[_type == "homePage"][0]{ _id }')
  await c.patch(h._id).set({
    ctaCallLink: '021115588',
    ctaLineLink: 'https://line.me/R/ti/p/@ubb9405u',
    ctaEmailLink: 'sales@nyxcable.com',
  }).commit()
  console.log('Done!')
}
main()
