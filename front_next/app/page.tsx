import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#362C24] flex flex-col justify-between px-6 sm:px-12 py-8 selection:bg-[#785E48] selection:text-white">
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="font-bold text-lg tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#785E48]"></span>
          <span>TTOKDOK</span>
        </div>
        <div className="text-xs text-[#8C7A6B] font-medium tracking-wide">
          FOR HICONSY
        </div>
      </header>

      <section className="w-full max-w-3xl mx-auto text-center space-y-12 my-auto py-24">
        <div className="space-y-4">
          <span className="inline-block text-xs uppercase tracking-widest text-[#785E48] font-bold px-3 py-1 bg-[#EFECE6] rounded-full">
            📚 Smart Reading Habit
          </span>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[#2A211B] leading-tight">
            똑독{" "}
            <span className="text-[#8C7A6B] font-medium text-3xl sm:text-5xl">
              · 똑똑한 독서 습관
            </span>
          </h1>
        </div>

        <div className="py-6 border-y border-[#EFECE6] max-w-xl mx-auto">
          <p className="text-base sm:text-lg text-[#5E4837] leading-relaxed font-medium">
            어떤 책을 읽을지 아직도 고민하거나, 그저 독서를 미루고 계신가요?
            <br />
            이제부터 똑독과 함께 똑똑한 독서 습관을 만들어가요.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/recommend"
            className="hover:scale-105 w-full sm:w-auto px-10 py-4 rounded-xl bg-[#4A3C31] hover:bg-[#362C24] text-white font-bold text-base tracking-wide shadow-sm transition-all duration-200 text-center"
          >
            AI 도서 추천받기 ✨
          </Link>

          <Link
            href="/books"
            className="hover:scale-105 w-full sm:w-auto px-10 py-4 rounded-xl  bg-[#EFECE6] hover:bg-[#8C7A6B]/50 text-[#2A211B] border border-[#8C7A6B]/60 font-bold text-base tracking-wide transition-all duration-200 text-center"
          >
            독서 목록 관리하기 📖
          </Link>
        </div>
      </section>

      <footer className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C7A6B] pt-6 border-t border-[#EFECE6] gap-2">
        <div>© 2026 TTOKDOK. All rights reserved.</div>
        <div className="flex gap-4">
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </footer>
    </main>
  );
}
