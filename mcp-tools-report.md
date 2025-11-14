# Claude MCP 工具列表报告

> 生成时间: 2025/11/14 13:11:43
> 配置文件: C:\Users\Administrator\.claude.json

## 📊 统计概览

- **总服务器数**: 7
- **成功查询**: 5
- **总工具数**: 57

---

## ✅ 成功查询的服务器

### GitHub

**工具数量**: 40

| 工具名称 | 描述 |
|----------|------|
| `add_comment_to_pending_review` | Add review comment to the requester's latest pending pull request review. A pending review needs to already exist to call this (check with the user if not sure). |
| `add_issue_comment` | Add a comment to a specific issue in a GitHub repository. Use this tool to add comments to pull requests as well (in this case pass pull request number as issue_number), but only if user is not asking specifically to add review comments. |
| `assign_copilot_to_issue` | Assign Copilot to a specific issue in a GitHub repository.

This tool can help with the following outcomes:
- a Pull Request created with source code changes to resolve the issue


More information can be found at:
- https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/about-assigning-tasks-to-copilot
 |
| `create_branch` | Create a new branch in a GitHub repository |
| `create_or_update_file` | Create or update a single file in a GitHub repository. If updating, you must provide the SHA of the file you want to update. Use this tool to create or update a file in a GitHub repository remotely; do not use it for local file operations. |
| `create_pull_request` | Create a new pull request in a GitHub repository. |
| `create_repository` | Create a new GitHub repository in your account or specified organization |
| `delete_file` | Delete a file from a GitHub repository |
| `fork_repository` | Fork a GitHub repository to your account or specified organization |
| `get_commit` | Get details for a commit from a GitHub repository |
| `get_file_contents` | Get the contents of a file or directory from a GitHub repository |
| `get_label` | Get a specific label from a repository. |
| `get_latest_release` | Get the latest release in a GitHub repository |
| `get_me` | Get details of the authenticated GitHub user. Use this when a request is about the user's own profile for GitHub. Or when information is missing to build other tool calls. |
| `get_release_by_tag` | Get a specific release by its tag name in a GitHub repository |
| `get_tag` | Get details about a specific git tag in a GitHub repository |
| `get_team_members` | Get member usernames of a specific team in an organization. Limited to organizations accessible with current credentials |
| `get_teams` | Get details of the teams the user is a member of. Limited to organizations accessible with current credentials |
| `issue_read` | Get information about a specific issue in a GitHub repository. |
| `issue_write` | Create a new or update an existing issue in a GitHub repository. |
| `list_branches` | List branches in a GitHub repository |
| `list_commits` | Get list of commits of a branch in a GitHub repository. Returns at least 30 results per page by default, but can return more if specified using the perPage parameter (up to 100). |
| `list_issue_types` | List supported issue types for repository owner (organization). |
| `list_issues` | List issues in a GitHub repository. For pagination, use the 'endCursor' from the previous response's 'pageInfo' in the 'after' parameter. |
| `list_pull_requests` | List pull requests in a GitHub repository. If the user specifies an author, then DO NOT use this tool and use the search_pull_requests tool instead. |
| `list_releases` | List releases in a GitHub repository |
| `list_tags` | List git tags in a GitHub repository |
| `merge_pull_request` | Merge a pull request in a GitHub repository. |
| `pull_request_read` | Get information on a specific pull request in GitHub repository. |
| `pull_request_review_write` | Create and/or submit, delete review of a pull request.

Available methods:
- create: Create a new review of a pull request. If "event" parameter is provided, the review is submitted. If "event" is omitted, a pending review is created.
- submit_pending: Submit an existing pending review of a pull request. This requires that a pending review exists for the current user on the specified pull request. The "body" and "event" parameters are used when submitting the review.
- delete_pending: Delete an existing pending review of a pull request. This requires that a pending review exists for the current user on the specified pull request.
 |
