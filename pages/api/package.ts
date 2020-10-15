import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { name: packageName } = req.query
  const url = 'https://registry.npmjs.org'

  const response = await fetch(`${url}/${packageName}`)
  const result = await response.json()

  res.json({ name: result.name, latestVersion: result['dist-tags'].latest })
}
