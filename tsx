import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRedirectPath = () => {
    return redirectAfterAuth || searchParams.get("redirect") || "/";
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(getRedirectPath());
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth, searchParams]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.currentTarget as HTMLFormElement).email.value;
    setStep({ email });
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await signIn("email-otp", formData);

    console.log("signed in");

    navigate(getRedirectPath());
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Attempting anonymous sign in...");
      await signIn("anonymous");
      console.log("Anonymous sign in successful");
      navigate(getRedirectPath());
    } catch (error) {
      console.error("Guest login error:", error);
      setError("Failed to sign in as guest. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/app");
    } else {
      navigate("/auth?redirect=/app");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none z-0" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              PharmaAuth
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:inline">
              {user?.email}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => signOut()}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div variants={item} className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Verify Your Medicine</h1>
            <p className="text-gray-400 text-lg">
              Scan the QR code on the packaging to verify authenticity via blockchain.
            </p>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-pointer group h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="p-4 rounded-full bg-cyan-500/10 mb-6 group-hover:scale-110 transition-transform">
                <Scan className="h-12 w-12 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Scan QR Code</h2>
              <p className="text-gray-400">Use your camera to scan and verify</p>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/50 transition-all cursor-pointer group h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="p-4 rounded-full bg-purple-500/10 mb-6 group-hover:scale-110 transition-transform">
                <History className="h-12 w-12 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Scan History</h2>
              <p className="text-gray-400">View your past verifications</p>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-slate-900/50 backdrop-blur-xl border border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  No scans recorded yet.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}