| `push_files` | Push multiple files to a GitHub repository in a single commit |
| `request_copilot_review` | Request a GitHub Copilot code review for a pull request. Use this for automated feedback on pull requests, usually before requesting a human reviewer. |
| `search_code` | Fast and precise code search across ALL GitHub repositories using GitHub's native search engine. Best for finding exact symbols, functions, classes, or specific code patterns. |
| `search_issues` | Search for issues in GitHub repositories using issues search syntax already scoped to is:issue |
| `search_pull_requests` | Search for pull requests in GitHub repositories using issues search syntax already scoped to is:pr |
| `search_repositories` | Find GitHub repositories by name, description, readme, topics, or other metadata. Perfect for discovering projects, finding examples, or locating specific repositories across GitHub. |
| `search_users` | Find GitHub users by username, real name, or other profile information. Useful for locating developers, contributors, or team members. |
| `sub_issue_write` | Add a sub-issue to a parent issue in a GitHub repository. |
| `update_pull_request` | Update an existing pull request in a GitHub repository. |
| `update_pull_request_branch` | Update the branch of a pull request with the latest changes from the base branch. |

### firecrawl-mcp-server

**工具数量**: 8

| 工具名称 | 描述 |
|----------|------|
| `firecrawl_scrape` | 
Scrape content from a single URL with advanced options. 
This is the most powerful, fastest and most reliable scraper tool, if available you should always default to using this tool for any web scraping needs.

