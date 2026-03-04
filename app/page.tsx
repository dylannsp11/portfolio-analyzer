import LanguageChart from '../components/LanguageChart';

export default async function Home({ searchParams }: { searchParams: Promise<{ user?: string }> }) {
  const params = await searchParams;
  

  const targetUser = params.user;

  if (!targetUser) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-8 font-sans selection:bg-zinc-800">
        <div className="max-w-2xl w-full text-center space-y-8 -mt-20">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4">
              Portfolio Analyzer
            </h1>
            <p className="text-zinc-400 text-lg">
              Uncover the coding habits, top languages, and most popular repositories of any developer on GitHub.
            </p>
          </div>
          
          <form method="GET" action="/" className="w-full flex justify-center">
            <div className="flex w-full max-w-lg rounded-xl overflow-hidden border border-zinc-800 focus-within:border-zinc-500 transition-colors bg-zinc-950 shadow-2xl">
              <input 
                type="text" 
                name="user" 
                placeholder="Search a GitHub username (e.g., gaearon)..." 
                className="w-full px-5 py-4 bg-transparent text-zinc-100 focus:outline-none placeholder-zinc-600 text-base"
                autoFocus
              />
              <button type="submit" className="px-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium border-l border-zinc-800 transition-colors">
                Analyze
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  // 3. Inject the dynamic targetUser into the query
  const query = `
    query {
      user(login: "${targetUser}") {
        name
        login
        avatarUrl
        bio
        repositories(first: 10, privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            name
            description
            url
            stargazerCount
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  `;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  const rawData = await res.json();
  
  // Quick error check in case someone searches a user that doesn't exist
  if (rawData.errors) {
    return (
      <main className="p-8 font-sans min-h-screen bg-black text-white">
        <h1 className="text-4xl font-bold mb-8 tracking-tight">Portfolio Analyzer</h1>
        <p className="text-red-400">Error: Could not find user "{targetUser}"</p>
        <a href="/" className="text-blue-400 underline mt-4 block">Go back</a>
      </main>
    );
  }

  const userData = rawData.data?.user;
  const repos = userData?.repositories?.nodes || [];

  const languageMap: Record<string, { name: string; value: number; fill: string }> = {};
  repos.forEach((repo: any) => {
    const lang = repo.primaryLanguage;
    if (lang) {
      if (languageMap[lang.name]) {
        languageMap[lang.name].value += 1;
      } else {
        languageMap[lang.name] = { name: lang.name, value: 1, fill: lang.color };
      }
    }
  });

  const chartData = Object.values(languageMap);

return (
    <main className="min-h-screen bg-black text-zinc-300 p-8 font-sans selection:bg-zinc-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 border-b border-zinc-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Portfolio Analyzer
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Developer statistics and repository breakdown.
            </p>
          </div>
          
          {/* The Search Bar Form */}
          <form method="GET" action="/" className="w-full md:w-auto flex">
            <div className="flex w-full md:w-80 rounded-md overflow-hidden border border-zinc-800 focus-within:border-zinc-500 transition-colors bg-zinc-950">
              <input 
                type="text" 
                name="user" 
                placeholder="Search GitHub username..." 
                defaultValue={targetUser}
                className="w-full px-4 py-2 bg-transparent text-zinc-100 focus:outline-none placeholder-zinc-600 text-sm"
              />
              <button type="submit" className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium border-l border-zinc-800 transition-colors">
                Search
              </button>
              </div>
          </form>
        </div>

        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Profile & Chart */}
          <div className="lg:col-span-5 space-y-8 opacity-0 animate-slide-up-fade">
            {/* ... Profile Card ... */}
            {/* ... Language Chart ... */}
          
             {/* User Profile Card */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {userData?.avatarUrl && (
                  <img src={userData.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border border-zinc-700" />
                )}
                <div>
                  <h2 className="text-xl font-bold text-white">{userData?.name || targetUser}</h2>
                  <a href={`https://github.com/${userData?.login || targetUser}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white text-sm transition-colors">
                    @{userData?.login || targetUser}
                  </a>
                </div>
              </div>
              
              {/* Only render the bio section if the user actually has one! */}
              {userData?.bio && (
                <div className="border-t border-zinc-800/60 pt-4 mt-1">
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {userData.bio}
                  </p>
                </div>
              )}
            </div>

            {/* The Chart Section */}
            <div>
              <LanguageChart data={chartData} />
            </div>
          </div>

          {/* RIGHT COLUMN: Top Repositories */}
          <div className="lg:col-span-7 opacity-0 animate-slide-up-fade" style={{ animationDelay: '150ms' }}>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              Top Repositories
              <div className="h-px bg-zinc-800 grow"></div>
            </h2>
            {/* ... Repository Cards ... */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((repo: any) => (
                <a 
                  key={repo.name} 
                  href={repo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-zinc-950 border border-zinc-800 p-5 rounded-xl hover:border-zinc-500 transition-all duration-200 block"
                >
                  <h3 className="text-base font-bold text-zinc-200 mb-2 group-hover:text-white transition-colors truncate">
                    {repo.name}
                  </h3>
                  <p className="text-zinc-500 text-sm mb-6 h-10 overflow-hidden line-clamp-2 leading-relaxed">
                    {repo.description || "No description provided."}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-2 text-zinc-400">
                      <span 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: repo.primaryLanguage?.color || '#52525b' }}
                      ></span>
                      {repo.primaryLanguage?.name || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                      {repo.stargazerCount}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
      {/* Footer Section */}
        <footer className="mt-20 border-t border-zinc-800/80 pt-8 pb-4 text-center text-zinc-600 text-sm">
          <p>© 2026 Dylan. Built with Next.js and the GitHub GraphQL API.</p>
          <p className="mt-1 text-zinc-700">
            This project is not affiliated with, endorsed by, or sponsored by GitHub.
          </p>
        </footer>
    </main>
  );
}