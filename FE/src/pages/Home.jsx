import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Shield, ArrowRight, BookOpen, Target, Award } from "lucide-react"
import { KonsultasiSection } from "@/components/KonsultasiSection"

export const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 mt-24">

      {/* HERO */}
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <Badge className="mb-4 sm:mb-6 text-accent border-0 hover:opacity-90 text-sm sm:text-base">
              Platform Resmi Niat Umroh
            </Badge>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6 text-gray-900">
              Wujudkan Impian Umroh
              <span className="block mt-1 sm:mt-2 text-primary">
                Dengan Tabungan Terencana
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 lg:mb-10 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed text-gray-600 px-4">
              Mulai persiapan ibadah umroh Anda dengan sistem tabungan digital yang aman, transparan, dan terpercaya.
              Raih kemudahan menabung untuk perjalanan spiritual Anda bersama Niat Umroh.
            </p>

            {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Mulai Menabung Sekarang <ArrowRight className="h-4 w-4" />
              </Button>

              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                Lihat Jadwal Keberangkatan
              </Button>
            </div> */}
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mt-12 sm:mt-16 px-4">
            <div className="text-center p-4 sm:p-6 rounded-xl shadow-sm border bg-white">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 text-primary">
                Rp500rb
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Setoran Minimal/Bulan
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 rounded-xl shadow-sm border bg-white">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 text-primary">
                12x
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Keberangkatan/Tahun
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 rounded-xl shadow-sm border bg-white">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 text-primary">
                100%
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Terjamin & Aman
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 rounded-xl shadow-sm border bg-white">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 text-primary">
                24/7
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Monitoring Tabungan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gray-900">
              Kenapa Memilih Tabungan Umroh di Niat Umroh?
            </h2>

            <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto text-gray-600">
              Keunggulan yang membuat perjalanan spiritual Anda lebih terencana dan terjamin
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <Card>
              <CardHeader>
                <Shield className="h-7 w-7 text-primary mb-2" />
                <CardTitle>Legalitas Resmi</CardTitle>
                <CardDescription>
                  Berizin Kementerian Agama & HIMPUH
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Perusahaan resmi dengan jaminan keamanan tabungan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-7 w-7 text-primary mb-2" />
                <CardTitle>Fleksibel</CardTitle>
                <CardDescription>
                  Mulai Rp500.000 per bulan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Pilihan setoran fleksibel sesuai kemampuan Anda.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-7 w-7 text-primary mb-2" />
                <CardTitle>Monitoring Real-time</CardTitle>
                <CardDescription>
                  Pantau saldo kapan saja
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Dashboard pribadi untuk memonitor tabungan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-7 w-7 text-primary mb-2" />
                <CardTitle>Layanan Premium</CardTitle>
                <CardDescription>
                  Hotel bintang 5 & pembimbing ahli
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Paket lengkap dengan fasilitas terbaik.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
      {/* KONSULTASI */}
      <KonsultasiSection />

      {/* CTA */}
      <section className="py-12 sm:py-16 lg:py-20 text-white bg-primary">
        <div className="container mx-auto text-center px-4">

        <img
          src="/logo.png"
          alt="Niat Umroh"
          className="h-44 mx-auto mb-6 bg-amber-50 rounded-xl p-2"
        />

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Mulai Perjalanan Spiritual Anda Sekarang
          </h2>

          <p className="max-w-2xl mx-auto opacity-90 mb-8">
            Jangan tunda impian bertemu Baitullah. Mulai menabung hari ini.
          </p>

          <div className="mt-10 border-t border-white/20 pt-6 text-sm opacity-90">
            <p>
              Jl. Pangkaian Raya Gg. Dahlia, Cibuluh, Bogor Utara
            </p>
            <p className="mt-1">
              0878-7479-0441 | Buka Senin-Minggu 08:00-17:00 WIB
            </p>
          </div>

        </div>
      </section>


    </div>
  )
}