**Best for:** Single page content extraction, when you know exactly which page contains the information.
**Not recommended for:** Multiple pages (use batch_scrape), unknown page (use search), structured data (use extract).
**Common mistakes:** Using scrape for a list of URLs (use batch_scrape instead). If batch scrape doesnt work, just use scrape and call it multiple times.
**Prompt Example:** "Get the content of the page at https://example.com."
**Usage Example:**
\`\`\`json
{
  "name": "firecrawl_scrape",
  "arguments": {
    "url": "https://example.com",
    "formats": ["markdown"],
    "maxAge": 3600000
  }
}
\`\`\`
**Performance:** Add maxAge parameter for 500% faster scrapes using cached data.
**Returns:** Markdown, HTML, or other formats as specified.
 |
| `firecrawl_map` | 
Map a website to discover all indexed URLs on the site.

**Best for:** Discovering URLs on a website before deciding what to scrape; finding specific sections of a website.
**Not recommended for:** When you already know which specific URL you need (use scrape or batch_scrape); when you need the content of the pages (use scrape after mapping).
**Common mistakes:** Using crawl to discover URLs instead of map.
**Prompt Example:** "List all URLs on example.com."
**Usage Example:**
\`\`\`json
{
  "name": "firecrawl_map",
  "arguments": {
    "url": "https://example.com"
  }
}
\`\`\`
**Returns:** Array of URLs found on the site.
 |
| `firecrawl_crawl` | 
Starts an asynchronous crawl job on a website and extracts content from all pages.

**Best for:** Extracting content from multiple related pages, when you need comprehensive coverage.
**Not recommended for:** Extracting content from a single page (use scrape); when token limits are a concern (use map + batch_scrape); when you need fast results (crawling can be slow).
**Warning:** Crawl responses can be very large and may exceed token limits. Limit the crawl depth and number of pages, or use map + batch_scrape for better control.
**Common mistakes:** Setting limit or maxDepth too high (causes token overflow); using crawl for a single page (use scrape instead).
**Prompt Example:** "Get all blog posts from the first two levels of example.com/blog."
**Usage Example:**
\`\`\`json
{
  "name": "firecrawl_crawl",
  "arguments": {
    "url": "https://example.com/blog/*",
    "maxDepth": 2,
    "limit": 100,
    "allowExternalLinks": false,
    "deduplicateSimilarURLs": true
  }
}
\`\`\`
**Returns:** Operation ID for status checking; use firecrawl_check_crawl_status to check progress.
 |
| `firecrawl_check_crawl_status` | 
Check the status of a crawl job.

**Usage Example:**
\`\`\`json
{
  "name": "firecrawl_check_crawl_status",
  "arguments": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
\`\`\`
**Returns:** Status and progress of the crawl job, including results if available.
 |
| `firecrawl_search` | 
Search the web and optionally extract content from search results. This is the most powerful search tool available, and if available you should always default to using this tool for any web search needs.

**Best for:** Finding specific information across multiple websites, when you don't know which website has the information; when you need the most relevant content for a query.
**Not recommended for:** When you already know which website to scrape (use scrape); when you need comprehensive coverage of a single website (use map or crawl).
**Common mistakes:** Using crawl or map for open-ended questions (use search instead).
**Prompt Example:** "Find the latest research papers on AI published in 2023."
**Usage Example:**
\`\`\`json
{
  "name": "firecrawl_search",
  "arguments": {
    "query": "latest AI research papers 2023",
    "limit": 5,
    "lang": "en",
    "country": "us",
    "scrapeOptions": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
\`\`\`
**Returns:** Array of search results (with optional scraped content).
 |
| `firecrawl_extract` | 
Extract structured information from web pages using LLM capabilities. Supports both cloud AI and self-hosted LLM extraction.

**Best for:** Extracting specific structured data like prices, names, details.
**Not recommended for:** When you need the full content of a page (use scrape); when you're not looking for specific structured data.
**Arguments:**
- urls: Array of URLs to extract information from
- prompt: Custom prompt for the LLM extraction
- systemPrompt: System prompt to guide the LLM
- schema: JSON schema for structured data extraction
- allowExternalLinks: Allow extraction from external links
- enableWebSearch: Enable web search for additional context
- includeSubdomains: Include subdomains in extraction
**Prompt Example:** "Extract the product name, price, and description from these product pages."
**Usage Example:**
\`\`\`json
{
  "name": "firecrawl_extract",
  "arguments": {
    "urls": ["https://example.com/page1", "https://example.com/page2"],
    "prompt": "Extract product information including name, price, and description",
    "systemPrompt": "You are a helpful assistant that extracts product information",
    "schema": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "price": { "type": "number" },
        "description": { "type": "string" }
      },
      "required": ["name", "price"]
    },
    "allowExternalLinks": false,
    "enableWebSearch": false,
    "includeSubdomains": false
  }
}
\`\`\`
**Returns:** Extracted structured data as defined by your schema.
 |
| `firecrawl_deep_research` | 
Conduct deep web research on a query using intelligent crawling, search, and LLM analysis.

**Best for:** Complex research questions requiring multiple sources, in-depth analysis.
**Not recommended for:** Simple questions that can be answered with a single search; when you need very specific information from a known page (use scrape); when you need results quickly (deep research can take time).
**Arguments:**
- query (string, required): The research question or topic to explore.
- maxDepth (number, optional): Maximum recursive depth for crawling/search (default: 3).
- timeLimit (number, optional): Time limit in seconds for the research session (default: 120).
- maxUrls (number, optional): Maximum number of URLs to analyze (default: 50).
**Prompt Example:** "Research the environmental impact of electric vehicles versus gasoline vehicles."
**Usage Example:**
\`\`\`json
{
  "name": "firecrawl_deep_research",
  "arguments": {
    "query": "What are the environmental impacts of electric vehicles compared to gasoline vehicles?",
    "maxDepth": 3,
    "timeLimit": 120,
    "maxUrls": 50
  }
}
\`\`\`
**Returns:** Final analysis generated by an LLM based on research. (data.finalAnalysis); may also include structured activities and sources used in the research process.
 |
| `firecrawl_generate_llmstxt` | 
Generate a standardized llms.txt (and optionally llms-full.txt) file for a given domain. This file defines how large language models should interact with the site.

**Best for:** Creating machine-readable permission guidelines for AI models.
**Not recommended for:** General content extraction or research.
**Arguments:**
- url (string, required): The base URL of the website to analyze.
- maxUrls (number, optional): Max number of URLs to include (default: 10).
- showFullText (boolean, optional): Whether to include llms-full.txt contents in the response.
**Prompt Example:** "Generate an LLMs.txt file for example.com."
**Usage Example:**
\`\`\`json
{
  "name": "firecrawl_generate_llmstxt",
  "arguments": {
    "url": "https://example.com",
    "maxUrls": 20,
    "showFullText": true
  }
}
\`\`\`
**Returns:** LLMs.txt file contents (and optionally llms-full.txt).
 |

### mcp_server_mysql

**工具数量**: 7

| 工具名称 | 描述 |
|----------|------|
| `connect_db` | Connect to MySQL database |
| `query` | Execute a SELECT query,can not get table structure,use describe_table tool to get table structure |
| `execute` | Execute an INSERT, UPDATE, or DELETE query |
| `list_tables` | List all tables in the database |
| `describe_table` | Get table structure |
| `show_statement` | Execute a SHOW statement (e.g., SHOW STATUS, SHOW VARIABLES) |
| `explain` | Analyze SQL query performance using EXPLAIN |

### MySQL

**工具数量**: 1

| 工具名称 | 描述 |
|----------|------|
| `execute_sql` | Execute an SQL query on the MySQL server |

### image-search-unsplash

**工具数量**: 1

| 工具名称 | 描述 |
|----------|------|
| `downloadProjectImage` | 根据关键词搜索图片，下载到指定的项目文件夹，并返回相对路径以便引用 |

## ❌ 查询失败的服务器

### gitee

**错误**: Command failed: npx -y @modelcontextprotocol/inspector --cli --config "C:\Users\Administrator\.claude.json" --server "gitee" --method tools/list
Command is required.

Failed with exit code: 1


**错误输出**:
```
Command is required.

