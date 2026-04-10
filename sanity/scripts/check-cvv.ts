import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

async function check() {
  const result = await client.fetch(`*[_type == "product" && slug.current == "cvv"]{
    "descBlockCount": count(description),
    "specTableCount": count(description[_type == "specTable"]),
    "faqCount": count(faqItems),
    "descTypes": description[]._type
  }`)
  console.log(JSON.stringify(result, null, 2))
}
check()
