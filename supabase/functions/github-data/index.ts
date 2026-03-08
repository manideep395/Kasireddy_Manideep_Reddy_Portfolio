import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FALLBACK_DATA = {
  user: { name: "Manideep", avatar_url: "", bio: "Developer", public_repos: 19, followers: 0, following: 0 },
  repos: [],
  stats: { totalRepos: 19, totalStars: 0, languages: [] },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const username = "manideep395";
    const token = Deno.env.get("GITHUB_PAT");
    
    const headers: Record<string, string> = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "portfolio-app",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    
    if (!reposRes.ok) {
      console.warn(`GitHub API returned ${reposRes.status}, using fallback`);
      return new Response(JSON.stringify(FALLBACK_DATA), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const repos = await reposRes.json();

    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    const user = userRes.ok ? await userRes.json() : null;

    const languageCount: Record<string, number> = {};
    let totalStars = 0;
    for (const repo of repos) {
      if (repo.language) languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      totalStars += repo.stargazers_count || 0;
    }

    const languages = Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / repos.length) * 100) }));

    return new Response(JSON.stringify({
      user: user ? {
        name: user.name, avatar_url: user.avatar_url, bio: user.bio,
        public_repos: user.public_repos, followers: user.followers, following: user.following,
      } : null,
      repos: repos.map((r: any) => ({
        name: r.name, description: r.description, language: r.language,
        stars: r.stargazers_count, forks: r.forks_count, html_url: r.html_url,
        homepage: r.homepage, updated_at: r.updated_at,
      })),
      stats: { totalRepos: repos.length, totalStars, languages },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("GitHub fetch error:", e);
    return new Response(JSON.stringify(FALLBACK_DATA), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