Failed with exit code: 1

```

### tavily

**错误**: Command failed: npx -y @modelcontextprotocol/inspector --cli --config "C:\Users\Administrator\.claude.json" --server "tavily" --method tools/list
Command is required.

Failed with exit code: 1


**错误输出**:
```
Command is required.

Failed with exit code: 1

```

## 🔧 工具分类

### GitHub (40 个工具)

- **`add_comment_to_pending_review`**: Add review comment to the requester's latest pending pull request review. A pending review needs to already exist to call this (check with the user if not sure).
- **`add_issue_comment`**: Add a comment to a specific issue in a GitHub repository. Use this tool to add comments to pull requests as well (in this case pass pull request number as issue_number), but only if user is not asking specifically to add review comments.
- **`assign_copilot_to_issue`**: Assign Copilot to a specific issue in a GitHub repository.

This tool can help with the following outcomes:
- a Pull Request created with source code changes to resolve the issue


More information can be found at:
- https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/about-assigning-tasks-to-copilot

- **`create_branch`**: Create a new branch in a GitHub repository
- **`create_or_update_file`**: Create or update a single file in a GitHub repository. If updating, you must provide the SHA of the file you want to update. Use this tool to create or update a file in a GitHub repository remotely; do not use it for local file operations.
- **`create_pull_request`**: Create a new pull request in a GitHub repository.
- **`create_repository`**: Create a new GitHub repository in your account or specified organization
- **`delete_file`**: Delete a file from a GitHub repository
- **`fork_repository`**: Fork a GitHub repository to your account or specified organization
- **`get_commit`**: Get details for a commit from a GitHub repository
- **`get_file_contents`**: Get the contents of a file or directory from a GitHub repository
- **`get_label`**: Get a specific label from a repository.
- **`get_latest_release`**: Get the latest release in a GitHub repository
- **`get_me`**: Get details of the authenticated GitHub user. Use this when a request is about the user's own profile for GitHub. Or when information is missing to build other tool calls.
- **`get_release_by_tag`**: Get a specific release by its tag name in a GitHub repository
- **`get_tag`**: Get details about a specific git tag in a GitHub repository
- **`get_team_members`**: Get member usernames of a specific team in an organization. Limited to organizations accessible with current credentials
- **`get_teams`**: Get details of the teams the user is a member of. Limited to organizations accessible with current credentials
- **`issue_read`**: Get information about a specific issue in a GitHub repository.
- **`issue_write`**: Create a new or update an existing issue in a GitHub repository.
- **`list_branches`**: List branches in a GitHub repository
- **`list_commits`**: Get list of commits of a branch in a GitHub repository. Returns at least 30 results per page by default, but can return more if specified using the perPage parameter (up to 100).
- **`list_issue_types`**: List supported issue types for repository owner (organization).
- **`list_issues`**: List issues in a GitHub repository. For pagination, use the 'endCursor' from the previous response's 'pageInfo' in the 'after' parameter.
- **`list_pull_requests`**: List pull requests in a GitHub repository. If the user specifies an author, then DO NOT use this tool and use the search_pull_requests tool instead.
- **`list_releases`**: List releases in a GitHub repository
- **`list_tags`**: List git tags in a GitHub repository
- **`merge_pull_request`**: Merge a pull request in a GitHub repository.
- **`pull_request_read`**: Get information on a specific pull request in GitHub repository.
- **`pull_request_review_write`**: Create and/or submit, delete review of a pull request.

Available methods:
- create: Create a new review of a pull request. If "event" parameter is provided, the review is submitted. If "event" is omitted, a pending review is created.
- submit_pending: Submit an existing pending review of a pull request. This requires that a pending review exists for the current user on the specified pull request. The "body" and "event" parameters are used when submitting the review.
- delete_pending: Delete an existing pending review of a pull request. This requires that a pending review exists for the current user on the specified pull request.

- **`push_files`**: Push multiple files to a GitHub repository in a single commit
- **`request_copilot_review`**: Request a GitHub Copilot code review for a pull request. Use this for automated feedback on pull requests, usually before requesting a human reviewer.
- **`search_code`**: Fast and precise code search across ALL GitHub repositories using GitHub's native search engine. Best for finding exact symbols, functions, classes, or specific code patterns.
- **`search_issues`**: Search for issues in GitHub repositories using issues search syntax already scoped to is:issue
- **`search_pull_requests`**: Search for pull requests in GitHub repositories using issues search syntax already scoped to is:pr
- **`search_repositories`**: Find GitHub repositories by name, description, readme, topics, or other metadata. Perfect for discovering projects, finding examples, or locating specific repositories across GitHub.
- **`search_users`**: Find GitHub users by username, real name, or other profile information. Useful for locating developers, contributors, or team members.
- **`sub_issue_write`**: Add a sub-issue to a parent issue in a GitHub repository.
- **`update_pull_request`**: Update an existing pull request in a GitHub repository.
- **`update_pull_request_branch`**: Update the branch of a pull request with the latest changes from the base branch.

### firecrawl-mcp-server (8 个工具)

- **`firecrawl_scrape`**: 
Scrape content from a single URL with advanced options. 
This is the most powerful, fastest and most reliable scraper tool, if available you should always default to using this tool for any web scraping needs.

**Best for:** Single page content extraction, when you know exactly which page contains the information.
**Not recommended for:** Multiple pages (use batch_scrape), unknown page (use search), structured data (use extract).
**Common mistakes:** Using scrape for a list of URLs (use batch_scrape instead). If batch scrape doesnt work, just use scrape and call it multiple times.
**Prompt Example:** "Get the content of the page at https://example.com."
**Usage Example:**
```json
{
  "name": "firecrawl_scrape",
  "arguments": {
    "url": "https://example.com",
    "formats": ["markdown"],
    "maxAge": 3600000
  }
}
```
**Performance:** Add maxAge parameter for 500% faster scrapes using cached data.
**Returns:** Markdown, HTML, or other formats as specified.

- **`firecrawl_map`**: 
Map a website to discover all indexed URLs on the site.

**Best for:** Discovering URLs on a website before deciding what to scrape; finding specific sections of a website.
**Not recommended for:** When you already know which specific URL you need (use scrape or batch_scrape); when you need the content of the pages (use scrape after mapping).
**Common mistakes:** Using crawl to discover URLs instead of map.
**Prompt Example:** "List all URLs on example.com."
**Usage Example:**
```json
{
  "name": "firecrawl_map",
  "arguments": {
    "url": "https://example.com"
  }
}
```
**Returns:** Array of URLs found on the site.

- **`firecrawl_crawl`**: 
Starts an asynchronous crawl job on a website and extracts content from all pages.

**Best for:** Extracting content from multiple related pages, when you need comprehensive coverage.
**Not recommended for:** Extracting content from a single page (use scrape); when token limits are a concern (use map + batch_scrape); when you need fast results (crawling can be slow).
**Warning:** Crawl responses can be very large and may exceed token limits. Limit the crawl depth and number of pages, or use map + batch_scrape for better control.
**Common mistakes:** Setting limit or maxDepth too high (causes token overflow); using crawl for a single page (use scrape instead).
**Prompt Example:** "Get all blog posts from the first two levels of example.com/blog."
**Usage Example:**
```json
{
  "name": "firecrawl_crawl",
  "arguments": {
    "url": "https://example.com/blog/*",
    "maxDepth": 2,
    "limit": 100,
    "allowExternalLinks": false,
    "deduplicateSimilarURLs": true
  }
}
```
**Returns:** Operation ID for status checking; use firecrawl_check_crawl_status to check progress.

- **`firecrawl_check_crawl_status`**: 
Check the status of a crawl job.

**Usage Example:**
```json
{
  "name": "firecrawl_check_crawl_status",
  "arguments": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```
**Returns:** Status and progress of the crawl job, including results if available.

- **`firecrawl_search`**: 
Search the web and optionally extract content from search results. This is the most powerful search tool available, and if available you should always default to using this tool for any web search needs.

**Best for:** Finding specific information across multiple websites, when you don't know which website has the information; when you need the most relevant content for a query.
**Not recommended for:** When you already know which website to scrape (use scrape); when you need comprehensive coverage of a single website (use map or crawl).
**Common mistakes:** Using crawl or map for open-ended questions (use search instead).
**Prompt Example:** "Find the latest research papers on AI published in 2023."
**Usage Example:**
```json
{
  "name": "firecrawl_search",
  "arguments": {
    "query": "latest AI research papers 2023",
    "limit": 5,
    "lang": "en",
    "country": "us",
    "scrapeOptions": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
```
**Returns:** Array of search results (with optional scraped content).

- **`firecrawl_extract`**: 
Extract structured information from web pages using LLM capabilities. Supports both cloud AI and self-hosted LLM extraction.

**Best for:** Extracting specific structured data like prices, names, details.
**Not recommended for:** When you need the full content of a page (use scrape); when you're not looking for specific structured data.
**Arguments:**
- urls: Array of URLs to extract information from
- prompt: Custom prompt for the LLM extraction
- systemPrompt: System prompt to guide the LLM
- schema: JSON schema for structured data extraction
- allowExternalLinks: Allow extraction from external links
- enableWebSearch: Enable web search for additional context
- includeSubdomains: Include subdomains in extraction
**Prompt Example:** "Extract the product name, price, and description from these product pages."
**Usage Example:**
```json
{
  "name": "firecrawl_extract",
  "arguments": {
    "urls": ["https://example.com/page1", "https://example.com/page2"],
    "prompt": "Extract product information including name, price, and description",
    "systemPrompt": "You are a helpful assistant that extracts product information",
    "schema": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "price": { "type": "number" },
        "description": { "type": "string" }
      },
      "required": ["name", "price"]
    },
    "allowExternalLinks": false,
    "enableWebSearch": false,
    "includeSubdomains": false
  }
}
```
**Returns:** Extracted structured data as defined by your schema.

- **`firecrawl_deep_research`**: 
Conduct deep web research on a query using intelligent crawling, search, and LLM analysis.

**Best for:** Complex research questions requiring multiple sources, in-depth analysis.
**Not recommended for:** Simple questions that can be answered with a single search; when you need very specific information from a known page (use scrape); when you need results quickly (deep research can take time).
**Arguments:**
- query (string, required): The research question or topic to explore.
- maxDepth (number, optional): Maximum recursive depth for crawling/search (default: 3).
- timeLimit (number, optional): Time limit in seconds for the research session (default: 120).
- maxUrls (number, optional): Maximum number of URLs to analyze (default: 50).
**Prompt Example:** "Research the environmental impact of electric vehicles versus gasoline vehicles."
**Usage Example:**
```json
{
  "name": "firecrawl_deep_research",
  "arguments": {
    "query": "What are the environmental impacts of electric vehicles compared to gasoline vehicles?",
    "maxDepth": 3,
    "timeLimit": 120,
    "maxUrls": 50
  }
}
```
**Returns:** Final analysis generated by an LLM based on research. (data.finalAnalysis); may also include structured activities and sources used in the research process.

- **`firecrawl_generate_llmstxt`**: 
Generate a standardized llms.txt (and optionally llms-full.txt) file for a given domain. This file defines how large language models should interact with the site.

**Best for:** Creating machine-readable permission guidelines for AI models.
**Not recommended for:** General content extraction or research.
**Arguments:**
- url (string, required): The base URL of the website to analyze.
- maxUrls (number, optional): Max number of URLs to include (default: 10).
- showFullText (boolean, optional): Whether to include llms-full.txt contents in the response.
**Prompt Example:** "Generate an LLMs.txt file for example.com."
**Usage Example:**
```json
{
  "name": "firecrawl_generate_llmstxt",
  "arguments": {
    "url": "https://example.com",
    "maxUrls": 20,
    "showFullText": true
  }
}
```
**Returns:** LLMs.txt file contents (and optionally llms-full.txt).


### mcp_server_mysql (7 个工具)

- **`connect_db`**: Connect to MySQL database
- **`query`**: Execute a SELECT query,can not get table structure,use describe_table tool to get table structure
- **`execute`**: Execute an INSERT, UPDATE, or DELETE query
- **`list_tables`**: List all tables in the database
- **`describe_table`**: Get table structure
- **`show_statement`**: Execute a SHOW statement (e.g., SHOW STATUS, SHOW VARIABLES)
- **`explain`**: Analyze SQL query performance using EXPLAIN

### MySQL (1 个工具)

- **`execute_sql`**: Execute an SQL query on the MySQL server

### image-search-unsplash (1 个工具)

- **`downloadProjectImage`**: 根据关键词搜索图片，下载到指定的项目文件夹，并返回相对路径以便引用

