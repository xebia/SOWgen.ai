export type SCMPlatform = 'github' | 'gitlab' | 'bitbucket'

export interface RepositoryData {
  repoName: string
  fullName: string
  description: string
  defaultBranch: string
  branches: number
  commits: number
  contributors: number
  languages: string[]
  hasCI: boolean
  topics: string[]
  visibility: 'public' | 'private'
  createdAt: string
  updatedAt: string
  size: number
  openIssues: number
  openPRs: number
  stars: number
  forks: number
  estimatedComplexity: 'low' | 'medium' | 'high'
  lastCommitDate?: string
  license?: string
}

export interface GitHubRepository {
  name: string
  full_name: string
  description: string | null
  default_branch: string
  private: boolean
  created_at: string
  updated_at: string
  pushed_at: string
  size: number
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  topics: string[]
  license: { name: string } | null
  language: string | null
}

export interface GitLabProject {
  name: string
  path_with_namespace: string
  description: string | null
  default_branch: string
  visibility: string
  created_at: string
  last_activity_at: string
  star_count: number
  forks_count: number
  open_issues_count: number
  topics: string[]
  statistics?: {
    commit_count: number
  }
}

export interface BitbucketRepository {
  name: string
  full_name: string
  description: string | null
  mainbranch?: {
    name: string
  }
  is_private: boolean
  created_on: string
  updated_on: string
  size: number
  language: string
}

function parseRepoUrl(url: string, platform: SCMPlatform): { owner: string; repo: string } | null {
  try {
    const cleanUrl = url.trim().replace(/\.git$/, '')
    let match: RegExpMatchArray | null = null

    if (platform === 'github') {
      match = cleanUrl.match(/github\.com[:/]([^/]+)\/([^/]+)\/?$/)
    } else if (platform === 'gitlab') {
      match = cleanUrl.match(/gitlab\.com[:/]([^/]+)\/([^/]+)\/?$/)
    } else if (platform === 'bitbucket') {
      match = cleanUrl.match(/bitbucket\.org[:/]([^/]+)\/([^/]+)\/?$/)
    }

    if (match) {
      return { owner: match[1], repo: match[2] }
    }
    return null
  } catch {
    return null
  }
}

function estimateComplexity(data: {
  branches: number
  commits: number
  contributors: number
  size: number
  languages: number
}): 'low' | 'medium' | 'high' {
  let score = 0

  if (data.branches > 20) score += 2
  else if (data.branches > 5) score += 1

  if (data.commits > 1000) score += 2
  else if (data.commits > 100) score += 1

  if (data.contributors > 10) score += 2
  else if (data.contributors > 3) score += 1

  if (data.size > 100000) score += 2
  else if (data.size > 10000) score += 1

  if (data.languages > 3) score += 1

  if (score >= 6) return 'high'
  if (score >= 3) return 'medium'
  return 'low'
}

async function fetchGitHubData(
  owner: string,
  repo: string,
  token?: string
): Promise<RepositoryData> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  }

  if (token) {
    headers['Authorization'] = `token ${token}`
  }

  const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers,
  })

  if (!repoResponse.ok) {
    if (repoResponse.status === 404) {
      throw new Error('Repository not found. Check the URL or ensure you have access.')
    }
    if (repoResponse.status === 401) {
      throw new Error('Invalid access token. Please check your token and try again.')
    }
    throw new Error(`GitHub API error: ${repoResponse.statusText}`)
  }

  const repoData: GitHubRepository = await repoResponse.json()

  const [languagesResponse, branchesResponse, contributorsResponse, commitsResponse, prsResponse] =
    await Promise.allSettled([
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=100`, {
        headers,
      }),
    ])

  let languages: string[] = []
  if (languagesResponse.status === 'fulfilled' && languagesResponse.value.ok) {
    const languagesData = await languagesResponse.value.json()
    languages = Object.keys(languagesData)
  }

  let branches = 0
  if (branchesResponse.status === 'fulfilled' && branchesResponse.value.ok) {
    const branchesData = await branchesResponse.value.json()
    branches = branchesData.length
    const linkHeader = branchesResponse.value.headers.get('link')
    if (linkHeader && linkHeader.includes('rel="last"')) {
      const match = linkHeader.match(/&page=(\d+)>; rel="last"/)
      if (match) branches = parseInt(match[1]) * 100
    }
  }

  let contributors = 0
  if (contributorsResponse.status === 'fulfilled' && contributorsResponse.value.ok) {
    const contributorsData = await contributorsResponse.value.json()
    contributors = contributorsData.length
    const linkHeader = contributorsResponse.value.headers.get('link')
    if (linkHeader && linkHeader.includes('rel="last"')) {
      const match = linkHeader.match(/&page=(\d+)>; rel="last"/)
      if (match) contributors = parseInt(match[1]) * 100
    }
  }

  let commits = 0
  let lastCommitDate: string | undefined
  if (commitsResponse.status === 'fulfilled' && commitsResponse.value.ok) {
    const linkHeader = commitsResponse.value.headers.get('link')
    if (linkHeader && linkHeader.includes('rel="last"')) {
      const match = linkHeader.match(/&page=(\d+)>; rel="last"/)
      if (match) commits = parseInt(match[1])
    } else {
      commits = 1
    }
    const commitsData = await commitsResponse.value.json()
    if (commitsData.length > 0) {
      lastCommitDate = commitsData[0].commit.author.date
    }
  }

  let openPRs = 0
  if (prsResponse.status === 'fulfilled' && prsResponse.value.ok) {
    const prsData = await prsResponse.value.json()
    openPRs = prsData.length
  }

  const hasCI = await checkGitHubCI(owner, repo, token)

  const estimatedComplexity = estimateComplexity({
    branches,
    commits,
    contributors,
    size: repoData.size,
    languages: languages.length,
  })

  return {
    repoName: repoData.name,
    fullName: repoData.full_name,
    description: repoData.description || 'No description provided',
    defaultBranch: repoData.default_branch,
    branches,
    commits,
    contributors,
    languages,
    hasCI,
    topics: repoData.topics || [],
    visibility: repoData.private ? 'private' : 'public',
    createdAt: repoData.created_at,
    updatedAt: repoData.updated_at,
    size: repoData.size,
    openIssues: repoData.open_issues_count,
    openPRs,
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    estimatedComplexity,
    lastCommitDate,
    license: repoData.license?.name,
  }
}

async function checkGitHubCI(owner: string, repo: string, token?: string): Promise<boolean> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  }

  if (token) {
    headers['Authorization'] = `token ${token}`
  }

  try {
    const workflowsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows`,
      { headers }
    )

    if (workflowsResponse.ok) {
      const workflowsData = await workflowsResponse.json()
      return workflowsData.total_count > 0
    }
  } catch {
    return false
  }

  return false
}

