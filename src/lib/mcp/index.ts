import { defineMcp } from "@lovable.dev/mcp-js";
import searchResourcesTool from "./tools/search-resources";
import listDomainsTool from "./tools/list-domains";
import getResourceTool from "./tools/get-resource";

export default defineMcp({
  name: "skillgram-mcp",
  title: "Skillgram MCP",
  version: "0.1.0",
  instructions:
    "Tools for exploring the Skillgram learning platform's admin-curated catalog of skills, domains, and learning resources. Use `list_domains` to discover available skill areas, `search_resources` to find courses/videos/certifications/books/blogs, and `get_resource` to fetch full details for a specific resource.",
  tools: [searchResourcesTool, listDomainsTool, getResourceTool],
});
