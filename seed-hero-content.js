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

  // Portable Text blocks matching the current hardcoded hero
  const heroContent = [
    {
      _type: 'block',
      _key: 'b1',
      style: 'h1',
      children: [
        {
          _type: 'span',
          _key: 's1',
          text: 'NYX CABLE',
          marks: ['c1'],
        },
      ],
      markDefs: [
        { _type: 'color', _key: 'c1', hex: '#4fc3f7' },
      ],
    },
    {
      _type: 'block',
      _key: 'b2',
      style: 'h1',
      children: [
        { _type: 'span', _key: 's2', text: 'Experts in Control Cables', marks: [] },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      _key: 'b3',
      style: 'h1',
      children: [
        { _type: 'span', _key: 's3a', text: 'for ', marks: [] },
        { _type: 'span', _key: 's3b', text: 'Industrial Excellence', marks: ['c2'] },
      ],
      markDefs: [
        { _type: 'color', _key: 'c2', hex: '#fbb03b' },
      ],
    },
    {
      _type: 'block',
      _key: 'b4',
      style: 'h2',
      children: [
        { _type: 'span', _key: 's4', text: 'สายไฟฟ้าสำหรับโรงงานอุตสาหกรรม', marks: ['c3'] },
      ],
      markDefs: [
        { _type: 'color', _key: 'c3', hex: 'rgba(255,255,255,0.7)' },
      ],
    },
    {
      _type: 'block',
      _key: 'b5',
      style: 'normal',
      children: [
        { _type: 'span', _key: 's5a', text: 'ใช้เทคโนโลยีการผลิตขั้นสูง', marks: ['c4'] },
        { _type: 'span', _key: 's5b', text: 'จากยุโรป', marks: ['c5'] },
        { _type: 'span', _key: 's5c', text: 'ทุกขั้นตอน มั่นใจในคุณภาพ', marks: ['c4'] },
      ],
      markDefs: [
        { _type: 'color', _key: 'c4', hex: 'rgba(255,255,255,0.85)' },
        { _type: 'color', _key: 'c5', hex: '#fbb03b' },
      ],
    },
    {
      _type: 'block',
      _key: 'b6',
      style: 'normal',
      children: [
        { _type: 'span', _key: 's6', text: 'สายไฟคุณภาพมาตรฐาน DIN VDE สต็อกพร้อมส่งทุกขนาด บริการจัดส่งทั่วประเทศ', marks: ['c6'] },
      ],
      markDefs: [
        { _type: 'color', _key: 'c6', hex: 'rgba(255,255,255,0.85)' },
      ],
    },
  ]

  console.log('Patching heroContent...')
  await c.patch(h._id).set({ heroContent }).commit()
  console.log('Done!')
}

main()