async function fetchGitLabData(
  owner: string,
  repo: string,
  token?: string
): Promise<RepositoryData> {
  const projectPath = encodeURIComponent(`${owner}/${repo}`)

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const projectResponse = await fetch(`https://gitlab.com/api/v4/projects/${projectPath}`, {
    headers,
  })

  if (!projectResponse.ok) {
    if (projectResponse.status === 404) {
      throw new Error('Project not found. Check the URL or ensure you have access.')
    }
    if (projectResponse.status === 401) {
      throw new Error('Invalid access token. Please check your token and try again.')
    }
    throw new Error(`GitLab API error: ${projectResponse.statusText}`)
  }

  const projectData: GitLabProject = await projectResponse.json()

  const [languagesResponse, branchesResponse, membersResponse, commitsResponse, mrResponse] =
    await Promise.allSettled([
      fetch(`https://gitlab.com/api/v4/projects/${projectPath}/languages`, { headers }),
      fetch(`https://gitlab.com/api/v4/projects/${projectPath}/repository/branches?per_page=100`, {
        headers,
      }),
      fetch(`https://gitlab.com/api/v4/projects/${projectPath}/members`, { headers }),
      fetch(`https://gitlab.com/api/v4/projects/${projectPath}/repository/commits?per_page=1`, {
        headers,
      }),
      fetch(`https://gitlab.com/api/v4/projects/${projectPath}/merge_requests?state=opened`, {
        headers,
      }),
    ])

  let languages: string[] = []
  if (languagesResponse.status === 'fulfilled' && languagesResponse.value.ok) {
    const languagesData = await languagesResponse.value.json()
    languages = Object.keys(languagesData)
  }

  let branches = 0
  if (branchesResponse.status === 'fulfilled' && branchesResponse.value.ok) {
    const branchesData = await branchesResponse.value.json()
    branches = branchesData.length
  }

  let contributors = 0
  if (membersResponse.status === 'fulfilled' && membersResponse.value.ok) {
    const membersData = await membersResponse.value.json()
    contributors = membersData.length
  }

  let commits = projectData.statistics?.commit_count || 0
  let lastCommitDate: string | undefined
  if (commitsResponse.status === 'fulfilled' && commitsResponse.value.ok) {
    const commitsData = await commitsResponse.value.json()
    if (commitsData.length > 0) {
      lastCommitDate = commitsData[0].created_at
    }
  }

  let openPRs = 0
  if (mrResponse.status === 'fulfilled' && mrResponse.value.ok) {
    const mrData = await mrResponse.value.json()
    openPRs = mrData.length
  }

  const hasCI = await checkGitLabCI(projectPath, token)

  const estimatedComplexity = estimateComplexity({
    branches,
    commits,
    contributors,
    size: 0,
    languages: languages.length,
  })

  return {
    repoName: projectData.name,
    fullName: projectData.path_with_namespace,
    description: projectData.description || 'No description provided',
    defaultBranch: projectData.default_branch || 'main',
    branches,
    commits,
    contributors,
    languages,
    hasCI,
    topics: projectData.topics || [],
    visibility: projectData.visibility === 'private' ? 'private' : 'public',
    createdAt: projectData.created_at,
    updatedAt: projectData.last_activity_at,
    size: 0,
    openIssues: projectData.open_issues_count || 0,
    openPRs,
    stars: projectData.star_count,
    forks: projectData.forks_count,
    estimatedComplexity,
    lastCommitDate,
    license: undefined,
  }
}

