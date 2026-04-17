import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  User, 
  Lock, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Terminal,
  Server,
  Layers,
  Container,
  Activity
} from 'lucide-react';
import axios from 'axios';

// --- Types ---
interface UserProfile {
  name: string;
  title: string;
  bio: string;
  skills: string[];
}

// --- Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", loading = false, disabled = false }: any) => {
  const base = "px-6 py-2.5 rounded-full font-medium transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20",
    outline: "border border-white/20 hover:bg-white/5 text-white",
    ghost: "text-white/70 hover:text-white"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      className={`${base} ${variants[variant as keyof typeof variants]}`}
    >
      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
    </button>
  );
};

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setView('dashboard');
      fetchProfile(res.data.userId);
    } catch (err) {
      setError('Login failed. Try email: demo@example.com, pass: password');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const res = await axios.get(`/api/users/${userId}`);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAIAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/ai/analyze', { resumeText });
      setAiAnalysis(res.data.advice);
    } catch (err) {
      setError('AI Service connection error. Ensure API key is set.');
    } finally {
      setLoading(false);
    }
  };

  const ArchitectureNode = ({ icon: Icon, label, status, sub }: any) => (
    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
      <div className={`p-2 rounded-lg ${status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xs font-mono text-white/50">{sub}</div>
        <div className="text-sm font-medium text-white">{label}</div>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
        <span className="text-[10px] uppercase font-bold tracking-widest text-white/30">{status}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <nav className="fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
            <Briefcase size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">Career<span className="text-blue-500">Copilot</span></span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => setView('landing')}>Home</Button>
          {view === 'landing' && <Button onClick={() => setView('login')}>Sign In</Button>}
          {view === 'dashboard' && <Button variant="outline" onClick={() => { setToken(null); setView('landing'); }}>Logout</Button>}
        </div>
      </nav>

      <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]"
            >
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6"
                >
                  <Sparkles size={14} />
                  MICROSERVICES ARCHITECTURE DEMO
                </motion.div>
                <h1 className="text-6xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">
                  PRO-GRADE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">BACKEND & OPS</span>
                </h1>
                <p className="text-xl text-white/50 mb-8 max-w-lg leading-relaxed">
                  Experience a real microservices ecosystem. Independent services for Auth, Users, and AI, orchestrated by a highly available API Gateway.
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => setView('login')}>Launch Dashboard <ChevronRight size={18} /></Button>
                  <Button variant="outline">View Architecture</Button>
                </div>
              </div>

              <div className="relative">
                <Card className="relative z-10 border-white/20">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-mono text-sm text-white/40 uppercase tracking-widest flex items-center gap-2">
                       <Server size={14} /> Cluster Status
                    </h3>
                    <div className="flex items-center gap-2 px-2 py-1 rounded bg-green-500/10 text-green-500 text-[10px] font-bold">
                       ACTIVE CLUSTER
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <ArchitectureNode icon={Lock} label="Auth Service" status="online" sub="PORT 3001" />
                    <ArchitectureNode icon={User} label="User Service" status="online" sub="PORT 3002" />
                    <ArchitectureNode icon={Sparkles} label="AI Insights" status="online" sub="PORT 3003" />
                    <ArchitectureNode icon={Layers} label="API Gateway" status="online" sub="PORT 3000" />
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-xs font-mono text-white/30 tracking-widest uppercase">Kubernetes Nodes</span>
                       <span className="text-xs text-white/60">3 Replicas</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      {[...Array(24)].map((_, i) => (
                        <div key={i} className={`flex-1 rounded-full ${i < 18 ? 'bg-blue-500' : 'bg-white/10'}`} />
                      ))}
                    </div>
                  </div>
                </Card>
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -z-1" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -z-1" />
              </div>
            </motion.div>
          )}

          {view === 'login' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto py-12"
            >
              <Card>
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 rounded-2xl bg-blue-600/20 text-blue-400 mb-4">
                    <Lock size={32} />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Service Login</h2>
                  <p className="text-white/40">Enter credentials to authenticate with Auth Service</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 block">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-colors"
                      placeholder="name@company.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 block">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  <Button className="w-full mt-4" loading={loading} onClick={handleLogin}>Authenticate</Button>
                  <div className="text-center mt-6">
                    <p className="text-xs text-white/30">Mock Credentials: demo@example.com / password</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-bold">Hello, {profile?.name || 'Developer'}</h2>
                  <p className="text-white/40 text-lg">{profile?.title} • Career Management Dashboard</p>
                </div>
                <div className="flex gap-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                    <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
                      <Activity size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Session Token</div>
                      <div className="text-xs font-mono text-white/60">VALID_JWT_AUTH</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Content */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Profile & Skills */}
                <div className="space-y-8">
                  <Card>
                    <div className="flex items-center gap-3 mb-6">
                      <User className="text-blue-400" size={20} />
                      <h3 className="font-bold">Managed Profile</h3>
                    </div>
                    <div className="space-y-4">
                       <div>
                         <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1 block">Bio</label>
                         <p className="text-sm text-white/70 leading-relaxed">{profile?.bio}</p>
                       </div>
                       <div>
                         <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 block">Top Skills</label>
                         <div className="flex flex-wrap gap-2">
                           {profile?.skills.map(s => (
                             <span key={s} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold">{s}</span>
                           ))}
                         </div>
                       </div>
                    </div>
                  </Card>

                  <Card className="border-blue-500/20 bg-blue-500/5">
                    <h3 className="font-bold flex items-center gap-2 mb-4">
                      <Terminal size={18} className="text-blue-400" />
                      DevOps Insights
                    </h3>
                    <div className="space-y-3 font-mono text-[11px]">
                      <div className="flex justify-between">
                         <span className="text-white/40">ORCHESTRATOR</span>
                         <span className="text-blue-400">Kubernetes 1.28</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-white/40">DB_STRATEGY</span>
                         <span className="text-blue-400">Polyglot Persistence</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-white/40">NETWORKING</span>
                         <span className="text-blue-400">Service Mesh (Istio)</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right: AI Copilot */}
                <div className="lg:col-span-2 space-y-8">
                  <Card>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-600/20 text-purple-400 rounded-lg">
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold">AI Career Copilot</h3>
                          <p className="text-xs text-white/30">Service: ai-engine-v1</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={handleAIAnalyze} loading={loading}>
                        Generate Insights
                      </Button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 block">Resume / Goal Narrative</label>
                        <textarea 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[150px] outline-none focus:border-purple-500/50 transition-colors text-sm"
                          placeholder="Paste your resume content or career goals here..."
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                        />
                      </div>

                      {aiAnalysis && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20"
                        >
                          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest mb-4">
                            <CheckCircle2 size={16} /> Analysis Complete
                          </div>
                          <div className="prose prose-invert prose-sm max-w-none text-white/80 whitespace-pre-wrap">
                            {aiAnalysis}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </Card>

                  {/* K8s Diagram Visualization */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                      <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6">Service Communication</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-blue-400">UI</div>
                          <div className="flex-1 h-[2px] bg-gradient-to-r from-blue-500 to-white/10" />
                          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-purple-400 italic">GW</div>
                        </div>
                        <div className="pl-12 space-y-3">
                           <div className="flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                             <span className="text-[10px] font-mono text-white/60">/api/auth → auth-svc</span>
                           </div>
                           <div className="flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                             <span className="text-[10px] font-mono text-white/60">/api/user → user-svc</span>
                           </div>
                           <div className="flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                             <span className="text-[10px] font-mono text-white/60">/api/ai → ai-svc</span>
                           </div>
                        </div>
                      </div>
                    </Card>

                    <Card>
                      <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6">Infrastructure Stack</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                          <Container size={20} className="mx-auto mb-2 text-blue-400" />
                          <div className="text-[10px] font-bold">DOCKER</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                          <Layers size={20} className="mx-auto mb-2 text-blue-400" />
                          <div className="text-[10px] font-bold">K8S</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                          <Activity size={20} className="mx-auto mb-2 text-blue-400" />
                          <div className="text-[10px] font-bold">GRAFANA</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                          <Briefcase size={20} className="mx-auto mb-2 text-blue-400" />
                          <div className="text-[10px] font-bold">ACTIONS</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-white/5 py-12 px-6 text-center text-white/20 text-xs font-mono tracking-widest uppercase">
        Built with Enterprise Microservices Architecture • AI Studio Simulation
      </footer>
    </div>
  );
}
