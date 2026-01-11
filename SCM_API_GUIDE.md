# SCM API Integration Guide

## Overview

SOWGen now includes real GitHub and GitLab API integration for automated repository data fetching. This feature allows clients to automatically populate Statement of Work forms with comprehensive repository information, significantly reducing manual data entry and improving accuracy.

## Supported Platforms

### ✅ GitHub (Full Support)
- **API Version**: GitHub REST API v3
- **Features**:
  - Repository metadata (name, description, visibility)
  - Branch and commit statistics
  - Contributor analysis
  - Language detection
  - GitHub Actions workflow detection
  - Topics and tags
  - Open issues and pull requests
  - Stars, forks, and license information
  - Complexity analysis

### ✅ GitLab (Full Support)
- **API Version**: GitLab API v4
- **Features**:
  - Project metadata (name, description, visibility)
  - Branch and commit statistics
  - Member analysis
  - Language detection
  - GitLab CI pipeline detection
  - Topics and tags
  - Open issues and merge requests
  - Stars and forks
  - Complexity analysis

### ⏳ Bitbucket (Not Yet Supported)
- Coming in a future release

## How It Works

### Public Repositories
For public repositories, no authentication is required. Simply:
1. Select the SCM platform (GitHub or GitLab)
2. Enter the repository URL (e.g., `https://github.com/owner/repo`)
3. Click "Fetch Repository Data"

The system will automatically retrieve and display:
- Repository name and full path
- Description
- Default branch
- Total branches
- Total commits
- Number of contributors
- Programming languages used
- CI/CD pipeline detection
- Topics/tags
- Open issues and PRs
- Stars and forks
- License information
- Estimated project complexity (low/medium/high)

### Private Repositories
For private repositories, you'll need to provide an access token:

#### GitHub Token Generation
1. Go to GitHub Settings → Developer settings
2. Click "Personal access tokens" → "Tokens (classic)"
3. Click "Generate new token"
4. Select the `repo` scope (full control of private repositories)
5. Copy the generated token

#### GitLab Token Generation
1. Go to User Settings → Access Tokens
2. Click "Add new token"
3. Select the `read_api` scope
4. Set an expiration date (optional)
5. Click "Create personal access token"
6. Copy the generated token

**Note**: Tokens are only used for the API request and are never stored.

## Data Fetched

### Repository Metadata
- **Name**: Repository name
- **Full Name**: Organization/username + repository name
- **Description**: Repository description
- **Visibility**: Public or private
- **Created/Updated**: Timestamps

### Code Statistics
- **Branches**: Total number of branches
- **Commits**: Total commit count (approximate for large repos)
- **Contributors**: Number of unique contributors
- **Languages**: Programming languages detected with usage percentage
- **Size**: Repository size in KB

### CI/CD Detection
- **GitHub**: Detects GitHub Actions workflows
- **GitLab**: Detects GitLab CI pipelines
- Auto-enables migration services if CI/CD is detected

### Community Metrics
- **Stars**: Repository stars/likes
- **Forks**: Number of forks
- **Open Issues**: Current open issues
- **Open PRs/MRs**: Current open pull/merge requests
- **Topics**: Repository topics/tags
- **License**: Detected license type

### Complexity Analysis
The system automatically calculates project complexity based on:
- Number of branches
- Total commits
- Number of contributors
- Repository size
- Number of languages

Complexity levels:
- **Low**: Simple projects with minimal complexity
- **Medium**: Moderate projects with standard complexity
- **High**: Complex projects with significant scope

## Error Handling

The integration includes comprehensive error handling:

### Common Errors

#### Repository Not Found (404)
**Cause**: Invalid URL or private repository without token
**Solution**: Verify the URL and provide an access token for private repos

#### Invalid Access Token (401)
**Cause**: Token is invalid, expired, or lacks necessary permissions
**Solution**: Generate a new token with the correct scopes

#### Rate Limiting
**Cause**: Too many API requests (GitHub: 60/hour unauthenticated, 5000/hour authenticated)
**Solution**: Provide an access token or wait for rate limit reset

#### Network Errors
**Cause**: Connectivity issues or API downtime
**Solution**: Check your internet connection and try again

## API Rate Limits

### GitHub
- **Unauthenticated**: 60 requests per hour per IP
- **Authenticated**: 5,000 requests per hour per token
- Rate limit info included in response headers

### GitLab
- **Unauthenticated**: Rate limits vary by GitLab instance
- **Authenticated**: Higher limits for authenticated requests
- Public GitLab.com has different limits than self-hosted instances

## Security & Privacy

### Token Security
- Tokens are **never stored** on the server
- Tokens are only used for the immediate API request
- Tokens are transmitted securely over HTTPS
- Token input fields use password masking

### Data Privacy
- Only public repository data is fetched without tokens
- Private repository data requires explicit user authorization via token
- No repository code or sensitive files are accessed
- Only metadata and statistics are retrieved

## Example Usage

### Example 1: Public GitHub Repository
```
Platform: GitHub
Repository URL: https://github.com/facebook/react
Access Token: (leave empty)
```

Result: Full repository metadata including 27k+ commits, 1,600+ contributors, and JavaScript/TypeScript languages.

### Example 2: Private GitLab Project
```
Platform: GitLab
Repository URL: https://gitlab.com/myorg/private-project
Access Token: glpat-xxxxxxxxxxxx
```

Result: Complete project data including CI pipeline detection and member statistics.

## Troubleshooting

### "Repository not found" Error
- Verify the URL is correct
- Check if the repository is private (requires token)
- Ensure you have access to the repository

### "Invalid access token" Error
- Verify token is correctly copied (no extra spaces)
- Check token hasn't expired
- Ensure token has correct scopes:
  - GitHub: `repo` scope
  - GitLab: `read_api` scope

### Missing Data
- Some data may be unavailable for certain repositories
- API rate limits may affect data completeness
- Use manual entry to supplement missing information

## Benefits

### For Clients
- ⚡ **Faster SOW Creation**: Reduce form-filling time by 80%
- ✅ **Accurate Data**: Eliminate manual entry errors
- 📊 **Comprehensive Analysis**: Automatic complexity and technology assessment
- 🔍 **Transparency**: Clear visibility into project scope

### For Xebia Teams
- 📈 **Better Estimates**: Data-driven project scoping
- 🎯 **Informed Proposals**: Accurate technical understanding
- ⏱️ **Time Savings**: Focus on strategic planning vs. data collection
- 📋 **Complete Documentation**: Comprehensive project details from day one

## API Implementation Details

### Architecture
- Client-side API calls directly to GitHub/GitLab
- No proxy server or backend required
- CORS-compliant API endpoints
- Parallel API requests for optimal performance

### Error Recovery
- Graceful degradation to manual entry
- Detailed error messages with actionable guidance
- Retry capability with different credentials
- Validation at each step

### Performance
- Concurrent API calls for faster data fetching
- Optimized pagination handling for large datasets
- Caching considerations for repeated requests
- Responsive UI with loading states

## Future Enhancements

### Planned Features
- ✨ Bitbucket API integration
- 📊 Historical commit activity analysis
- 👥 Contributor role detection
- 🔐 OAuth-based authentication
- 💾 Repository favorites for quick access
- 🔄 Scheduled data refresh
- 📈 Trend analysis over time

## Support

For issues or questions regarding the SCM API integration:
1. Check this documentation first
2. Review error messages for specific guidance
3. Verify API tokens and permissions
4. Contact your Xebia administrator

## Resources

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitLab API Documentation](https://docs.gitlab.com/ee/api/)
- [GitHub Token Guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitLab Token Guide](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