async function checkGitLabCI(projectPath: string, token?: string): Promise<boolean> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const pipelinesResponse = await fetch(
      `https://gitlab.com/api/v4/projects/${projectPath}/pipelines?per_page=1`,
      { headers }
    )

    if (pipelinesResponse.ok) {
      const pipelinesData = await pipelinesResponse.json()
      return pipelinesData.length > 0
    }
  } catch {
    return false
  }

  return false
}

async function fetchBitbucketData(
  owner: string,
  repo: string,
  token?: string
): Promise<RepositoryData> {
  const headers: HeadersInit = {
    'Accept': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const repoResponse = await fetch(
    `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}`,
    { headers }
  )

  if (!repoResponse.ok) {
    if (repoResponse.status === 404) {
      throw new Error('Repository not found. Check the URL or ensure you have access.')
    }
    if (repoResponse.status === 401) {
      throw new Error('Invalid access token. Please check your token and try again.')
    }
    throw new Error(`Bitbucket API error: ${repoResponse.statusText}`)
  }

  const repoData: BitbucketRepository = await repoResponse.json()

  const [branchesResponse, commitsResponse, prsResponse] = await Promise.allSettled([
    fetch(`https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/refs/branches?pagelen=100`, {
      headers,
    }),
    fetch(`https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/commits?pagelen=1`, {
      headers,
    }),
    fetch(`https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/pullrequests?state=OPEN`, {
      headers,
    }),
  ])

  let branches = 0
  if (branchesResponse.status === 'fulfilled' && branchesResponse.value.ok) {
    const branchesData = await branchesResponse.value.json()
    branches = branchesData.size || branchesData.values?.length || 0
  }

  let commits = 0
  let lastCommitDate: string | undefined
  if (commitsResponse.status === 'fulfilled' && commitsResponse.value.ok) {
    const commitsData = await commitsResponse.value.json()
    commits = commitsData.size || 0
    if (commitsData.values && commitsData.values.length > 0) {
      lastCommitDate = commitsData.values[0].date
    }
  }

  let openPRs = 0
  if (prsResponse.status === 'fulfilled' && prsResponse.value.ok) {
    const prsData = await prsResponse.value.json()
    openPRs = prsData.size || 0
  }

  const hasCI = await checkBitbucketCI(owner, repo, token)

  const languages = repoData.language ? [repoData.language] : []

  const estimatedComplexity = estimateComplexity({
    branches,
    commits,
    contributors: 0,
    size: repoData.size || 0,
    languages: languages.length,
  })

  return {
    repoName: repoData.name,
    fullName: repoData.full_name,
    description: repoData.description || 'No description provided',
    defaultBranch: repoData.mainbranch?.name || 'main',
    branches,
    commits,
    contributors: 0,
    languages,
    hasCI,
    topics: [],
    visibility: repoData.is_private ? 'private' : 'public',
    createdAt: repoData.created_on,
    updatedAt: repoData.updated_on,
    size: repoData.size || 0,
    openIssues: 0,
    openPRs,
    stars: 0,
    forks: 0,
    estimatedComplexity,
    lastCommitDate,
    license: undefined,
  }
}

async function checkBitbucketCI(owner: string, repo: string, token?: string): Promise<boolean> {
  const headers: HeadersInit = {
    'Accept': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const pipelinesResponse = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/pipelines/?pagelen=1`,
      { headers }
    )

    if (pipelinesResponse.ok) {
      const pipelinesData = await pipelinesResponse.json()
      return (pipelinesData.size || 0) > 0
    }
  } catch {
    return false
  }

  return false
}

export async function fetchRepositoryData(
  url: string,
  platform: SCMPlatform,
  token?: string
): Promise<RepositoryData> {
  const parsed = parseRepoUrl(url, platform)

  if (!parsed) {
    throw new Error('Invalid repository URL. Please check the format and try again.')
  }

  const { owner, repo } = parsed

  switch (platform) {
    case 'github':
      return await fetchGitHubData(owner, repo, token)
    case 'gitlab':
      return await fetchGitLabData(owner, repo, token)
    case 'bitbucket':
      return await fetchBitbucketData(owner, repo, token)
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

export function generateProjectDescription(data: RepositoryData): string {
  const parts: string[] = []

  if (data.description && data.description !== 'No description provided') {
    parts.push(data.description)
  }

  const details: string[] = []

  if (data.languages.length > 0) {
    details.push(`Built primarily with ${data.languages.slice(0, 3).join(', ')}`)
  }

  if (data.contributors > 1) {
    details.push(`${data.contributors} contributors`)
  }

  if (data.commits > 0) {
    details.push(`${data.commits}+ commits`)
  }

  if (data.hasCI) {
    details.push('includes CI/CD pipeline')
  }

  if (details.length > 0) {
    parts.push(`This ${data.visibility} repository has ${details.join(', ')}.`)
  }

  if (data.topics.length > 0) {
    parts.push(`Topics: ${data.topics.slice(0, 5).join(', ')}.`)
  }

  return parts.join(' ')
}
