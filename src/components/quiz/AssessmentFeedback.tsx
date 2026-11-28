import { LocaleLink as Link } from '@/components/providers/LocaleProvider'
import { DIMENSIONS, type DimensionKey, type QuizAssessmentReview } from '@/lib/domain/quiz'

const PRACTICE = {
  bisnis: 'Tulis dua cara menarik pelanggan untuk sebuah toko. Bandingkan biaya, margin, dan alasan pelanggan memilih masing-masing cara.',
  data: 'Hitung persentase pengunjung yang membeli di dua kanal. Bandingkan dengan jumlah pesanan sebelum menentukan kanal prioritas.',
  teknologi: 'Petakan satu tugas berulang yang bisa dibantu AI. Tentukan data apa yang aman dipakai dan bagian mana yang perlu diperiksa manusia.',
  kreatif: 'Buat sketsa alur checkout. Amati apakah dua orang bisa menyelesaikannya dan catat bagian yang membuat mereka ragu.',
}

const EN_PRACTICE = {
  bisnis: 'Write down two ways a store could attract customers. Compare costs, margins, and why customers would choose each option.',
  data: 'Calculate the percentage of visitors who make a purchase in two channels. Compare the percentages with order counts before deciding which channel to prioritize.',
  teknologi: 'Map out a repetitive task that AI could help with. Decide which data is safe to use and which steps need human review.',
  kreatif: 'Sketch a checkout flow. Watch two people try to complete it and note where they hesitate.',
}

const EN_DIMENSIONS: Record<DimensionKey, string> = {
  bisnis: 'Business and Strategy',
  data: 'Data and Analytics',
  teknologi: 'Technology and AI',
  kreatif: 'Creative and Product',
}

export function dimensionLabel(key: DimensionKey, locale: 'id' | 'en') {
  return locale === 'en' ? EN_DIMENSIONS[key] : DIMENSIONS.find((item) => item.key === key)?.label
}

export function AssessmentPractice({ scores, locale = 'id' }: { scores: Record<string, number>; locale?: 'id' | 'en' }) {
  const en = locale === 'en'
  const dimensions = [...DIMENSIONS].sort((a, b) => (scores[a.key] ?? 0) - (scores[b.key] ?? 0))

  return (
    <section className="sticker p-6 lg:col-span-7" aria-labelledby="latihan-judul">
      <h3 id="latihan-judul" className="text-xl font-bold">{en ? 'What to practice next' : 'Latihan berikutnya'}</h3>
      <p className="mt-2 text-sm text-ink-600">{en ? 'Start with your lowest score and pick one exercise to try.' : 'Urut dari skor terendah. Pilih satu latihan untuk dicoba.'}</p>
      <ol className="mt-4 grid gap-4 sm:grid-cols-2">
        {dimensions.map(({ key }) => (
          <li key={key} className="rounded-2xl border border-ink-200 p-4">
            <h4 className="font-bold">{dimensionLabel(key, locale)}</h4>
            <p className="mt-1 text-sm text-ink-600">{en ? EN_PRACTICE[key] : PRACTICE[key]}</p>
          </li>
        ))}
      </ol>
      <Link href="/kurikulum" className="mt-5 inline-block font-bold text-blue underline underline-offset-4">
        {en ? 'Explore the MBD curriculum' : 'Lihat kurikulum MBD'}
      </Link>
    </section>
  )
}

export function AssessmentReview({ review, locale = 'id' }: { review: QuizAssessmentReview[]; locale?: 'id' | 'en' }) {
  const en = locale === 'en'
  return (
    <section className="sticker p-6" aria-labelledby="pembahasan-judul">
      <h3 id="pembahasan-judul" className="text-xl font-bold">{en ? "Case-by-case review" : "Pembahasan tiap kasus"}</h3>
      <p className="mt-2 text-sm text-ink-600">{en ? "Open each case to see the answers and how they were scored." : "Buka setiap kasus untuk melihat jawaban dan alasan penilaiannya."}</p>
      <ol className="mt-4 grid gap-2">
        {review.map((item, index) => (
          <li key={item.id}>
            <details className="rounded-2xl border border-ink-200 bg-white">
              <summary className="cursor-pointer rounded-2xl px-4 py-3 font-semibold hover:bg-ink-50">
                {en ? 'Case' : 'Kasus'} {index + 1} · {dimensionLabel(item.dimension, locale)} · {item.points}/5 {en ? 'points' : 'poin'}
              </summary>
              <div className="grid gap-3 border-t border-ink-200 p-4 text-sm">
                <p className="font-semibold">{item.question}</p>
                <p><strong>{en ? "Your answer" : "Jawabanmu"}</strong> <span className="block text-ink-600">{item.selected}</span></p>
                <p><strong>{en ? "Highest-scoring answer" : "Jawaban dengan poin tertinggi"}</strong> <span className="block text-ink-600">{item.bestAnswer}</span></p>
                <p><strong>{en ? "Explanation" : "Pembahasan"}</strong> <span className="block text-ink-600">{item.explanation}</span></p>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  )
}
