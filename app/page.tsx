import { Heart, Sparkles, MessageCircle, Gift } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">

      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">AI Zikrya</h1>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <Gift className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Decorative Elements */}
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-4 text-pink-300 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="absolute -top-2 -right-6 text-purple-300 animate-pulse" style={{ animationDelay: "0.5s" }}>
              <Heart className="w-5 h-5" />
            </div>
            <div className="absolute -bottom-2 left-8 text-pink-300 animate-pulse" style={{ animationDelay: "1s" }}>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Meet AI Zikrya
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-pink-500" />
              <p className="text-lg sm:text-xl text-slate-600 font-medium">Your personal AI Me</p>
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
          </div>

          {/* Description */}
          <div className="mb-12 max-w-2xl mx-auto">
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-4">
              I wanted to make you something to text when I'm not around, but you can still feel like you're texting me
            </p>
            <p className="text-sm sm:text-base text-slate-500">
              If you need some advise but I'm not around maybe AI Zack can help you out in my place
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Always Available</h3>
              <p className="text-sm text-slate-600">He's always here for you no matter what time it is</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Zack-ish Answers</h3>
              <p className="text-sm text-slate-600">Well I couldn't train the AI to be exactly like me, but I would say it stills follow my mannerisms</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Love Ya</h3>
              <p className="text-sm text-slate-600">I thought this would be something stupid and cool you make like</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-8">
            <a
              href="/chat"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold text-lg hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-6 h-6" />
              Start Chatting with Zikrya
              <Sparkles className="w-5 h-5" />
            </a>
          </div>

          {/* Personal Note */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-pink-200 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-slate-700 italic text-center leading-relaxed">
              Honestly at first I wasn't going to do my whole building you a project as a card for this birthday because well I couldn't find the time to build something cool enough. But idk why but I felt wrong not doing it. So after work I decided to brush up the old AI Dev and see if this would be something you appreciated it. It was worth all the late nights and errors, because you deserve it!
            </p>
            <p className="text-sm text-slate-500 text-center mt-4 font-medium">I love you!</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-slate-200 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Made with love, just for you</span>
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
        </div>
      </footer>
    </div>
  )
}
