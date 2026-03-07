import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const username = "manideep395";
    
    // Fetch repos
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=30&sort=updated`, {
      headers: { "Accept": "application/vnd.github.v3+json" },
    });
    if (!reposRes.ok) throw new Error(`GitHub API error: ${reposRes.status}`);
    const repos = await reposRes.json();

    // Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { "Accept": "application/vnd.github.v3+json" },
    });
    const user = userRes.ok ? await userRes.json() : null;

    // Calculate language stats
    const languageCount: Record<string, number> = {};
    let totalStars = 0;
    for (const repo of repos) {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
      totalStars += repo.stargazers_count || 0;
    }

    const languages = Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / repos.length) * 100) }));

    return new Response(JSON.stringify({
      user: user ? {
        name: user.name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
      } : null,
      repos: repos.map((r: any) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        html_url: r.html_url,
        homepage: r.homepage,
        updated_at: r.updated_at,
      })),
      stats: {
        totalRepos: repos.length,
        totalStars,
        languages,
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("GitHub fetch error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
