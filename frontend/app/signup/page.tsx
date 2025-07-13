import { SignUpForm } from "@/components/signup-form"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">P</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join PongMaster</h1>
          <p className="text-gray-400">Create your account to start playing</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
